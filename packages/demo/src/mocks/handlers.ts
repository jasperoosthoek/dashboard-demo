import { factory } from '@mswjs/data';

import { seedDatabase, persistToLocalStorage, loadFromLocalStorage } from './db';
import { createRestHandlers } from './createRestHandlers';
import { schema } from './schema'
import mockData, { localStorageKey } from './mockData';

export const db = factory(schema);




const raw = localStorage.getItem(localStorageKey);
if (!raw) {

  seedDatabase(
    db,
    schema,
    mockData,
  );
  persistToLocalStorage(db, localStorageKey); 
} else {
  loadFromLocalStorage(db, schema, mockData, localStorageKey);
}
type EntityMap<S extends Record<string, any>> = {
  [K in keyof S]: S[K];
};

export const handlers = [
  ...createRestHandlers(db, schema, 'employee', '/api/employees'),
  ...createRestHandlers(db, schema, 'role', '/api/roles'),

  ...createRestHandlers(db, schema, 'employee', '/api/employees', {
    // onDelete: (employee) => {
    //   db.note.deleteMany({ where: { author: { id: { equals: employee.id } } } });
    //   db.task.deleteMany({ where: { assigned_to: { id: { equals: employee.id } } } });
    // },
  }),

  ...createRestHandlers(db, schema, 'project', '/api/projects'),

  ...createRestHandlers(db, schema, 'customer', '/api/customers', {
    // onDelete: (customer) => {
    //   db.note.deleteMany({ where: { customer: { id: { equals: customer.id } } } });
    // },
  }),

  ...createRestHandlers(db, schema, 'invoice', '/api/invoices'),

  ...createRestHandlers(db, schema, 'note', '/api/notes'),
  ...createRestHandlers(db, schema, 'task', '/api/tasks'),
];