
export type Instance = {
  id: number;
  order: number;
}

export interface Role extends Instance {
  name: string;
};

export interface Employee extends Instance {
  name: string;
  email: string;
  role_id: number;
  order: number;
  department: string;
  active: boolean;
};

export interface Customer extends Instance {
  name: string;
  contact_person: string;
  email: string;
};

export interface Project extends Instance {
  name: string;
  amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  customer_id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
};
export type ProjectFilterStatus = null | Project['status']

export interface Invoice extends Instance {
  due_date: string;
  amount: number;
  status: 'open' | 'paid';
  project_id: number;
};
export type InvoiceFilterStatus = null | Invoice['status']

export interface Task extends Instance {
  title: string;
  description: string;
  employee_id: number;
  project_id: number;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  priority: string;
};
export type TaskFilterStatus = null | Task['status']

export interface Note extends Instance {
  content: string;
  employee_id: number;
  customer_id: number;
  created_at: string;
};
