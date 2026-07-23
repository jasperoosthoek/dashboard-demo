import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Customer } from '../stores/types';
import { axios, onError } from './api';

// Customers are not modified in this app, only getList is needed even
// though the backend exposes the full CRUD API.
export const customers = createResource<Customer>()({
  name: 'customers',
  route: '/customers',
  axios,
  onError,
  actions: {
    getList: true,
  },
});
