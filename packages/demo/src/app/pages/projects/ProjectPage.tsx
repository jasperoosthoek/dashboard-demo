import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Table } from 'react-bootstrap';
import { useParams } from 'react-router';
import {
  FormModalProvider,
  useLocalization,
  SmallSpinner,
  FormEditModalButton,
  FormDate,
  DeleteConfirmButton,
  FormCreateModalButton,
  FormDropdown,
  FormTextArea,
  DataTable,
} from '@jasperoosthoek/react-toolbox';

import { Task, Project, Invoice } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { formatDate, formatCurrency } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useProjectFormFields } from './ProjectsListPage';
import { useEmployeeFormList } from '../employees/EmployeesListPage';

export const useProjectStatus = () => {
  const { text } = useLocalization(); 
  return (
    ({ status }: Project) => {
      switch (status) {
        case 'pending': return <Badge bg='secondary'>{text`project_status_pending`}</Badge>;
        case 'in_progress': return <Badge bg='warning'>{text`project_status_in_progress`}</Badge>;
        case 'completed': return <Badge bg='success'>{text`project_status_completed`}</Badge>;
        default: return status;
      }
    }
  );
}

export const useTaskStatus = () => {
  const { text } = useLocalization(); 
  return (
    ({ status }: Task) => {
      switch (status) {
        case 'todo': return <Badge bg='secondary'>{text`task_status_todo`}</Badge>
        case 'in_progress': return <Badge bg='warning'>{text`task_status_in_progress`}</Badge>
        case 'done': return <Badge bg='success'>{text`task_status_done`}</Badge>
        default: return status;
      }
    }
  );
}
export const useInvoiceStatus = () => {
  const { text } = useLocalization(); 
  return (
    ({ status }: Invoice) => {
      switch (status) {
        case 'open': return <Badge bg='danger'>{text`invoice_status_open`}</Badge>
        case 'paid': return <Badge bg='success'>{text`invoice_status_paid`}</Badge>
        default: return status;
      }
    }
  );
}

// priority
// : 
// ""
// related_project_id
// : 
// 1
// status
// : 
// "in_progress"
// title
// : 
// "Implement feedback"

export const  useTaskFormFields = () => {
  const { text } = useLocalization();
  
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const tasks = use.tasks();
  const invoices = use.invoices();
  const projectStatus = useProjectStatus();
  const taskStatus = useTaskStatus();
  const invoiceStatus = useInvoiceStatus();
  const employeeList = useEmployeeFormList();

  return {
    title: {
      label: text`title`,
      required: true,
    },
    description: {
      label: text`description',`,
      component: FormTextArea,
      required: true,
    },
    status: {
      formProps: {
        list: [
          {
            id: 'todo',
            name: text`task_status_todo`,
          },
          {
            id: 'in_progress',
            name: text`task_status_in_progress`,
          },
          {
            id: 'done',
            name: text`task_status_done`,
          },
        ],
      },
      component: FormDropdown,
      label: text`status`,
      required: true,
    },
    due_date: {
      component: FormDate,
      label: text`due_date`,
      required: true,
    },
    assigned_to_id: {
      formProps: {
        list: employeeList,
      },
      component: FormDropdown,
      label: text`assigned_to_employee`,
      required: true,
    },
  };
}

const ProjectsListPage = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const tasks = use.tasks();
  const invoices = use.invoices();
  const projectStatus = useProjectStatus();
  const taskStatus = useTaskStatus();
  const invoiceStatus = useInvoiceStatus();
  const projectFormFields = useProjectFormFields();
  const taskFormFields = useTaskFormFields();

  useEffect(() => {
    projects.getList();
    employees.getList();
    customers.getList();
    tasks.getList();
    invoices.getList();
  }, []);

  const { id } = useParams<{ id: string }>();
  const project = projects.record && projects?.record[id || ''] as Project | undefined;
  const customer = customers.record && customers?.record[project?.customer_id || ''];
  return (
    <Container className='container-list mt-4'>
      {(!projects.list || !customers.list || !employees.list || !tasks.list || !invoices.list || !projects.record)
        ? <SmallSpinner />
        : !project 
        ? <NotFound />
        : (
            <>
              <FormModalProvider
                initialState={project}
                loading={projects.update.isLoading}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onUpdate={(project, closeModal: () => void) => {
                  projects.update(project, { callback: () => closeModal()});
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
                  related_project_id: project.id,
                  status: 'todo',
                }}
                loading={tasks.create.isLoading || tasks.update.isLoading}
                editModalTitle={text`edit_task`}
                formFields={taskFormFields}
                onCreate={(task, closeModal: () => void) => {
                  tasks.create(task, { callback: () => closeModal()});
                }}
                onUpdate={(task, closeModal: () => void) => {
                  tasks.update(task, { callback: () => closeModal()});
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
                      orderByDefault='order'
                      columns={[
                        {
                          name: text`title`,
                          selector: ({ title, description }: Task) => (
                            <div title={description}>
                              {title}
                            </div>
                          ),
                          orderBy: 'title',
                        },
                        {
                          name: text`status`,
                          selector: (task: Task) => taskStatus(task),
                          orderBy: 'status',
                        },
                        {
                          name: text`due_date`,
                          selector: ({ due_date }: Task) => formatDate(due_date),
                          orderBy: 'due_date',
                        },
                        {
                          name: text`actions`,
                          selector: (task) => (
                            <>
                              <FormEditModalButton
                                state={task}
                                title={text`edit_task`}
                              />
                              <DeleteConfirmButton
                                loading={tasks.delete.isLoading && tasks.delete.id === task.id}
                                modalTitle={text`delete_task${task.title}`}
                                onDelete={() => {
                                  tasks.delete(task);
                                }}
                              />
                            </>
                          )
                        }
                      ]}
                      data={tasks.list.filter(({ related_project_id }) => related_project_id === project.id)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>
              <Card className="mb-4">
                <Card.Header>{text`linked_invoices`}</Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>{text`invoice_id`}</th>
                        <th>{text`amount`}</th>
                        <th>{text`status`}</th>
                        <th>{text`due_date`}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.list
                        .filter(({ project_id }) => project_id === project.id)
                        .map(invoice => (
                          <tr key={invoice.id}>
                            <td>#{invoice.id}</td>
                            <td>{formatCurrency(invoice.amount)}</td>
                            <td>{invoiceStatus(invoice)}</td>
                            <td>{formatDate(invoice.due_date)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

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

export default ProjectsListPage;