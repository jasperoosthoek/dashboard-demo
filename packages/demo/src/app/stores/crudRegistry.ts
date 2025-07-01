import Axios from "axios";
import { useEffect } from 'react';
import { create } from 'zustand';
import { useCrud, createStoreRegistry } from "@jasperoosthoek/zustand-crud-registry";
import type { Role, Employee, Customer, Project, Invoice, Task, Note } from "./types";
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
  roles: Role;
  employees: Employee;
  projects: Project;
  customers: Customer;
  invoices: Invoice;
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
  employees: getOrCreateStore(
  'employees',
  {
    ...defaultConfig,
    route: '/employees',
    state: {
      isValid: true,
      counter: 0,
    },
    includeRecord: true,
    customActions: {
        synchronize: {
          route: '/employees',
        },
      }
    },
  ),
  roles: getOrCreateStore(
    'roles',
    {
      ...defaultConfig,
      route: '/roles',
      includeRecord: true,
    }
  ),
  projects: getOrCreateStore(
    'projects',
    {
      ...defaultConfig,
      route: '/projects',
      includeRecord: true,
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
      includeRecord: true,
    },
  ),

  invoices: getOrCreateStore(
    'invoices',
    {
      ...defaultConfig,
      route: '/invoices',
      state: {
        filterStatus: 'all' as 'all' | Invoice['status'],
      },
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
  employees: () => {
    const employees = useCrud(s.employees);
    const roles = useCrud(s.roles);
    employees.update.sideEffects = () => roles.getList();
    employees.create.sideEffects = () => roles.getList();
    return employees
  },
  roles: () => {
    const roles = useCrud(s.roles);
    const employees = useCrud(s.employees);
    roles.update.sideEffects = () => employees.getList();
    roles.create.sideEffects = () => employees.getList();
    return roles
  }, 
  projects: () => useCrud(s.projects),
  customers: () => useCrud(s.customers),
  invoices: () => useCrud(s.invoices),
  notes: () => useCrud(s.notes),
  tasks: () => useCrud(s.tasks),
}



type WithGetList = { getList: () => void };

export function useGetListOnMount(...stores: WithGetList[]) {
  useEffect(() => {
    stores.forEach((store) => {
      if (typeof store.getList === 'function') {
        store.getList();
      }
    });
  }, []);
}