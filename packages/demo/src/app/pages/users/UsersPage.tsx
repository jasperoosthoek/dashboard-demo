import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  FormDropdown,
} from '@jasperoosthoek/react-toolbox';

import { Role, User } from '../../stores/types';
import { use } from '../../stores/crudRegistry'

const UsersPage = () => {
  const { text } = useLocalization();
  const users = use.users();
  const roles = use.roles();

  useEffect(() => {
    users.getList();
    roles.getList();
  }, []);


  if (!users.list || !roles.list) return null;
  return (
    <Container className='container-list'>
      <FormModalProvider
        loading={users.create.isLoading || users.update.isLoading}
        initialState={{
          name: '',
          email: '',
          role_id: '',
        }}
        createModalTitle={text`create_new_user`}
        editModalTitle={text`edit_user`}
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
        onCreate={(user, closeModal: () => void) => {
          users.create(user, { callback: () => closeModal()});
        }}
        onUpdate={(user, closeModal: () => void) => {
          users.update(user, { callback: () => closeModal()});
        }}
      >
        
        <DataTable
          orderByDefault='order'
          showEditModalOnClickRow
          filterColumn={({ name, email}: User) => `${name} ${email}`}
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
              selector: ({ email }: User) => email,
            },
            {
              name: text`role`,
              selector: ({ role_id}: User) => (
                roles.list?.find(({ id }) => id === role_id)?.name || <i>{text`not_found`}</i>
              ),
              orderBy: 'role',
            },
            {
              name: text`actions`,
              selector: (user) => (
                <DeleteConfirmButton
                  modalTitle={text`delete_user${user.name}`}
                  onDelete={() => {
                    users.delete(user);
                  }}
                />
              )
            }
          ]}
          data={users.list}
          onMove={({ item, target }) => {
            // // Use onMove to store new position for instance by modifying the 'order' field
            // // with django-ordered-model in a Django backend

            // // Find index of the item to move
            // const fromIndex = users.findIndex(user => user.id === item.id);
            // if (fromIndex === -1) return; // If not found, return original array

            // // Find index of the target position (user with `orderId` as their order)
            // const targetIndex = users.findIndex(user => user.id === target.id);
            // if (targetIndex === -1) return; // If target not found, return original array

            // // Remove the item from its current position
            // const [movedUser] = users.splice(fromIndex, 1);

            // // Insert the item at the target position
            // users.splice(targetIndex, 0, movedUser);

            // users.map(u => console.log(u.id))
            // setUsers(users.map((u, order) => ({...u, order })));
          }}
        />
        <FormCreateModalButton title={text`create_new_user`}/>
      </FormModalProvider>

    </Container>
  )
}

export default UsersPage;