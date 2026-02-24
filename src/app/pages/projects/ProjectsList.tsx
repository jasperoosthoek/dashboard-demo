import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Project } from '../../stores/types';
import { use, onMove } from '../../stores/crudRegistry'
import { useProjectColumns, useProjectFormFields, useProjectStatusText, projectInitialState } from './projectHooks';

const ProjectsList = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  const projectColumns = useProjectColumns({ filterStatus: true });
  const projectFormFields = useProjectFormFields();
  const projectStatusText = useProjectStatusText();
  const { filterStatus } = projects.state;
  useEffect(() => projects.setState({ filterStatus: null }), [])

  return (
    <Container className='container-list'>
      {(!projects.list || !customers.list || !employees.list || !roles.record)? <SmallSpinner /> :
        <FormModalProvider
          loading={projects.create.isLoading || projects.update.isLoading}
          initialState={projectInitialState}
          createModalTitle={text`create_new_project`}
          editModalTitle={text`edit_project`}
          formFields={projectFormFields}
          onCreate={(project: Project, closeModal: () => void) => {
            projects.create(project, { callback: closeModal});
          }}
          onUpdate={(project: Project, closeModal: () => void) => {
            projects.update(project, { callback: closeModal});
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
            data={projects.list.filter(project => filterStatus === null || project.status === filterStatus)}
            onMove={onMove(projects)}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default ProjectsList;
