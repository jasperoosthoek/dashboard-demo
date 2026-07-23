import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Role } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';

export const roles = createResource<Role>()({
  name: 'roles',
  route: '/roles',
  axios,
  onError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  customActions: {
    move: moveConfig<Role>('roles'),
  },
});
