import type { UseMutationResult } from '@tanstack/react-query';
import { updateAllLists, type CustomActionConfig } from '@jasperoosthoek/tanstack-query-crud';
import type { OnMoveProps } from '@jasperoosthoek/react-toolbox';

import type { Instance } from '../stores/types';

export type MoveVariables<T> = { item: T; target: T };
type MovePatch = { id: number; order: number };

// Reusable customActions.move config for reorderable resources — mirrors
// django-ordered-model's PUT /<resource>/<id>/move convention. Patches the
// list cache directly from the response instead of invalidating, so a drag
// reorder doesn't cost an extra round trip.
export const moveConfig = <T extends Instance>(resourceName: string): CustomActionConfig<MoveVariables<T>, MovePatch[]> => ({
  method: 'put',
  path: ({ item }) => `/${resourceName}/${item.id}/move`,
  prepare: ({ item, target }) => ({
    target,
    // Use same convention as django-ordered-model
    position: item.order > target.order ? 'above' : 'below',
  }),
  invalidates: [],
  onSuccess: (patches, _variables, _onMutateResult, { client }) => {
    updateAllLists<T>(client, resourceName, (list) => list.map((existing) => {
      const patch = patches.find((p) => p.id === existing.id);
      return patch ? { ...existing, ...patch } : existing;
    }));
  },
});

// Wires a resource's `useMove()` mutation to DataTable's onMove prop.
// The generated hook's declared TData is the resource type T (a TQC typing
// gap - custom action hooks don't thread through their own TData), even
// though the move endpoint actually resolves with MovePatch[]; onMove never
// reads the resolved data so this doesn't affect behavior.
export const onMove = <T extends Instance>(moveMutation: UseMutationResult<T, Error, MoveVariables<T>>) => (
  ({ item, target, reset }: OnMoveProps<T>) => {
    moveMutation.mutate({ item, target }, { onSuccess: reset, onError: reset });
  }
);
