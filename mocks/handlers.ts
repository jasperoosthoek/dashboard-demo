import { factory } from '@mswjs/data';

import { seedDatabase, persistToLocalStorage, loadDatabaseDump, resetDatabase } from './db';
import { createRestHandlers } from './createRestHandlers';
import { schema } from './schema'
import mockData, { localStorageKey } from './mockData';

export const db = factory(schema);

let raw = localStorage.getItem(localStorageKey);

if (raw) {
  console.log('Loading mock database with data from localStorage.')
  try {
    const data = JSON.parse(raw) as Record<string, any[]>;
    loadDatabaseDump(db, schema, mockData, data);
  } catch (e) {
    console.error('An error occured trying to load mock data from localStorage, delete localStorage', e)
    resetDatabase(db);
    localStorage.removeItem(localStorageKey);
    raw = null;
  }
}

if (!raw) {
  console.log('Seeding mock database with new data.')
  seedDatabase(
    db,
    schema,
    mockData,
  );
  persistToLocalStorage(db, localStorageKey); 
}

window.addEventListener('customError', (e) => {
  // Get error from ErrorBoundary in /src/app/app.tsx. Clear the localStorage when this happens so
  // the mock database starts fresh. The mock database is for demonstration use only, normally 
  // a real backend such as a Django app is used.
  console.log('An unhandled error occured, delete localStorage', e)
  localStorage.removeItem(localStorageKey);
});

export const handlers = [
  ...createRestHandlers(db, schema, 'employee', '/api/employees', {
    onDelete: (employee) => {
      db.note.deleteMany({ where: { employee: { id: { equals: employee.id } } } });
      db.task.deleteMany({ where: { employee: { id: { equals: employee.id } } } });
    },
  }),
  ...createRestHandlers(db, schema, 'role', '/api/roles'),
  ...createRestHandlers(db, schema, 'project', '/api/projects'),
  ...createRestHandlers(db, schema, 'customer', '/api/customers'),
  ...createRestHandlers(db, schema, 'invoice', '/api/invoices'),
  ...createRestHandlers(db, schema, 'note', '/api/notes'),
  ...createRestHandlers(db, schema, 'task', '/api/tasks'),
];
