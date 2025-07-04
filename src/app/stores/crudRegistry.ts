import Axios, { type Method } from "axios";
import { useEffect } from 'react';
import { create } from 'zustand'
import { type OnMoveProps } from '@jasperoosthoek/react-toolbox';
import { useCrud, createStoreRegistry, type CustomActionFunction } from "@jasperoosthoek/zustand-crud-registry";
import type { Role, Employee, Customer, Project, Invoice, Task, Note, Instance, ProjectFilterStatus, InvoiceFilterStatus, TaskFilterStatus } from "./types";
import { toast } from 'react-toastify';

export type UseStoreOptions = {
  listAsObject?: boolean;
}
const axios = Axios.create({
  // In real like, replace by 
  // baseURL: process.env.NX_BASE_URL,

  // Use mock database which is handled by src/mockServiceWorker.js
  baseURL: '/api',
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


const moveConfig = (key: string) => (
  {
    route: ({ item }: any) => `/${key}/${item?.id}/move`,
    method: 'put' as Method,
    prepare: ({ target, position }: any) => ({ target, position }),
  }
)
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
        move: moveConfig('employees'),
      },
    },
  ),
  roles: getOrCreateStore(
    'roles',
    {
      ...defaultConfig,
      route: '/roles',
      includeRecord: true,
      customActions: {
        move: moveConfig('roles'),
      },
    }
  ),
  projects: getOrCreateStore(
    'projects',
    {
      ...defaultConfig,
      route: '/projects',
      includeRecord: true,
      state: {
        filterStatus: null as ProjectFilterStatus,
      },
      customActions: {
        move: moveConfig('projects'),
      },
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
      customActions: {
        move: moveConfig('customers'),
      },
    },
  ),

  invoices: getOrCreateStore(
    'invoices',
    {
      ...defaultConfig,
      route: '/invoices',
      state: {
        filterStatus: null as InvoiceFilterStatus,
      },
      customActions: {
        move: moveConfig('invoices'),
      },
    },
  ),
  notes: getOrCreateStore(
    'notes',
    {
      ...defaultConfig,
      route: '/notes',
      customActions: {
        move: moveConfig('notes'),
      },
    }
  ),
  tasks: getOrCreateStore(
    'tasks',
    {
      ...defaultConfig,
      route: '/tasks',
      state: {
        filterStatus: null as TaskFilterStatus,
      },
      customActions: {
        move: moveConfig('tasks'),
      },
    }
  ),
};


type WithGetList = { getList: () => void, list: any[] | null };

export function useGetListOnMount(...stores: WithGetList[]) {
  useEffect(() => {
    stores.forEach((store) => {
      if (typeof store.getList === 'function') {
        store.getList();
      }
    });
  }, []);
}

export function useGetListWhenEmpty(store: WithGetList) {
  useEffect(() => {
    if (!store.list && typeof store.getList === 'function') {
      store.getList();
    }
  }, [!!store.list]);
}

export const use = {
  employees: () => {
    const employees = useCrud(s.employees);
    const roles = useCrud(s.roles);
    useGetListWhenEmpty(employees)
    useGetListWhenEmpty(roles)
    employees.update.onResponse = () => roles.getList();
    employees.create.onResponse = () => roles.getList();

    const patchList = s.employees((s) => s.patchList);
    employees.move.onResponse = (list: Partial<Employee>[]) => patchList(list)
    return employees
  },
  roles: () => {
    const roles = useCrud(s.roles);
    const employees = useCrud(s.employees);
    useGetListWhenEmpty(employees)
    useGetListWhenEmpty(roles)
    roles.update.onResponse = () => employees.getList();
    roles.create.onResponse = () => employees.getList();

    const patchList = s.roles((s) => s.patchList);
    roles.move.onResponse = (list: Partial<Role>[]) => patchList(list)
    return roles
  }, 
  projects: () => {
    const projects = useCrud(s.projects)
    useGetListOnMount(projects);
    const patchList = s.projects((s) => s.patchList);
    projects.move.onResponse = (list: Partial<Project>[]) => patchList(list)
    return projects;
  },
  customers: () => {
    const customers = useCrud(s.customers)
    useGetListOnMount(customers);
    const patchList = s.customers((s) => s.patchList);
    customers.move.onResponse = (list: Partial<Customer>[]) => patchList(list)
    return customers;
  },
  invoices: () => {
    const invoices = useCrud(s.invoices)
    useGetListOnMount(invoices);
    const patchList = s.invoices((s) => s.patchList);
    invoices.move.onResponse = (list: Partial<Invoice>[]) => patchList(list)
    return invoices;
  },
  notes: () => {
    const notes = useCrud(s.notes)
    useGetListOnMount(notes);
    const patchList = s.notes((s) => s.patchList);
    notes.move.onResponse = (list: Partial<Note>[]) => patchList(list)
    return notes;
  },
  tasks: () => {
    const tasks = useCrud(s.tasks)
    useGetListOnMount(tasks);
    const patchList = s.tasks((s) => s.patchList);
    tasks.move.onResponse = (list: Partial<Task>[]) => patchList(list)
    return tasks;
  },
}

type WithMove<T> = {
  move: CustomActionFunction<T>
};

export const onMove = <T extends Instance>(store: WithMove<T>) => ({ item, target, reset }: OnMoveProps<T>) => {
  store.move(
    {
      item,
      target,
      // Use same convention as django-ordered-model
      position: item.order > target.order ? 'above' : 'below',
    },
    {
        callback: reset,
        onError: reset,
    }
  )
}