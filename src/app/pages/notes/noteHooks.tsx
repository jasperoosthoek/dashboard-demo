import { Link } from 'react-router';
import { format } from 'date-fns';
import {
  useLocalization,
  FormDropdown,
  FormTextarea,
  FormEditModalButton,
  DeleteConfirmButton,
  type FormInputProps,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Note, Employee, Customer } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/employeeHooks';

export const  useNoteFormFields = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {
  const { text } = useLocalization();
  const customers = use.customers()
  const employeeList = useEmployeeFormList();

  if (!customers.list || (excludeEmployee && !employeeList)) return [];

  return {
    content: {
      label: text`content`,
      component: FormTextarea,
      formProps: {
        rows: 5,
      } as FormInputProps,
    },
    ...!excludeEmployee ? (
      {
        employee_id: {
          component: (props: FormDropdownProps<Employee>) => (
            <FormDropdown
              {...props}
              idKey='id'
              nameKey='name'
              list={employeeList || []}
            />
          ),
          label: text`employee`,
        },
      }
     ) : {},
    customer_id: {
      component: (props: FormDropdownProps<Customer>) => (
        <FormDropdown
          {...props}
          idKey='id'
          nameKey='name'
          list={customers.list?.sort((c1, c2) => c1.name > c2.name ? 1 : -1) || []}
        />
      ),
      label: text`customer`,
      required: true,
    },
  };
}

export const useNoteColumns = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {
  const { text } = useLocalization();
  const notes = use.notes();
  const employees = use.employees();
  const customers = use.customers();
  const formatDate = useFormatDate();

  if (!customers.record || !notes.list || !employees.record) {
    return [];
  }

  return (
    [
      {
        name: text`content`,
        selector: ({ content }: Note) => content,
        orderBy: 'content',
        search: 'content',
      },
      ...!excludeEmployee ? [
        {
          name: text`employee`,
          selector: ({ employee_id }: Note) => {
            const employee = employees.record && employees.record[employee_id];
            return (
              employee
                ? <Link to={`/employees/${employee.id}`}>
                    {employee.name}
                  </Link>
                : <NotFound />
            );
          },
          orderBy: 'employee_id',
          search: ({ employee_id }: Note) => employees.record && employees.record[employee_id]?.name || '',
        }
      ] : [],
      {
        name: text`customer`,
        selector: ({ customer_id }: Note) => {
          const customer = customers.record && customers.record[customer_id];
          return (
            customer
              ? customer.name
              : <NotFound />
          );
        },
        orderBy: 'customer_id',
          search: ({ customer_id }: Note) => customers.record && customers.record[customer_id]?.name || '',
      },
      {
        name: text`created_at`,
        selector: ({ created_at }: Note) => formatDate(created_at),
        orderBy: 'created_at',
      },
      {
        name: text`actions`,
        selector: (note: Note) => (
          <>
            <FormEditModalButton
              state={note}
              title={text`edit_note`}
            />
            <DeleteConfirmButton
              loading={notes.delete.isLoading && notes.delete.id === note.id}
              modalTitle={text`delete_note${note.id}`}
              onDelete={() => {
                notes.delete(note);
              }}
            />
          </>
        )
      }
    ]
  )
}

export const noteInitialState: Partial<Note> = (
  {
    content: '',
    created_at: format(new Date(), 'yyyy-MM-dd'),
  }
)
