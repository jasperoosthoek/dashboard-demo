import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
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
import { use, onMove } from '../../stores/crudRegistry'
import { formatCurrency } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useProjectFormFields, useProjectStatus } from './projectHooks';
import { useTaskColumns, useTaskFormFields } from '../tasks/taskHooks';
import { useInvoiceColumns, useInvoiceFormFields } from '../invoices/invoiceHooks';

const ProjectsList = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const tasks = use.tasks();
  const invoices = use.invoices();
  const roles = use.roles(); // Required by projectFormFields
  const projectStatus = useProjectStatus();
  const projectFormFields = useProjectFormFields();
  const taskFormFields = useTaskFormFields();
  const taskColumns = useTaskColumns({ excludeProject: true });
  const invoiceFormFields = useInvoiceFormFields({ excludeProject: true });
  const invoiceColumns = useInvoiceColumns({ excludeProject: true });

  const { id } = useParams<{ id: string }>();
  const project = projects.record && projects?.record[id || ''] as Project | undefined;
  const customer = customers.record && customers?.record[project?.customer_id || ''];
  return (
    <Container className='container-list mt-4'>
      {(!customer || !projects.list || !customers.list || !employees.list || !tasks.list || !invoices.list || !projectFormFields)
        ? <SmallSpinner />
        : !project
        ? <NotFound />
        : (
            <>
              <FormModalProvider
                initialState={project || {}}
                loading={projects.update.isLoading}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onUpdate={(project: Project, closeModal: () => void) => {
                  projects.update(project, { callback: closeModal});
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
                loading={tasks.create.isLoading || tasks.update.isLoading}
                editModalTitle={text`edit_task`}
                formFields={taskFormFields}
                onCreate={(task: Task, closeModal: () => void) => {
                  tasks.create(task, { callback: closeModal});
                }}
                onUpdate={(task: Task, closeModal: () => void) => {
                  tasks.update(task, { callback: closeModal});
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
                      data={tasks.list.filter(({ project_id }) => project_id === project.id)}
                      onMove={onMove(tasks)}
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
                loading={invoices.create.isLoading || invoices.update.isLoading}
                editModalTitle={text`edit_invoice`}
                formFields={invoiceFormFields}
                onCreate={(invoice: Invoice, closeModal: () => void) => {
                  invoices.create(invoice, { callback: closeModal});
                }}
                onUpdate={(invoice: Invoice, closeModal: () => void) => {
                  invoices.update(invoice, { callback: closeModal});
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
                      data={invoices.list.filter(({ project_id }) => project_id === project.id)}
                      onMove={onMove(invoices)}
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

export default ProjectsList;
