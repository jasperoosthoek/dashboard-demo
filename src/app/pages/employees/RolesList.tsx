import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Role } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';

const RolesList = () => {
  const { text } = useLocalization();
  const roles = r.roles.useList();
  const createRole = r.roles.useCreate();
  const updateRole = r.roles.useUpdate();
  const deleteRole = r.roles.useDelete();
  const moveRole = r.roles.useMove();

  return (
    <Container className='container-list'>
      {!roles.data ? <SmallSpinner /> :
        <FormModalProvider
          loading={createRole.isPending || updateRole.isPending}
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
          onCreate={(role: Role, closeModal: () => void) => {
            createRole.mutate(role, { onSuccess: closeModal });
          }}
          onUpdate={(role: Role, closeModal: () => void) => {
            updateRole.mutate(role, { onSuccess: closeModal });
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
            columns={[
              {
                name: text`name`,
                selector: 'name',
                orderBy: 'name',
                search: ({ name }: Role) => `${name}`,
              },
              {
                name: text`actions`,
                selector: (role) => (
                  <DeleteConfirmButton
                    loading={deleteRole.isPending}
                    modalTitle={text`delete_role${role.name}`}
                    onDelete={() => {
                      deleteRole.mutate(role);
                    }}
                  />
                )
              }
            ]}
            data={roles.data}
            onMove={onMove(moveRole)}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default RolesList;
