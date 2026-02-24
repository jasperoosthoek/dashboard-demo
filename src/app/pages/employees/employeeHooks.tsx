import {
  useLocalization,
  FormDropdown,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Employee, Role } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import NotFound from '../../components/NotFound';

// Returns a list of employees with their roles formatted for display in a form
// This is used in the FormModalProvider to populate dropdowns or lists
// It sorts employees by name and appends the role name to each employee's name
export const useEmployeeFormList = () => {
  const employees = use.employees();
  const roles = use.roles();

  if (!employees.list || !roles.record) {
    return null;
  }

  return (
      employees.list?.sort((e1, e2) => e1.name > e2.name ? 1 : -1) || []
    ).map((e: Employee) => ({ ...e, name: `${e.name} (${roles.record && roles.record[e.role_id]?.name || <NotFound />})` }))
}

export const useEmployeeFormFields = () => {
  const { text } = useLocalization();
  const roles = use.roles();
  if (!roles.list) return [];
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
            list={roles.list?.sort((r1, r2) => r1.name > r2.name ? 1 : -1) || []}
          />
        ),
        label: text`role`,
      }
    }
  );
}
