import { primaryKey, oneOf } from '@mswjs/data';

export const schema = {

  employee: {
    id: primaryKey(Number),
    name: String,
    email: String,
    role: oneOf('role'),
    order: Number,
    department: String,
    active: Boolean,
  },

  role: {
    id: primaryKey(Number),
    name: String,
  },

  customer: {
    id: primaryKey(Number),
    name: String,
    contact_person: String,
    email: String,
  },

  project: {
    id: primaryKey(Number),
    name: String,
    amount: Number,
    status: String,
    customer: oneOf('customer'),
    employee: oneOf('employee'),
    start_date: String,
    end_date: String,
  },

  invoice: {
    id: primaryKey(Number),
    due_date: String,
    amount: Number,
    status: String,
    project: oneOf('project'),
  },

  task: {
    id: primaryKey(Number),
    title: String,
    description: String,
    assigned_to: oneOf('employee'),
    related_project: oneOf('project'),
    status: String,
    due_date: String,
    priority: String,
  },

  note: {
    id: primaryKey(Number),
    content: String,
    author: oneOf('employee'),
    related_customer: oneOf('customer'),
    created_at: String,
  },
};

export type Schema = typeof schema