import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Table } from 'react-bootstrap';
import { useParams } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
  FormDropdown,
} from '@jasperoosthoek/react-toolbox';

import { Task, Project, Invoice } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { formatDate, formatCurrency } from '../../localization/localization';
import NotFound from '../../components/NotFound';



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
              <h2>{project.name}</h2>

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

              <Card className="mb-4">
                <Card.Header>{text`linked_tasks`}</Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>{text`title`}</th>
                        <th>{text`status`}</th>
                        <th>{text`due_date`}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.list
                        .filter(({ related_project_id }) => related_project_id === project.id)
                        .map(task => (
                          <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{taskStatus(task)}</td>
                            <td>{formatDate(task.due_date)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

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