import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Employee } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';
import { roles } from './roles';

export const employees = createResource<Employee>()({
  name: 'employees',
  route: '/employees',
  axios,
  onError,
  actions: {
    getList: true,
    // Refetch roles after an employee is created or updated, alongside the
    // normal response-driven update of the employees cache.
    create: { invalidates: [roles] },
    update: { invalidates: [roles] },
    delete: true,
  },
  customActions: {
    move: moveConfig<Employee>('employees'),
  },
});
