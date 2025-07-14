import { Container, Card, Row, Col, Badge, Table } from 'react-bootstrap';
import { useParams } from 'react-router';
import {
  FormModalProvider,
  useLocalization,
  SmallSpinner,
  FormEditModalButton,
  FormCreateModalButton,
  DataTable,
} from '@jasperoosthoek/react-toolbox';

import type { Employee } from '../../stores/types';
import { use, useGetListOnMount, onMove } from '../../stores/crudRegistry'
import NotFound from '../../components/NotFound';
import { useNoteFormFields, useNoteColumns, noteInitialState } from '../notes/NotesList';
import { useEmployeeFormFields } from './EmployeesList';
import { useProjectFormFields, useProjectColumns, projectInitialState } from '../projects/ProjectsList';
import { useTaskFormFields, useTaskColumns, taskInitialState } from '../tasks/TasksList';

const EmployeesList = () => {
  const { text } = useLocalization();
  const employees = use.employees();
  const customers = use.customers();
  const notes = use.notes();
  const invoices = use.invoices();
  const projects = use.projects();
  const tasks = use.tasks();
  const roles = use.roles(); // Required by noteFormFields
  useGetListOnMount(employees, employees, customers, notes, invoices, roles, projects, tasks)
  const noteFormFields = useNoteFormFields({ excludeEmployee: true });
  const noteColumns = useNoteColumns({ excludeEmployee: true });
  const employeeFormFields = useEmployeeFormFields();
  const projectFormFields = useProjectFormFields({ excludeEmployee: true });
  const projectColumns = useProjectColumns({ excludeEmployee: true });
  const taskFormFields = useTaskFormFields({ excludeEmployee: true });
  const taskColumns = useTaskColumns({ excludeEmployee: true });

  const { id } = useParams<{ id: string }>();
  const employee = employees.record && employees?.record[id || ''] as Employee | undefined;
  
  return (
    <Container className='container-list mt-4'>
      {(!employees.list || !customers.list || !employees.list || !notes.list || !invoices.list || !noteFormFields || !roles.record || !projects.list || !tasks.list)
        ? <SmallSpinner />
        : !employee 
        ? <NotFound />
        : (
            <>
              <FormModalProvider
                initialState={employee || {}}
                loading={employees.update.isLoading}
                editModalTitle={text`edit_employee`}
                formFields={employeeFormFields}
                onUpdate={(employee, closeModal) => {
                  employees.update(employee, { callback: closeModal});
                }}
              >
                <h2>
                  {employee.name}
                  <FormEditModalButton
                    state={employee}
                    title={text`edit_employee`}
                  />
                </h2>
              </FormModalProvider>

              <Card className="mb-4">
                <Card.Header>{text`employee_info`}</Card.Header>
                <Card.Body>
                  <Row>
                    <Col>{text`email`}:</Col>
                    <Col>
                      {employee.email}
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>{text`role`}:</Col>
                    <Col>
                      {roles.record && roles.record[employee.role_id]?.name || <NotFound />}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <FormModalProvider
                initialState={{
                  ...projectInitialState,
                  employee_id: employee.id,
                }}
                loading={projects.create.isLoading || projects.update.isLoading}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onCreate={(project, closeModal) => {
                  projects.create(project, { callback: closeModal});
                }}
                onUpdate={(project, closeModal) => {
                  projects.update(project, { callback: closeModal});
                }}
              >
                <Card className="mb-4">
                  <Card.Header>
                    {text`projects`}
                    
                    <FormCreateModalButton>
                      {/* {text`create_new_project`} */}
                    </FormCreateModalButton>
                  </Card.Header>
                  <Card.Body>
                    <DataTable
                      showHeader={false}
                      rowsPerPage={null}
                      orderByDefault='order'
                      columns={projectColumns}
                      data={projects.list.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(projects)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>


              <FormModalProvider
                initialState={{
                  ...taskInitialState,
                  employee_id: employee.id,
                }}
                loading={tasks.create.isLoading || tasks.update.isLoading}
                editModalTitle={text`edit_task`}
                formFields={taskFormFields}
                onCreate={(task, closeModal) => {
                  tasks.create(task, { callback: closeModal});
                }}
                onUpdate={(task, closeModal) => {
                  tasks.update(task, { callback: closeModal});
                }}
              >
                <Card className="mb-4">
                  <Card.Header>
                    {text`tasks`}
                    
                    <FormCreateModalButton>
                      {/* {text`create_new_task`} */}
                    </FormCreateModalButton>
                  </Card.Header>
                  <Card.Body>
                    <DataTable
                      showHeader={false}
                      rowsPerPage={null}
                      orderByDefault='order'
                      columns={taskColumns}
                      data={tasks.list.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(tasks)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>

              <FormModalProvider
                initialState={{
                  ...noteInitialState,
                  employee_id: employee.id,
                }}
                loading={notes.create.isLoading || notes.update.isLoading}
                editModalTitle={text`edit_note`}
                formFields={noteFormFields}
                onCreate={(note, closeModal) => {
                  notes.create(note, { callback: closeModal});
                }}
                onUpdate={(note, closeModal) => {
                  notes.update(note, { callback: closeModal});
                }}
              >
                <Card className="mb-4">
                  <Card.Header>
                    {text`notes`}
                    
                    <FormCreateModalButton>
                      {/* {text`create_new_note`} */}
                    </FormCreateModalButton>
                  </Card.Header>
                  <Card.Body>
                    <DataTable
                      showHeader={false}
                      rowsPerPage={null}
                      orderByDefault='order'
                      columns={noteColumns}
                      data={notes.list.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(notes)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>
            </>

        )
      }
    </Container>
  )
}

export default EmployeesList;