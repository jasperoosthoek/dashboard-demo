import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import { addDays, format } from 'date-fns';
import {
  FormModalProvider,
  useLocalization,
  SmallSpinner,
  FormEditModalButton,
  FormCreateModalButton,
  DataTable,
} from '@jasperoosthoek/react-toolbox';

import type { Project, Task, Invoice } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import { formatCurrency } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useProjectFormFields, useProjectStatus } from './projectHooks';
import { useTaskColumns, useTaskFormFields } from '../tasks/taskHooks';
import { useInvoiceColumns, useInvoiceFormFields } from '../invoices/invoiceHooks';

const ProjectItem = () => {
  const { text } = useLocalization();
  const projects = r.projects.useList();
  const updateProject = r.projects.useUpdate();
  const employees = r.employees.useList();
  const customers = r.customers.useList();
  const tasks = r.tasks.useList();
  const createTask = r.tasks.useCreate();
  const updateTask = r.tasks.useUpdate();
  const moveTask = r.tasks.useMove();
  const invoices = r.invoices.useList();
  const createInvoice = r.invoices.useCreate();
  const updateInvoice = r.invoices.useUpdate();
  const moveInvoice = r.invoices.useMove();
  const roles = r.roles.useList(); // Required by projectFormFields
  const projectStatus = useProjectStatus();
  const projectFormFields = useProjectFormFields();
  const taskFormFields = useTaskFormFields();
  const taskColumns = useTaskColumns({ excludeProject: true });
  const invoiceFormFields = useInvoiceFormFields({ excludeProject: true });
  const invoiceColumns = useInvoiceColumns({ excludeProject: true });

  const { id } = useParams<{ id: string }>();
  const project = id && projects.find(id);
  const customer = project && customers.find(project.customer_id);
  return (
    <Container className='container-list mt-4'>
      {(!customer || !projects.data || !customers.data || !employees.data || !tasks.data || !invoices.data || !roles.data)
        ? <SmallSpinner />
        : !project
        ? <NotFound />
        : (
            <>
              <FormModalProvider
                initialState={project || {}}
                loading={updateProject.isPending}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onUpdate={(project: Project, closeModal: () => void) => {
                  updateProject.mutate(project, { onSuccess: closeModal });
                }}
              >
                <h2>
                  {project.name}
                  <FormEditModalButton
                    state={project}
                    title={text`edit_project`}
                  />
                </h2>
              </FormModalProvider>

              <Card className="mb-4">
                <Card.Header>{text`project_info`}</Card.Header>
                <Card.Body>
                  <Row>
                    <Col>{text`status`}:</Col>
                    <Col>
                      {projectStatus(project)}
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>{text`budget`}:</Col>
                    <Col>{formatCurrency(project.amount)}</Col>
                  </Row>
                </Card.Body>
              </Card>


              <FormModalProvider
                initialState={{
                  due_date: new Date().toISOString().split('T')[0],
                  project_id: project.id,
                  status: 'todo',
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
                    {text`linked_tasks`}

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
                      data={tasks.data.filter(({ project_id }) => project_id === project.id)}
                      onMove={onMove(moveTask)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>


              <FormModalProvider
                initialState={{
                  due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
                  project_id: project.id,
                  status: 'open',
                }}
                loading={createInvoice.isPending || updateInvoice.isPending}
                editModalTitle={text`edit_invoice`}
                formFields={invoiceFormFields}
                onCreate={(invoice: Invoice, closeModal: () => void) => {
                  createInvoice.mutate(invoice, { onSuccess: closeModal });
                }}
                onUpdate={(invoice: Invoice, closeModal: () => void) => {
                  updateInvoice.mutate(invoice, { onSuccess: closeModal });
                }}
              >
                <Card className="mb-4">
                  <Card.Header>
                    {text`linked_invoices`}

                    <FormCreateModalButton>
                      {/* {text`create_new_invoice`} */}
                    </FormCreateModalButton>
                  </Card.Header>
                  <Card.Body>
                    <DataTable
                      showHeader={false}
                      rowsPerPage={null}
                      orderByDefault='order'
                      columns={invoiceColumns}
                      data={invoices.data.filter(({ project_id }) => project_id === project.id)}
                      onMove={onMove(moveInvoice)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>

              <Card>
                <Card.Header>{text`customer_info`}</Card.Header>
                <Card.Body>
                  <Row>
                    <Col>{text`company`}:</Col>
                    <Col>{customer.name}</Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>{text`contact`}:</Col>
                    <Col>{customer.contact_person}</Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>{text`email`}:</Col>
                    <Col>{customer.email}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </>

        )
      }
    </Container>
  )
}

export default ProjectItem;
