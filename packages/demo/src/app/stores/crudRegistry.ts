import Axios from "axios";
import { createCrudStoreRegistry } from "@jasperoosthoek/zustand-crud-registry";
import { useDataResource } from "@jasperoosthoek/zustand-crud-registry";
import type { CrudModels } from "./types";

export const { getOrCreateCrudStore } = createCrudStoreRegistry<CrudModels>();

const axios = Axios.create({
  // Replace by 
  baseURL: process.env.NX_BASE_URL,
});

const defaultConfig = {
  axios,
  actions: {
    getList: true,
    create: true,
    get: true,
    update: true,
    delete: true,
  },
};

export const useEmployeeStore = getOrCreateCrudStore(
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
);

export const useCustomerStore = getOrCreateCrudStore(
  'customers',
  {
    ...defaultConfig,
    route: '/customers',
    actions: {
      getList: true,
    },
  }
);


export const useContactStore = getOrCreateCrudStore(
  'contacts',
  {
    ...defaultConfig,
    route: '/contacts'
  },
);

export const useQuotationStore = getOrCreateCrudStore(
  'quotations',
  {
    ...defaultConfig,
    route: '/quotations',
  },
);

export const useInvoiceStore = getOrCreateCrudStore(
  'invoices',
  {
    ...defaultConfig,
    route: '/invoices'
  },
);

export const usePaymentStore = getOrCreateCrudStore(
  'payments',
  {
    ...defaultConfig,
    route: '/payments'
  },
);

export const useLeaveRequestStore = getOrCreateCrudStore(
  'leaveRequests',
  {
    ...defaultConfig,
    route: '/leaveRequests',
  },
);

export const useNoteStore = getOrCreateCrudStore(
  'notes',
  {
    ...defaultConfig,
    route: '/notes',
  }
);

export const useTaskStore = getOrCreateCrudStore(
  'tasks',
  {
    ...defaultConfig,
    route: '/tasks',
  }
);

const use = {
  // projects: () => {
  //   const projects = useDataResource(useEmployeeStore)

  //   projects.getList.sideEffects = (list: Project[]) => projects.setState({ counter: list.length })
  //   return projects;
  // },
  employees: () => useDataResource(useEmployeeStore),
  customers: () => useDataResource(useCustomerStore),
  contacts: () => useDataResource(useContactStore),
  quotations: () => useDataResource(useQuotationStore),
  invoices: () => useDataResource(useInvoiceStore),
  payments: () => useDataResource(usePaymentStore),
  leaveRequests: () => useDataResource(useLeaveRequestStore),
  notes: () => useDataResource(useNoteStore),
  tasks: () => useDataResource(useTaskStore),
}


export { use };