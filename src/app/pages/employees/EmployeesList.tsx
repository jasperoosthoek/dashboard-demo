import { Container } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
  FormEditModalButton,
} from '@jasperoosthoek/react-toolbox';

import type { Employee } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import NotFound from '../../components/NotFound';
import { useEmployeeFormFields } from './employeeHooks';

const EmployeesList = () => {
  const { text } = useLocalization();
  const employees = r.employees.useList();
  const createEmployee = r.employees.useCreate();
  const updateEmployee = r.employees.useUpdate();
  const deleteEmployee = r.employees.useDelete();
  const moveEmployee = r.employees.useMove();
  const roles = r.roles.useList();
  const employeeFormFields = useEmployeeFormFields();

  return (
    <Container className='container-list'>
      {(!employees.data || !roles.data) ? <SmallSpinner /> :
        <FormModalProvider
          loading={createEmployee.isPending || updateEmployee.isPending}
          initialState={{
            name: '',
            email: '',
            role_id: '',
          }}
          createModalTitle={text`create_new_employee`}
          editModalTitle={text`edit_employee`}
          formFields={employeeFormFields}
          validate={({ email, role_id }: Employee) => {
            // You can add more sophisticated validation here
            return {
              email: email.split('@').length !== 2 && text`error_email_requires_at`,
              role_id: !role_id && text`error_select_role`,
            }
          }}
          onCreate={(employee: Employee, closeModal: () => void) => {
            createEmployee.mutate(employee, { onSuccess: closeModal });
          }}
          onUpdate={(employee: Employee, closeModal: () => void) => {
            updateEmployee.mutate(employee, { onSuccess: closeModal });
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
                  roles.find(role_id)?.name || <NotFound />
                ),
                orderBy: 'role',
                search: ({ role_id }: Employee) => roles.find(role_id)?.name || '',
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
                      loading={deleteEmployee.isPending}
                      modalTitle={text`delete_employee${employee.name}`}
                      onDelete={() => {
                        deleteEmployee.mutate(employee);
                      }}
                    />
                  </>
                  )
              }
            ]}
            data={employees.data}
            onMove={onMove(moveEmployee)}
          />
        </FormModalProvider>
    }
    </Container>
  )
}

export default EmployeesList;
