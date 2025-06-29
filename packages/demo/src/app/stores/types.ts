
export type Role = {
  id: number;
  name: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  order: number;
  department: string;
  active: boolean;
};

export type Customer = {
  id: number;
  name: string;
  contact_person: string;
  email: string;
};

export type Project = {
  id: number;
  name: string;
  amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  customer_id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
};

export type Invoice = {
  id: number;
  due_date: string;
  amount: number;
  status: string;
  project_id: number;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to_id: number;
  related_project_id: number;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  priority: string;
};

export type Note = {
  id: number;
  content: string;
  author_id: number;
  related_customer_id: number;
  created_at: string;
};
