import { Container } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  FormDropdown,
  SmallSpinner,
  FormEditModalButton,
} from '@jasperoosthoek/react-toolbox';

import type { Employee } from '../../stores/types';
import { use, useGetListOnMount, onMove } from '../../stores/crudRegistry'
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
        formProps: { list: roles.list?.sort((r1, r2) => r1.name > r2.name ? 1 : -1) || [] },
        component: FormDropdown,
        label: text`role`,
      }
    }
  );
}

const EmployeesList = () => {
  const { text } = useLocalization();
  const employees = use.employees();
  const roles = use.roles();
  useGetListOnMount(employees, roles)
  const employeeFormFields = useEmployeeFormFields();

  return (
    <Container className='container-list'>
      {(!employees.list || !roles.list || !roles.record) ? <SmallSpinner /> : 
        <FormModalProvider
          loading={employees.create.isLoading || employees.update.isLoading}
          initialState={{
            name: '',
            email: '',
            role_id: '',
          }}
          createModalTitle={text`create_new_employee`}
          editModalTitle={text`edit_employee`}
          formFields={employeeFormFields}
          validate={({ email }) => {
            // You can add more sophisticated validation here
            const es = email.split('@')
            if (es.length !== 2) {
              return {
                email: text`error_email_requires_at`,
              }
            }
          }}
          onCreate={(employee: Employee, closeModal: () => void) => {
            employees.create(employee, { callback: closeModal});
          }}
          onUpdate={(employee: Employee, closeModal: () => void) => {
            employees.update(employee, { callback: closeModal});
          }}
        >
          <DataTable
            orderByDefault='order'
            showHeader={{
              search: true,
              numberOfRows: true,
              pagination: true,
              customHeader: (
                <FormCreateModalButton>
                  {text`create_new_employee`}
                </FormCreateModalButton> 
              )
            }}
            columns={[
              {
                // Display column name
                name: text`name`,
                search: 'name',
                // Select by key
                selector: (employee) => (
                  <Link to={`/employees/${employee.id}`}>
                    {employee.name}
                  </Link>
                ),
              },
              {
                name: text`email_address`,
                selector: ({ email }: Employee) => email,
                search: 'email',
              },
              {
                name: text`role`,
                selector: ({ role_id }: Employee) => (
                  roles.record && roles.record[role_id]?.name || <NotFound />
                ),
                orderBy: 'role',
                search: ({ role_id }: Employee) => roles.record && roles.record[role_id]?.name || '',
              },
              {
                name: text`actions`,
                selector: (employee) => (
                  <>
                    <FormEditModalButton
                      state={employee}
                      title={text`edit_employee`}
                    />
                    <DeleteConfirmButton
                      loading={employees.delete.isLoading && employees.delete.id === employee.id}                  
                      modalTitle={text`delete_employee${employee.name}`}
                      onDelete={() => {
                        employees.delete(employee);
                      }}
                    />
                  </>
                  )
              }
            ]}
            data={employees.list}
            onMove={onMove(employees)}
          />
        </FormModalProvider>
    }
    </Container>
  )
}

export default EmployeesList;