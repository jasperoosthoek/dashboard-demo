import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Table } from 'react-bootstrap';
import { useParams } from 'react-router';
import { addDays, format } from 'date-fns';
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

import { Task, Employee, Invoice } from '../../stores/types';
import { use, useGetListOnMount } from '../../stores/crudRegistry'
import { formatDate, formatCurrency } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useNoteFormFields, useNoteColumns } from '../notes/NotesList';
import { useEmployeeFormFields } from './EmployeesList';
import { useProjectFormFields, useProjectColumns } from '../projects/ProjectsList';

const EmployeesList = () => {
  const { text } = useLocalization();
  const employees = use.employees();
  const customers = use.customers();
  const notes = use.notes();
  const invoices = use.invoices();
  const projects = use.projects();
  const roles = use.roles(); // Required by noteFormFields
  useGetListOnMount(employees, employees, customers, notes, invoices, roles, projects)
  const noteFormFields = useNoteFormFields();
  const noteColumns = useNoteColumns();
  const employeeFormFields = useEmployeeFormFields();
  const projectFormFields = useProjectFormFields();
  const projectColumns = useProjectColumns();

  const { id } = useParams<{ id: string }>();
  const employee = employees.record && employees?.record[id || ''] as Employee | undefined;
  
  return (
    <Container className='container-list mt-4'>
      {(!employees.list || !customers.list || !employees.list || !notes.list || !invoices.list || !noteFormFields || !roles.record || !projects.list)
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
                onUpdate={(employee, closeModal: () => void) => {
                  employees.update(employee, { callback: () => closeModal()});
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
                      {roles.record[employee.role_id]?.name || <NotFound />}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <FormModalProvider
                initialState={{
                  employee_id: employee.id,
                }}
                loading={projects.create.isLoading || projects.update.isLoading}
                editModalTitle={text`edit_project`}
                formFields={projectFormFields}
                onCreate={(project, closeModal: () => void) => {
                  projects.create(project, { callback: () => closeModal()});
                }}
                onUpdate={(project, closeModal: () => void) => {
                  projects.update(project, { callback: () => closeModal()});
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
                      orderByDefault='order'
                      columns={projectColumns}
                      data={projects.list.filter(({ employee_id }) => employee_id === employee.id)}
                    />
                  </Card.Body>
                </Card>
              </FormModalProvider>

              <FormModalProvider
                initialState={{
                  created_at: new Date().toISOString().split('T')[0],
                  employee_id: employee.id,
                }}
                loading={notes.create.isLoading || notes.update.isLoading}
                editModalTitle={text`edit_note`}
                formFields={noteFormFields}
                onCreate={(note, closeModal: () => void) => {
                  notes.create(note, { callback: () => closeModal()});
                }}
                onUpdate={(note, closeModal: () => void) => {
                  notes.update(note, { callback: () => closeModal()});
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
                      orderByDefault='order'
                      columns={noteColumns}
                      data={notes.list.filter(({ employee_id }) => employee_id === employee.id)}
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