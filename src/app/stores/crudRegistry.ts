import Axios, { type Method } from "axios";
import { type OnMoveProps } from '@jasperoosthoek/react-toolbox';
import {
  useCrud,
  useGetList,
  createStoreRegistry,
  type
  CustomActionFunction
} from "@jasperoosthoek/zustand-crud-registry";
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


const baseURL = import.meta.env.VITE_BASE_URL || '/api';
const axios = Axios.create({ baseURL });

// Simulate network latency for the mock API to make loading states visible
axios.interceptors.request.use(
  (config) => new Promise((resolve) => setTimeout(() => resolve(config), 300))
);

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
  includeList: true,
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

// Call useCrud + useGetList, wire move.onResponse → store.patchList
const useCrudWithMove = <S extends Parameters<typeof useCrud>[0]>(store: S) => {
  const crud = useCrud(store);
  useGetList(store);
  (crud as any).move.onResponse = (list: any[]) => (store as any).patchList(list);
  return crud;
};

export const use = {
  employees: () => {
    const employees = useCrudWithMove(s.employees);
    const roles = useCrud(s.roles);
    useGetList(s.roles);
    // Refetch roles after an employee is updated or created
    employees.update.onResponse = () => roles.getList();
    employees.create.onResponse = () => roles.getList();
    return employees;
  },
  roles: () => useCrudWithMove(s.roles),
  projects: () => useCrudWithMove(s.projects),
  customers: () => {
    const customers = useCrud(s.customers);
    useGetList(s.customers);
    return customers;
  },
  invoices: () => useCrudWithMove(s.invoices),
  notes: () => useCrudWithMove(s.notes),
  tasks: () => useCrudWithMove(s.tasks),
}
