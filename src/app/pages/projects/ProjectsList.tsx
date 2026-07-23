import { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Project, ProjectFilterStatus } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import { useProjectColumns, useProjectFormFields, projectInitialState } from './projectHooks';

const ProjectsList = () => {
  const { text } = useLocalization();
  const projects = r.projects.useList();
  const createProject = r.projects.useCreate();
  const updateProject = r.projects.useUpdate();
  const moveProject = r.projects.useMove();
  const employees = r.employees.useList();
  const customers = r.customers.useList();
  const roles = r.roles.useList();
  const [filterStatus, setFilterStatus] = useState<ProjectFilterStatus>(null);
  const projectColumns = useProjectColumns({ filterStatus, onFilterStatusChange: setFilterStatus });
  const projectFormFields = useProjectFormFields();

  return (
    <Container className='container-list'>
      {(!projects.data || !customers.data || !employees.data || !roles.data)? <SmallSpinner /> :
        <FormModalProvider
          loading={createProject.isPending || updateProject.isPending}
          initialState={projectInitialState}
          createModalTitle={text`create_new_project`}
          editModalTitle={text`edit_project`}
          formFields={projectFormFields}
          onCreate={(project: Project, closeModal: () => void) => {
            createProject.mutate(project, { onSuccess: closeModal });
          }}
          onUpdate={(project: Project, closeModal: () => void) => {
            updateProject.mutate(project, { onSuccess: closeModal });
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
                  {text`create_new_project`}
                </FormCreateModalButton>
              )
            }}
            columns={projectColumns}
            data={projects.data.filter(project => filterStatus === null || project.status === filterStatus)}
            onMove={onMove(moveProject)}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default ProjectsList;
