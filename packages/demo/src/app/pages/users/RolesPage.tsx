import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
} from '@jasperoosthoek/react-toolbox';

import { Role } from '../../stores/types';
import { use } from '../../stores/crudRegistry'

const RolesPage = () => {
  const { text } = useLocalization();
  const roles = use.roles();

  useEffect(() => {
    roles.getList();
  }, []);


  if (!roles.list || !roles.list) return null;
  return (
    <Container className='container-list'>
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
        <FormCreateModalButton title={text`create_new_role`}/>
      </FormModalProvider>

    </Container>
  )
}

export default RolesPage;