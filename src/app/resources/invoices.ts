import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Invoice } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';

export const invoices = createResource<Invoice>()({
  name: 'invoices',
  route: '/invoices',
  axios,
  onError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  customActions: {
    move: moveConfig<Invoice>('invoices'),
  },
});
