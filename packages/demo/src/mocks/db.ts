import { factory, primaryKey, oneOf } from '@mswjs/data';


export type ValueOf<T> = T[keyof T];

export type InferModel<T> = {
  [K in keyof T]: T[K] extends ReturnType<typeof primaryKey>
    ? T[K] extends { __type: () => infer U } ? U : never
    : T[K] extends typeof String
    ? string
    : T[K] extends typeof Number
    ? number
    : T[K] extends ReturnType<typeof oneOf>
    ? any // you can replace with actual relation typing later
    : unknown;
};


export function persistToLocalStorage(db: any, key: string) {
  const data = Object.fromEntries(
    Object.keys(db).map((entity) => [entity, db[entity].getAll()])
  );
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage<S extends Record<string, any>>(
  db: ReturnType<typeof factory<S>>,
  schema: S,
  mockData: Record<keyof S, any[]> = {} as Record<keyof S, any[]>,
  key: string,
) {
  const raw = localStorage.getItem(key);
  if (!raw) return;

  const data = JSON.parse(raw) as Record<string, any[]>;

  // Load data in order of mockData keys to make sure all relations are resolved correctly
  for (const entity of Object.keys(mockData)) {
    const records = data[entity as keyof typeof data] || [];

    const model = db[entity as keyof typeof db];
    const modelDef = schema[entity as keyof typeof schema];

    for (const rawRecord of records) {
      const record: Record<string, any> = { ...rawRecord };

      for (const [fieldKey, fieldDef] of Object.entries(modelDef)) {
        const relationType = (fieldDef as any)?.kind;

        const relatedEntity = (fieldDef as any)?.target?.modelName;

        if (
          relationType === 'ONE_OF' &&
          typeof record[fieldKey] === 'object'
        ) {
          if (!record[fieldKey] || !record[fieldKey]?.id) {
            // Do not persist empty relations or relations without an ID
            delete record[fieldKey];
            continue;
          }
          const relationId = record[fieldKey].id;
          const reference = (db as any)[relatedEntity].findFirst({
            where: { id: { equals: relationId } },
          });

          if (reference) {
            record[fieldKey] = reference;
          }
        }
      }

      (model as any).create(record);
    }
  }
}

export function seedDatabase<S extends Record<string, any>>(
  db: ReturnType<typeof factory<S>>,
  schema: S,  
  mockData: Record<keyof S, any[]>,
) {
  for (const [entity, records] of Object.entries(mockData)) {
    const model = db[entity as keyof typeof db];
    const modelDef = schema[entity as keyof typeof schema];

    records.forEach((rawRecord) => {
      const record = { ...rawRecord };

      for (const [key, fieldDef] of Object.entries(modelDef)) {
        const relationType = (fieldDef as any)?.kind;

        if (
          (relationType === 'ONE_OF' || relationType === 'MANY_OF') &&
          record[`${key}_id`] !== undefined
        ) {
          const relatedEntity = (fieldDef as any)?.target?.modelName;
          const foreignId = record[`${key}_id`];
          const related = (db as any)[relatedEntity].findFirst({
            where: { id: { equals: foreignId } },
          });
          
          if (related) {
            record[key] = related;
          }
        }
      }

      (model as any).create(record);
    });
  }
}

