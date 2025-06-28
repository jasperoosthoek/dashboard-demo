import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import moment from 'moment';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
  FormDropdown,
} from '@jasperoosthoek/react-toolbox';

import { Employee, Project } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { formatCurrency } from '../../utils';
import NotFound from '../../components/NotFound';

const ProjectsPage = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();

  useEffect(() => {
    projects.getList();
    employees.getList();
    customers.getList();
    roles.getList();
  }, []);
  console.log('projects', projects.list);

  return (
    <Container className='container-list'>
      {(!projects.list || !customers.list || !employees.list || !roles.record)? <SmallSpinner /> : 
        <FormModalProvider
          loading={projects.create.isLoading || projects.update.isLoading}
          initialState={{
            name: '',
            status: 'pending',
          }}
          createModalTitle={text`create_new_project`}
          editModalTitle={text`edit_project`}
          formFields={{
            name: {
              label: text`name`,
              required: true,
            },
            amount: {
              label: text`amount`,
              required: true,
              formProps: {
                type: 'number',
              },
            },
            status: {
              formProps: {
                list: [
                  {
                    id: 'pending',
                    name: text`project_status_pending`,
                  },
                  {
                    id: 'in_progress',
                    name: text`project_status_in_progress`,
                  },
                  {
                    id: 'completed',
                    name: text`project_status_completed`,
                  },
                ],
              },
              component: FormDropdown,
              label: text`status`,
              required: true,
            },
            customer_id: {
              formProps: {
                list: customers.list?.sort((c1, c2) => c1.name > c2.name ? 1 : -1) || [],
              },
              component: FormDropdown,
              label: text`customer`,
              required: true,
            },
            employee_id: {
              formProps: {
                list: (
                  employees.list?.sort((e1, e2) => e1.name > e2.name ? 1 : -1) || []
                ).map((e: Employee) => ({ ...e, name: `${e.name} (${roles.record[e.role_id]?.name})` })),
              },
              component: FormDropdown,
              label: text`employee`,
            },
          }}
          onCreate={(project, closeModal: () => void) => {
            projects.create(project, { callback: () => closeModal()});
          }}
          onUpdate={(project, closeModal: () => void) => {
            projects.update(project, { callback: () => closeModal()});
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
                  {text`create_new_project`}
                </FormCreateModalButton> 
              )
            }}
            filterColumn={({ name }: Project) => `${name}`}
            columns={[
              {
                name: text`name`,
                selector: 'name',
                orderBy: 'name',
              },
              {
                name: text`amount`,
                selector: ({ amount }: Project) => formatCurrency(amount),
                orderBy: 'amount',
              },
              {
                name: text`status`,
                selector: ({ status }: Project) => {
                  switch (status) {
                    case 'pending':
                      return text`project_status_pending`;
                    case 'in_progress':
                      return text`project_status_in_progress`;
                    case 'completed':
                      return text`project_status_completed`;
                    default:
                      return status;
                  }
                },
                orderBy: 'status',
              },
              {
                name: text`customer`,
                selector: ({ customer_id }: Project) => {
                  const customer = customers.record[customer_id];
                  return (
                    customer
                      ? <div title={`${customer?.name} (${customer?.contact_person})`}>
                          {customer?.name}
                        </div>
                      : <NotFound />
                  );
                },
                orderBy: ({ customer_id }) => customers.record[customer_id]?.name || customer_id,
              },
              {
                name: text`employee`,
                selector: ({ employee_id }: Project) => {
                  const employee = employees.record[employee_id];
                  return (
                    employee
                      ? <div title={`${employee.name} (${roles.record[employee.role_id]?.name})`}>
                          {employee?.name}
                        </div>
                      : <NotFound />
                  );
                },
                orderBy: ({ employee_id }) => employees.record[employee_id]?.name || employee_id,
              },
              {
                name: text`start_date`,
                selector: ({ start_date }: Project) => (
                  moment(start_date).format('YYYY-MM-DD')
                ) ,
                orderBy: 'start_date',
              },
              {
                name: text`end_date`,
                selector: ({ end_date }: Project) => (
                  moment(end_date).format('YYYY-MM-DD')
                ) ,
                orderBy: 'end_date',
              },
              {
                name: text`actions`,
                selector: (project) => (
                  <DeleteConfirmButton
                    loading={projects.delete.isLoading && projects.delete.id === project.id}
                    modalTitle={text`delete_project${project.name}`}
                    onDelete={() => {
                      projects.delete(project);
                    }}
                  />
                )
              }
            ]}
            data={projects.list}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default ProjectsPage;