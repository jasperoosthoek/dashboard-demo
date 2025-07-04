import Axios, { type Method } from "axios";
import { useEffect } from 'react';
import { type OnMoveProps } from '@jasperoosthoek/react-toolbox';
import { useCrud, createStoreRegistry, useStore, type CustomActionFunction } from "@jasperoosthoek/zustand-crud-registry";
import type {
  Role,
  Employee,
  Customer,
  Project,
  Invoice,
  Task,
  Note,
  Instance,
  ProjectFilterStatus,
  InvoiceFilterStatus,
  TaskFilterStatus,
} from "./types";
import { toastOnError } from './toastMessageStore';

export type UseStoreOptions = {
  listAsObject?: boolean;
}
const axios = Axios.create({
  // In real like, replace by 
  // baseURL: process.env.NX_BASE_URL,

  // Use mock database which is handled by /src/mockServiceWorker.js and gets its data from /mocks
  baseURL: '/api',
});


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


type WithMove<T> = {
  move: CustomActionFunction<T>
};

// Reusable function to be used directly inside of the DataTable component
export const onMove = <T extends Instance>(store: WithMove<T>) => ({ item, target, reset }: OnMoveProps<T>) => {
  store.move(
    // Data sent to both the route and prepare function supplied by moveConfig() below.
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

// Reusable config for the move function
const moveConfig = (key: string) => (
  {
    route: ({ item }: any) => `/${key}/${item?.id}/move`,
    method: 'put' as Method,
    prepare: ({ target, position }: any) => ({ target, position }),
  }
)

// Create all the CRUD stores
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
        // As customers are not modified in the app, only the getList() function is needed
        // although the api endpoints are available
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
    // Demonstrate the possibility to get all the roles after an employee is updated or created
    employees.update.onResponse = () => roles.getList();
    employees.create.onResponse = () => roles.getList();

    // Get the patchList function from the store which modifies existing instances.
    const { patchList } = useStore(s.employees)
    // Note that that the api only returns objects of the type { id: number, order: number }
    employees.move.onResponse = (list: Partial<Employee>[]) => patchList(list)
    return employees
  },
  roles: () => {
    const roles = useCrud(s.roles);
    useGetListWhenEmpty(roles)

    const { patchList } = useStore(s.roles);
    roles.move.onResponse = (list: Partial<Role>[]) => patchList(list)
    return roles
  }, 
  projects: () => {
    const projects = useCrud(s.projects)
    useGetListOnMount(projects);
    const { patchList } = useStore(s.projects);
    projects.move.onResponse = (list: Partial<Project>[]) => patchList(list)
    return projects;
  },
  customers: () => {
    const customers = useCrud(s.customers)
    useGetListOnMount(customers);
    return customers;
  },
  invoices: () => {
    const invoices = useCrud(s.invoices)
    useGetListOnMount(invoices);
    const { patchList } = useStore(s.invoices);
    invoices.move.onResponse = (list: Partial<Invoice>[]) => patchList(list)
    return invoices;
  },
  notes: () => {
    const notes = useCrud(s.notes)
    useGetListOnMount(notes);
    const { patchList } = useStore(s.notes);
    notes.move.onResponse = (list: Partial<Note>[]) => patchList(list)
    return notes;
  },
  tasks: () => {
    const tasks = useCrud(s.tasks)
    useGetListOnMount(tasks);
    const { patchList } = useStore(s.tasks);
    tasks.move.onResponse = (list: Partial<Task>[]) => patchList(list)
    return tasks;
  },
}
