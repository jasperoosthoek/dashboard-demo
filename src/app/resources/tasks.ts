import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Task } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';

export const tasks = createResource<Task>()({
  name: 'tasks',
  route: '/tasks',
  axios,
  onError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  customActions: {
    move: moveConfig<Task>('tasks'),
  },
});
