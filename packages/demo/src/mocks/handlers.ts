import { factory, primaryKey, oneOf } from '@mswjs/data';

import { seedDatabase, InferModel } from './db';
import { createRestHandlers } from './createRestHandlers';
import { schema, Schema } from './schema'


export const db = factory(schema);


export const mockData: Record<keyof Schema, any[]> = {
  role: [
    { id: 1, name: 'Software Engineer' },
    { id: 2, name: 'Project Manager' },
    { id: 3, name: 'UX Designer' },
    { id: 4, name: 'Marketing Manager' },
    { id: 5, name: 'Data Scientist' },
    { id: 6, name: 'HR Coordinator' },
    { id: 7, name: 'Backend Developer' },
    { id: 8, name: 'Financial Analyst' },
    { id: 9, name: 'QA Engineer' },
    { id: 10, name: 'Legal Advisor' },
    { id: 11, name: 'Product Owner' },
    { id: 12, name: 'DevOps Engineer' },
    { id: 13, name: 'Business Analyst' },
    { id: 14, name: 'Cybersecurity Specialist' },
    { id: 15, name: 'Marketing Coordinator' },
    { id: 16, name: 'Full Stack Developer' },
    { id: 17, name: 'Data Engineer' },
    { id: 18, name: 'IT Manager' },
    { id: 19, name: 'Customer Support Manager' },
    { id: 20, name: 'Security Analyst' },
    { id: 21, name: 'HR Manager' },
    { id: 22, name: 'Software Architect' },
    { id: 23, name: 'SEO Specialist' },
    { id: 24, name: 'AI Researcher' },
    { id: 25, name: 'Social Media Manager' },
    { id: 26, name: 'Database Administrator' },
    { id: 27, name: 'Copywriter' },
    { id: 28, name: 'IT Consultant' },
    { id: 29, name: 'Legal Consultant' },
    { id: 30, name: 'Technical Writer' },
    { id: 31, name: 'HR Associate' },
    { id: 32, name: 'Embedded Systems Engineer' },
    { id: 33, name: 'Customer Success Manager' },
    { id: 34, name: 'Machine Learning Engineer' },
    { id: 35, name: 'Community Manager' },
    { id: 36, name: 'Frontend Developer' },
    { id: 37, name: 'Scrum Master' },
    { id: 38, name: 'Networking Engineer' },
    { id: 39, name: 'HR Specialist' },
    { id: 40, name: 'Blockchain Developer' },
    { id: 41, name: 'Content Strategist' },
    { id: 42, name: 'Game Developer' },
    { id: 43, name: 'Data Analyst' },
    { id: 44, name: 'UX Researcher' },
    { id: 45, name: 'Backend Engineer' },
    { id: 46, name: 'Marketing Analyst' },
    { id: 47, name: 'Cloud Engineer' },
    { id: 48, name: 'Business Intelligence Specialist' },
  ],
  user: [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 1, order: 1 },
    { id: 2, name: 'Emily Johnson', email: 'emily.johnson@example.com', role: 2, order: 1 },
    { id: 3, name: 'Liam O\'Connor', email: 'liam.oconnor@example.com', role: 3, order: 2 },
    { id: 4, name: 'Sofia Gonzalez', email: 'sofia.gonzalez@example.com', role: 4, order: 3 },
    { id: 5, name: 'Daniel Kim', email: 'daniel.kim@example.com', role: 5, order: 4 },
    { id: 6, name: 'Isabelle Dupont', email: 'isabelle.dupont@example.com', role: 6, order: 5 },
    { id: 7, name: 'Mohammed Ali', email: 'mohammed.ali@example.com', role: 7, order: 6 },
    { id: 8, name: 'Olga Petrov', email: 'olga.petrov@example.com', role: 8, order: 7 },
    { id: 9, name: 'Carlos Mendes', email: 'carlos.mendes@example.com', role: 9, order: 8 },
    { id: 10, name: 'Hana Takahashi', email: 'hana.takahashi@example.com', role: 10, order: 9 },
    { id: 11, name: 'Jacob Brown', email: 'jacob.brown@example.com', role: 1, order: 10 },
    { id: 12, name: 'Anna Schmidt', email: 'anna.schmidt@example.com', role: 11, order: 11 },
    { id: 13, name: 'Ethan Miller', email: 'ethan.miller@example.com', role: 12, order: 12 },
    { id: 14, name: 'Zara Ahmed', email: 'zara.ahmed@example.com', role: 13, order: 13 },
    { id: 15, name: 'Lucas Moreau', email: 'lucas.moreau@example.com', role: 14, order: 14 },
    { id: 16, name: 'Nina Kowalski', email: 'nina.kowalski@example.com', role: 15, order: 15 },
    { id: 17, name: 'Oscar Rivera', email: 'oscar.rivera@example.com', role: 16, order: 16 },
    { id: 18, name: 'Ming Wei', email: 'ming.wei@example.com', role: 17, order: 17 },
    { id: 19, name: 'David Lee', email: 'david.lee@example.com', role: 18, order: 18 },
    { id: 20, name: 'Elena Vasquez', email: 'elena.vasquez@example.com', role: 19, order: 19 },
    { id: 21, name: 'Tomás Silva', email: 'tomas.silva@example.com', role: 20, order: 20 },
    { id: 22, name: 'Aisha Khan', email: 'aisha.khan@example.com', role: 21, order: 21 },
    { id: 23, name: 'Nathan Carter', email: 'nathan.carter@example.com', role: 22, order: 22 },
    { id: 24, name: 'Chloe Laurent', email: 'chloe.laurent@example.com', role: 23, order: 23 },
    { id: 25, name: 'William Harris', email: 'william.harris@example.com', role: 24, order: 24 },
    { id: 26, name: 'Maria Rossi', email: 'maria.rossi@example.com', role: 25, order: 25 },
    { id: 27, name: 'Josef Novak', email: 'josef.novak@example.com', role: 26, order: 26 },
    { id: 28, name: 'Yasmine El-Sayed', email: 'yasmine.elsayed@example.com', role: 27, order: 27 },
    { id: 29, name: 'Antonio Ferrara', email: 'antonio.ferrara@example.com', role: 28, order: 28 },
    { id: 30, name: 'Daria Volkov', email: 'daria.volkov@example.com', role: 29, order: 29 },
    { id: 31, name: 'Alex Murphy', email: 'alex.murphy@example.com', role: 30, order: 30 },
    { id: 32, name: 'Mei Lin', email: 'mei.lin@example.com', role: 31, order: 31 },
    { id: 33, name: 'Felipe Costa', email: 'felipe.costa@example.com', role: 32, order: 32 },
    { id: 34, name: 'Camille Dubois', email: 'camille.dubois@example.com', role: 33, order: 33 },
    { id: 35, name: 'Haruto Nakamura', email: 'haruto.nakamura@example.com', role: 34, order: 34 },
    { id: 36, name: 'Fatima Rahman', email: 'fatima.rahman@example.com', role: 35, order: 35 },
    { id: 37, name: 'Stefan Kovac', email: 'stefan.kovac@example.com', role: 36, order: 36 },
    { id: 38, name: 'Layla Hassan', email: 'layla.hassan@example.com', role: 37, order: 37 },
    { id: 39, name: 'Rafael Ortega', email: 'rafael.ortega@example.com', role: 38, order: 38 },
    { id: 40, name: 'Veronika Müller', email: 'veronika.muller@example.com', role: 39, order: 39 },
    { id: 41, name: 'Hugo Martins', email: 'hugo.martins@example.com', role: 40, order: 40 },
    { id: 42, name: 'Selma Johansson', email: 'selma.johansson@example.com', role: 41, order: 41 },
    { id: 43, name: 'Andrei Popescu', email: 'andrei.popescu@example.com', role: 42, order: 42 },
    { id: 44, name: 'Jasmine Patel', email: 'jasmine.patel@example.com', role: 43, order: 43 },
    { id: 45, name: 'Luis Fernandez', email: 'luis.fernandez@example.com', role: 16, order: 44 },
    { id: 46, name: 'Gabriela Mendes', email: 'gabriela.mendes@example.com', role: 44, order: 45 },
    { id: 47, name: 'Jakub Nowak', email: 'jakub.nowak@example.com', role: 45, order: 46 },
    { id: 48, name: 'Clara Eriksson', email: 'clara.eriksson@example.com', role: 46, order: 47 },
    { id: 49, name: 'Leonardo Batista', email: 'leonardo.batista@example.com', role: 47, order: 48 },
    { id: 50, name: 'Saanvi Reddy', email: 'saanvi.reddy@example.com', role: 48, order: 49 }
  ],
  employee: [
    { id: 1, name: 'Alice Johnson', department: 'Sales' },
    { id: 2, name: 'Bob Smith', department: 'Finance' },
  ],
  customer: [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Globex Ltd' },
  ],
  contact: [
    { id: 1, name: 'Jane Doe', email: 'jane@acme.com', customer: 1 },
    { id: 2, name: 'John Roe', email: 'john@globex.com', customer: 2 },
  ],
  quotation: [
    { id: 1, amount: 3000, status: 'sent', customer: 1, employee: 1 },
    { id: 2, amount: 4500, status: 'accepted', customer: 2, employee: 1 },
  ],
  invoice: [
    { id: 1, due_date: '2024-07-01', amount: 3000, quotation: 1 },
    { id: 2, due_date: '2024-07-15', amount: 4500, quotation: 2 },
  ],
  payment: [
    { id: 1, amount: 3000, method: 'credit card', invoice: 1 },
    { id: 2, amount: 2000, method: 'bank transfer', invoice: 2 },
  ],
  leaveRequest: [
    { id: 1, employee: 2, from_date: '2024-08-01', to_date: '2024-08-05', status: 'approved' },
  ],
  note: [
    { id: 1, content: 'Called the client to confirm project scope.', author: 1, related_customer: 1 },
    { id: 2, content: 'Follow-up email sent.', author: 1, related_customer: 2 },
  ],
  task: [
    {
      id: 1,
      title: 'Prepare proposal',
      description: 'Draft quotation for Acme Corp',
      assigned_to: 1,
      related_project: 1,
      status: 'in-progress',
      due_date: '2024-07-05',
    },
    {
      id: 2,
      title: 'Review contract',
      description: 'Legal review for Globex agreement',
      assigned_to: 2,
      related_project: 2,
      status: 'todo',
      due_date: '2024-07-10',
    },
  ],
};

