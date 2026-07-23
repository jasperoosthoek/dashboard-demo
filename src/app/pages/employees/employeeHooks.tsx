import {
  useLocalization,
  FormDropdown,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Employee, Role } from '../../stores/types';
import { r } from '../../resources';
import NotFound from '../../components/NotFound';

// Returns a list of employees with their roles formatted for display in a form
// This is used in the FormModalProvider to populate dropdowns or lists
// It sorts employees by name and appends the role name to each employee's name
export const useEmployeeFormList = () => {
  const employees = r.employees.useList();
  const roles = r.roles.useList();

  if (!employees.data || !roles.data) {
    return null;
  }

  return (
    [...employees.data].sort((e1, e2) => e1.name > e2.name ? 1 : -1)
  ).map((e: Employee) => ({
    ...e,
    name: `${e.name} (${roles.find(e.role_id)?.name || <NotFound />})`,
  }))
}

export const useEmployeeFormFields = () => {
  const { text } = useLocalization();
  const roles = r.roles.useList();
  if (!roles.data) return [];
  return (
    {
      name: {
        label: text`name`,
        required: true,
      },
      email: {
        label: text`email_address`,
        required: true,
      },
      role_id: {
        component: (props: FormDropdownProps<Role>) => (
          <FormDropdown
            {...props}
            idKey='id'
            nameKey='name'
            list={roles.data ? [...roles.data].sort((r1, r2) => r1.name > r2.name ? 1 : -1) : []}
          />
        ),
        label: text`role`,
      }
    }
  );
}
