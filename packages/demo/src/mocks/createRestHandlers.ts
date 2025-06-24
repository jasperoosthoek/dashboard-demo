import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import type { factory } from '@mswjs/data';

type WithId<T> = T & { id: number };

export function createRestHandlers<
  S extends Record<string, any>,
  K extends keyof S,
  T extends object = S[K]
>(
  db: ReturnType<typeof factory<S>>,
  schema: S,
  entity: K,
  basePath: string,
  {
    onDelete,
  }: {
    onDelete?: (deleted: WithId<T>) => void;
  } = {}
): HttpHandler[] {
  const serializeRelations = (record: any): any => {
    const entitySchema = schema[entity];
    const result: Record<string, any> = { ...record };

    for (const [key, def] of Object.entries(entitySchema)) {
      if (
        (def as any)?.kind === 'ONE_OF' &&
        typeof record[key] === 'object' &&
        record[key]?.id != null
      ) {
        result[`${key}_id`] = record[key].id;
        delete result[key];
      }
    }

    return result;
  };

  return [
    http.get(basePath, () => {
      // @ts-ignore
      const all = db[entity].getAll() as WithId<T>[];
      return HttpResponse.json(all.map(serializeRelations));
    }),

    http.post(basePath, async ({ request }) => {
      const data = (await request.json()) as Omit<WithId<T>, 'id'>;
      const created = db[entity].create(data as any);
      return HttpResponse.json(serializeRelations(created), { status: 201 });
    }),

    http.put(`${basePath}/:id`, async ({ params, request }) => {
      const id = Number(params.id);
      const updated = await request.json();
      const result = db[entity].update({
      // @ts-ignore

        where: { id: { equals: id } },         data: updated,
      });
      return HttpResponse.json(serializeRelations(result));
    }),

    http.delete(`${basePath}/:id`, ({ params }) => {
      const id = Number(params.id);
      const deleted = db[entity].findFirst({
      // @ts-ignore
        where: { id: { equals: id } },
      });

      // @ts-ignore
      if (deleted && onDelete) onDelete(deleted);

      // @ts-ignore
      db[entity].delete({ where: { id: { equals: id } } });
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
