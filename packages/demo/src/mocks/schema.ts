import { primaryKey, oneOf } from '@mswjs/data';

export const schema = {

  role: {
    id: primaryKey(Number),
    name: String,
  },
  
  user: {
    id: primaryKey(Number),
    name: String,
    email: String,
    role: oneOf('role'),
    order: Number,
  },

  employee: {
    id: primaryKey(Number),
    name: String,
    department: String,
  },
  customer: {
    id: primaryKey(Number),
    name: String,
  },
  contact: {
    id: primaryKey(Number),
    name: String,
    email: String,
    customer: oneOf('customer'),
  },
  quotation: {
    id: primaryKey(Number),
    amount: Number,
    status: String,
    customer: oneOf('customer'),
    employee: oneOf('employee'),
  },
  invoice: {
    id: primaryKey(Number),
    due_date: String,
    amount: Number,
    quotation: oneOf('quotation'),
  },
  payment: {
    id: primaryKey(Number),
    amount: Number,
    method: String,
    invoice: oneOf('invoice'),
  },
  leaveRequest: {
    id: primaryKey(Number),
    employee: oneOf('employee'),
    from_date: String,
    to_date: String,
    status: String,
  },

  note: {
    id: primaryKey(Number),
    content: String,
    author: oneOf('employee'),
    related_customer: oneOf('customer'),
  },
  task: {
    id: primaryKey(Number),
    title: String,
    description: String,
    assigned_to: oneOf('employee'),
    related_project: oneOf('quotation'),
    status: String,
    due_date: String,
  },

};

export type Schema = typeof schema