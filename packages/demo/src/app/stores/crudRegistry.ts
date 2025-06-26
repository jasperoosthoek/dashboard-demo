import Axios from "axios";
import { create } from 'zustand';
import { createCrudStoreRegistry as createStoreRegistry } from "@jasperoosthoek/zustand-crud-registry";
import { useDataResource as useStore } from "@jasperoosthoek/zustand-crud-registry";
import type { User, Role, Employee, Customer, Contact, Quotation, Invoice, Payment, LeaveRequest, Note, Task } from "./types";
import { toast } from 'react-toastify';




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

  // toast.error(useToastMessageStore.getState().getMessage());
  console.error(toastMessageStore.getState().getMessage(), error)
};


export const { getOrCreateCrudStore: getOrCreateStore } = createStoreRegistry<{
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
  roles: () => {
    const roles = useStore(s.roles);
    const users = useStore(s.users);
    roles.update.sideEffects = () => users.getList();
    roles.create.sideEffects = () => users.getList();
    return roles
  },
  users: () => {
    const users = useStore(s.users);
    const roles = useStore(s.roles);
    users.update.sideEffects = () => roles.getList();
    users.create.sideEffects = () => roles.getList();
    return users
  },
  employees: () => useStore(s.employees),
  customers: () => useStore(s.customers),
  contacts: () => useStore(s.contacts),
  quotations: () => useStore(s.quotations),
  invoices: () => useStore(s.invoices),
  payments: () => useStore(s.payments),
  leaveRequests: () => useStore(s.leaveRequests),
  notes: () => useStore(s.notes),
  tasks: () => useStore(s.tasks),
}