seedDatabase(
  db,
  schema,
  mockData,
);

type EntityMap<S extends Record<string, any>> = {
  [K in keyof S]: S[K];
};

type Entities = EntityMap<Schema>;

export const handlers = [
  ...createRestHandlers(db, schema, 'user', '/api/users'),
  ...createRestHandlers(db, schema, 'role', '/api/roles'),

  ...createRestHandlers(db, schema, 'employee', '/api/employees', {
    onDelete: (employee) => {
      db.quotation.deleteMany({ where: { employee: { id: { equals: employee.id } } } });
      db.leaveRequest.deleteMany({ where: { employee: { id: { equals: employee.id } } } });
      db.note.deleteMany({ where: { author: { id: { equals: employee.id } } } });
      db.task.deleteMany({ where: { assigned_to: { id: { equals: employee.id } } } });
    },
  }),

  ...createRestHandlers(db, schema, 'customer', '/api/customers', {
    onDelete: (customer) => {
      db.contact.deleteMany({ where: { customer: { id: { equals: customer.id } } } });
      db.quotation.deleteMany({ where: { customer: { id: { equals: customer.id } } } });
      db.note.deleteMany({ where: { related_customer: { id: { equals: customer.id } } } });
    },
  }),

  ...createRestHandlers(db, schema, 'contact', '/api/contacts'),

  ...createRestHandlers(db, schema, 'quotation', '/api/quotations', {
    onDelete: (quotation) => {
      db.invoice.deleteMany({ where: { quotation: { id: { equals: quotation.id } } } });
      db.task.deleteMany({ where: { related_project: { id: { equals: quotation.id } } } });
    },
  }),

  ...createRestHandlers(db, schema, 'invoice', '/api/invoices', {
    onDelete: (invoice) => {
      db.payment.deleteMany({ where: { invoice: { id: { equals: invoice.id } } } });
    },
  }),

  ...createRestHandlers(db, schema, 'payment', '/api/payments'),
  ...createRestHandlers(db, schema, 'leaveRequest', '/api/leave-requests'),
  ...createRestHandlers(db, schema, 'note', '/api/notes'),
  ...createRestHandlers(db, schema, 'task', '/api/tasks'),
];