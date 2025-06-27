import Axios from "axios";
import { create } from 'zustand';
import { useCrud, createStoreRegistry } from "@jasperoosthoek/zustand-crud-registry";
import type { User, Role, Employee, Customer, Contact, Quotation, Invoice, Payment, LeaveRequest, Note, Task } from "./types";
import { toast } from 'react-toastify';
export type UseStoreOptions = {
  listAsObject?: boolean;
}
const axios = Axios.create({
  // Replace by 
  // baseURL: process.env.NX_BASE_URL,
  baseURL: 'http://localhost:4200/api',
});

interface ToastMessageStore {
  getMessage: () => string;
  setMessage: (fn: () => string) => void;
}

export const toastMessageStore = create<ToastMessageStore>((set) => ({
  getMessage: () => 'default message',
  setMessage: (fn) => set({ getMessage: fn }),
}));

export const setToastMessage = (message: string) => toastMessageStore.getState().setMessage(() => message);

export const toastOnError = (error: any) => {
  toast.error(toastMessageStore.getState().getMessage());
  
  console.error(error)
};


export const getOrCreateStore = createStoreRegistry<{
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
}>();

const defaultConfig = {
  axios,
  actions: {
    getList: true,
    create: true,
    get: true,
    update: true,
    delete: true,
  },
  onError: toastOnError,
};


const s = {
  users: getOrCreateStore(
    'users',
    {
      ...defaultConfig,
      route: '/users',
    }
  ),
  roles: getOrCreateStore(
    'roles',
    {
      ...defaultConfig,
      route: '/roles',
      includeRecord: true,
    }
  ),
  employees: getOrCreateStore(
  'employees',
  {
    ...defaultConfig,
    route: '/employees',
    state: {
      isValid: true,
      counter: 0,
    },
    customActions: {
        synchronize: {
          route: '/users',
        },
      }
    },
  ),
  customers: getOrCreateStore(
  'customers',
  {
    ...defaultConfig,
      route: '/customers',
      actions: {
        getList: true,
      },
    }
  ),

  contacts: getOrCreateStore(
    'contacts',
    {
      ...defaultConfig,
      route: '/contacts'
    },
  ),
  quotations: getOrCreateStore(
    'quotations',
    {
      ...defaultConfig,
      route: '/quotations',
    },
  ),
  invoices: getOrCreateStore(
    'invoices',
    {
      ...defaultConfig,
      route: '/invoices'
    },
  ),
  payments: getOrCreateStore(
    'payments',
    {
      ...defaultConfig,
      route: '/payments'
    },
  ),
  leaveRequests: getOrCreateStore(
    'leaveRequests',
    {
      ...defaultConfig,
      route: '/leaveRequests',
    },
  ),
  notes: getOrCreateStore(
    'notes',
    {
      ...defaultConfig,
      route: '/notes',
    }
  ),
  tasks: getOrCreateStore(
    'tasks',
    {
      ...defaultConfig,
      route: '/tasks',
    }
  ),
};

export const use = {
  roles: (options?: UseStoreOptions) => {
    // @ts-ignore
    const roles = useCrud(s.roles, options);
    const users = useCrud(s.users);
    roles.update.sideEffects = () => users.getList();
    roles.create.sideEffects = () => users.getList();
    return roles
  },
  users: () => {
    const users = useCrud(s.users);
    const roles = useCrud(s.roles);
    users.update.sideEffects = () => roles.getList();
    users.create.sideEffects = () => roles.getList();
    return users
  },
  employees: () => useCrud(s.employees),
  customers: () => useCrud(s.customers),
  contacts: () => useCrud(s.contacts),
  quotations: () => useCrud(s.quotations),
  invoices: () => useCrud(s.invoices),
  payments: () => useCrud(s.payments),
  leaveRequests: () => useCrud(s.leaveRequests),
  notes: () => useCrud(s.notes),
  tasks: () => useCrud(s.tasks),
}
