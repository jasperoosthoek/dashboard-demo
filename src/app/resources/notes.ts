import { createResource } from '@jasperoosthoek/tanstack-query-crud';

import type { Note } from '../stores/types';
import { axios, onError } from './api';
import { moveConfig } from './move';

export const notes = createResource<Note>()({
  name: 'notes',
  route: '/notes',
  axios,
  onError,
  actions: {
    getList: true,
    create: true,
    update: true,
    delete: true,
  },
  customActions: {
    move: moveConfig<Note>('notes'),
  },
});
