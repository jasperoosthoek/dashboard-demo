export type User = {
	id: number;
	name: string;
	email: string;
	role_id: number;
	order: number;
}

export type Role = {
	id: number;
	name: string;
}

export type Employee = {
  id: number;
  name: string;
  department: string;
};

export type Customer = {
  id: number;
  name: string;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  customer_id: number;
};

export type Quotation = {
  id: number;
  amount: number;
  status: string;
  customer_id: number; 
  employee_id: number; 
};

export type Invoice = {
  id: number;
  due_date: string;
  amount: number;
  quotation_id: number;
};

export type Payment = {
  id: number;
  amount: number;
  method: string;
  invoice_id: number;
};

export type LeaveRequest = {
  id: number;
  employee_id: number;
  from_date: string;
  to_date: string;
  status: string;
};

export type Note = {
  id: number;
  content: string;
  author_id: number;
  related_customer_id: number;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to_id: number;
  related_project_id: number;
  status: string;
  due_date: string;
};


export type CrudModels = {
  users: User;
  roles: Role;
  employees: Employee;
  customers: Customer;
  contacts: Contact;
  quotations: Quotation;
  invoices: Invoice;
  payments: Payment;
  leaveRequests: LeaveRequest;
  notes: Note;
  tasks: Task;
};
