import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  FormDropdown,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import { Employee } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import NotFound from '../../components/NotFound';

const EmployeesPage = () => {
  const { text } = useLocalization();
  const employees = use.employees();
  const roles = use.roles();

  useEffect(() => {
    employees.getList();
    roles.getList();
  }, []);

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
          formFields={{
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
          }}
          validate={({ email }) => {
            // You can add more sophisticated validation here
            const es = email.split('@')
            if (es.length !== 2) {
              return {
                email: text`error_email_requires_at`,
              }
            }
          }}
          onCreate={(employee, closeModal: () => void) => {
            employees.create(employee, { callback: () => closeModal()});
          }}
          onUpdate={(employee, closeModal: () => void) => {
            employees.update(employee, { callback: () => closeModal()});
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
            showEditModalOnClickRow
            filterColumn={({ name, email}: Employee) => `${name} ${email}`}
            columns={[
              {
                // Display column name
                name: text`name`,
                // Select by key
                selector: 'name',
                orderBy: 'name',
              },
              {
                name: text`email_address`,
                selector: ({ email }: Employee) => email,
              },
              {
                name: text`role`,
                selector: ({ role_id }: Employee) => (
                  roles.record[role_id]?.name || <NotFound />
                ),
                orderBy: 'role',
              },
              {
                name: text`actions`,
                selector: (employee) => (
                  <DeleteConfirmButton
                    loading={employees.delete.isLoading && employees.delete.id === employee.id}                  
                    modalTitle={text`delete_employee${employee.name}`}
                    onDelete={() => {
                      employees.delete(employee);
                    }}
                  />
                )
              }
            ]}
            data={employees.list}
            onMove={({ item, target }) => {
              // // Use onMove to store new position for instance by modifying the 'order' field
              // // with django-ordered-model in a Django backend

              // // Find index of the item to move
              // const fromIndex = employees.findIndex(employee => employee.id === item.id);
              // if (fromIndex === -1) return; // If not found, return original array

              // // Find index of the target position (employee with `orderId` as their order)
              // const targetIndex = employees.findIndex(employee => employee.id === target.id);
              // if (targetIndex === -1) return; // If target not found, return original array

              // // Remove the item from its current position
              // const [movedEmployee] = employees.splice(fromIndex, 1);

              // // Insert the item at the target position
              // employees.splice(targetIndex, 0, movedEmployee);

              // employees.map(u => console.log(u.id))
              // setEmployees(employees.map((u, order) => ({...u, order })));
            }}
          />
        </FormModalProvider>
    }
    </Container>
  )
}

export default EmployeesPage;