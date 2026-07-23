import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import {
  FormModalProvider,
  useLocalization,
  SmallSpinner,
  FormEditModalButton,
  FormCreateModalButton,
  DataTable,
} from '@jasperoosthoek/react-toolbox';

import type { Employee, Project, Task, Note } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import NotFound from '../../components/NotFound';
import { useEmployeeFormFields } from './employeeHooks';
import { useNoteFormFields, useNoteColumns, noteInitialState } from '../notes/noteHooks';
import { useProjectFormFields, useProjectColumns, projectInitialState } from '../projects/projectHooks';
import { useTaskFormFields, useTaskColumns, taskInitialState } from '../tasks/taskHooks';

const EmployeeItem = () => {
  const { text } = useLocalization();
  const employees = r.employees.useList();
  const updateEmployee = r.employees.useUpdate();
  const customers = r.customers.useList();
  const notes = r.notes.useList();
  const createNote = r.notes.useCreate();
  const updateNote = r.notes.useUpdate();
  const moveNote = r.notes.useMove();
  const invoices = r.invoices.useList();
  const projects = r.projects.useList();
  const createProject = r.projects.useCreate();
  const updateProject = r.projects.useUpdate();
  const moveProject = r.projects.useMove();
  const tasks = r.tasks.useList();
  const createTask = r.tasks.useCreate();
  const updateTask = r.tasks.useUpdate();
  const moveTask = r.tasks.useMove();
  const roles = r.roles.useList(); // Required by noteFormFields
  const noteFormFields = useNoteFormFields({ excludeEmployee: true });
  const noteColumns = useNoteColumns({ excludeEmployee: true });
  const employeeFormFields = useEmployeeFormFields();
  const projectFormFields = useProjectFormFields({ excludeEmployee: true });
  const projectColumns = useProjectColumns({ excludeEmployee: true });
  const taskFormFields = useTaskFormFields({ excludeEmployee: true });
  const taskColumns = useTaskColumns({ excludeEmployee: true });

  const { id } = useParams<{ id: string }>();
  const employee = id && employees.find(id);

  return (
    <Container className='container-list mt-4'>
      {(!employees.data || !customers.data || !notes.data || !invoices.data || !noteFormFields || !roles.data || !projects.data || !tasks.data)
        ? <SmallSpinner />
        : !employee
        ? <NotFound />
        : (
            <>
              <FormModalProvider
                initialState={employee || {}}
                loading={updateEmployee.isPending}
                editModalTitle={text`edit_employee`}
                formFields={employeeFormFields}
                onUpdate={(employee: Employee, closeModal: () => void) => {
                  updateEmployee.mutate(employee, { onSuccess: closeModal });
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
                      {roles.find(employee.role_id)?.name || <NotFound />}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <FormModalProvider
                initialState={{
                  ...projectInitialState,
                  employee_id: employee.id,
                }}
                loading={createProject.isPending || updateProject.isPending}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onCreate={(project: Project, closeModal: () => void) => {
                  createProject.mutate(project, { onSuccess: closeModal });
                }}
                onUpdate={(project: Project, closeModal: () => void) => {
                  updateProject.mutate(project, { onSuccess: closeModal });
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
                      data={projects.data.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(moveProject)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>


              <FormModalProvider
                initialState={{
                  ...taskInitialState,
                  employee_id: employee.id,
                }}
                loading={createTask.isPending || updateTask.isPending}
                editModalTitle={text`edit_task`}
                formFields={taskFormFields}
                onCreate={(task: Task, closeModal: () => void) => {
                  createTask.mutate(task, { onSuccess: closeModal });
                }}
                onUpdate={(task: Task, closeModal: () => void) => {
                  updateTask.mutate(task, { onSuccess: closeModal });
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
                      data={tasks.data.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(moveTask)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>

              <FormModalProvider
                initialState={{
                  ...noteInitialState,
                  employee_id: employee.id,
                }}
                loading={createNote.isPending || updateNote.isPending}
                editModalTitle={text`edit_note`}
                formFields={noteFormFields}
                onCreate={(note: Note, closeModal: () => void) => {
                  createNote.mutate(note, { onSuccess: closeModal });
                }}
                onUpdate={(note: Note, closeModal: () => void) => {
                  updateNote.mutate(note, { onSuccess: closeModal });
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
                      data={notes.data.filter(({ employee_id }) => employee_id === employee.id)}
                      onMove={onMove(moveNote)}
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

export default EmployeeItem;
