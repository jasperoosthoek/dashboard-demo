import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import type { factory } from '@mswjs/data';




type WithId<T> = T & { id: number };

export function createRestHandlers<
  S extends Record<string, any>,
  F extends ReturnType<typeof factory<S>>,
  K extends keyof S,
  T extends object = S[K]
>(
  db: F,
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
  function getNextId(): number {
    const all = db[entity].getAll();
    const maxId = all.length > 0 ? Math.max(...all.map((r: any) => r.id || 0)) : 0;
    return maxId + 1;
  }
  
  // Translate relation fields (e.g., role_id → role)
  const entitySchema = schema[entity];

  function updateRecord(record: any, data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith('_id')) {
        const relationKey = key.slice(0, -3);
        const def = entitySchema[relationKey];
        if (data[relationKey] !== undefined) {
          console.log(data, relationKey)
        }


        if ((def as any)?.kind === 'ONE_OF') {
          const relatedEntity = (def as any).target.modelName;
          const related = db[relatedEntity].findFirst({
            where: { id: { equals: parseInt(value as any) } } as any,
          });

          if (related) {
            record[relationKey] = related;
            continue;
          }
        }
      } else if ((entitySchema[key] as any)?.kind === 'ONE_OF' && value === null) {
        // Skipping null value for relation field because the related entity was deleted
        continue;
      }

      record[key] = value;
    }
    return record;
  }

  return [
    http.get(basePath, () => {
      const all = db[entity].getAll() as unknown as WithId<T>[];
      return HttpResponse.json(all.map(serializeRelations));
    }),

    http.post(basePath, async ({ request }) => {
      // const { id, ...raw } =  as any;
      const data = (await request.json()) as Omit<WithId<T>, 'id'>;

      // Generate new ID
      const id = getNextId();

      const record =  updateRecord({ id }, data);
      const created = db[entity].create(record);
      return HttpResponse.json(serializeRelations(created), { status: 201 });
    }),

    http.patch(`${basePath}/:id`, async ({ params, request }) => {
      const id = Number(params.id);
      const updated = await request.json();
      const data = updateRecord({}, updated)
      console.log('Updating record',data);
      const result = db[entity].update({
        where: { id: { equals: id } } as any,
        data,
      });
      return HttpResponse.json(serializeRelations(result));
    }),

    http.delete(`${basePath}/:id`, ({ params }) => {
      const id = Number(params.id);
      const deleted = db[entity].findFirst({
        where: { id: { equals: id } } as any,
      });

      if (deleted && onDelete) onDelete(deleted as any);

      db[entity].delete({ where: { id: { equals: id } } } as any);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
