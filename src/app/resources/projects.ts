import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Project } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';

export const projects = createResource<Project>()({
  name: 'projects',
  route: '/projects',
  axios,
  onError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  customActions: {
    move: moveConfig<Project>('projects'),
  },
});
