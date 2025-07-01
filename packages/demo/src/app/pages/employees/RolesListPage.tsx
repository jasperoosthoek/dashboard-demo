import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import { Role } from '../../stores/types';
import { use } from '../../stores/crudRegistry'

const RolesListPage = () => {
  const { text } = useLocalization();
  const roles = use.roles();

  useEffect(() => {
    roles.getList();
  }, []);

  return (
    <Container className='container-list'>
      {(!roles.list || !roles.list) ? <SmallSpinner /> : 
        <FormModalProvider
          loading={roles.create.isLoading || roles.update.isLoading}
          initialState={{
            name: '',
          }}
          createModalTitle={text`create_new_role`}
          editModalTitle={text`edit_role`}
          formFields={{
            name: {
              label: text`name`,
              required: true,
            },
          }}
          onCreate={(role, closeModal: () => void) => {
            roles.create(role, { callback: () => closeModal()});
          }}
          onUpdate={(role, closeModal: () => void) => {
            roles.update(role, { callback: () => closeModal()});
          }}
        >
          <DataTable
            orderByDefault='order'
            showEditModalOnClickRow
            showHeader={{
              search: true,
              numberOfRows: true,
              pagination: true,
              customHeader: (
                <FormCreateModalButton>
                  {text`create_new_role`}
                </FormCreateModalButton> 
              )
            }}
            filterColumn={({ name }: Role) => `${name}`}
            columns={[
              {
                name: text`name`,
                selector: 'name',
                orderBy: 'name',
              },
              {
                name: text`actions`,
                selector: (role) => (
                  <DeleteConfirmButton
                    loading={roles.delete.isLoading && roles.delete.id === role.id}
                    modalTitle={text`delete_role${role.name}`}
                    onDelete={() => {
                      roles.delete(role);
                    }}
                  />
                )
              }
            ]}
            data={roles.list}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default RolesListPage;