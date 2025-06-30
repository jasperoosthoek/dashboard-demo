import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormEditModalButton,
  FormModalProvider,
  useLocalization,
  DeleteConfirmButton,
  SmallSpinner,
  FormDropdown,
  FormDate,
} from '@jasperoosthoek/react-toolbox';

import { Employee, Project } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { formatCurrency, formatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useProjectStatus } from './ProjectPage';
import { useEmployeeFormList } from '../employees/EmployeesListPage';

export const useProjectFormFields = () => {  
  const employees = use.employees();
  const roles = use.roles();
  const customers = use.customers();
  const { text } = useLocalization();
  const employeeList = useEmployeeFormList();

  if (!employees.list || !roles.record || !customers.list || !employeeList) {
    return null;
  }
  return (
    {
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
          list: employeeList,
        },
        component: FormDropdown,
        label: text`employee`,
      },
      start_date: {
        component: FormDate,
        label: text`start_date`,
        required: true,
      },
      end_date: {
        component: FormDate,
        label: text`end_date`,
        required: true,
      },
    }
  )
}
const ProjectsListPage = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  const projectStatus = useProjectStatus();
  const projectFormFields = useProjectFormFields();

  useEffect(() => {
    projects.getList();
    employees.getList();
    customers.getList();
    roles.getList();
  }, []);

  return (
    <Container className='container-list'>
      {(!projects.list || !customers.list || !employees.list || !roles.record)? <SmallSpinner /> : 
        <FormModalProvider
          loading={projects.create.isLoading || projects.update.isLoading}
          initialState={{
            name: '',
            status: 'pending',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
          }}
          createModalTitle={text`create_new_project`}
          editModalTitle={text`edit_project`}
          formFields={projectFormFields}
          onCreate={(project, closeModal: () => void) => {
            projects.create(project, { callback: () => closeModal()});
          }}
          onUpdate={(project, closeModal: () => void) => {
            projects.update(project, { callback: () => closeModal()});
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
            filterColumn={({ name }: Project) => `${name}`}
            columns={[
              {
                name: text`name`,
                selector: (project) => (
                  <Link to={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                ),
                orderBy: 'name',
              },
              {
                name: text`amount`,
                selector: ({ amount }: Project) => formatCurrency(amount),
                orderBy: 'amount',
              },
              {
                name: text`status`,
                selector: (project) => projectStatus(project),
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
                  formatDate(start_date)
                ) ,
                orderBy: 'start_date',
              },
              {
                name: text`end_date`,
                selector: ({ end_date }: Project) => (
                  formatDate(end_date)
                ) ,
                orderBy: 'end_date',
              },
              {
                name: text`actions`,
                selector: (project) => (
                  <>
                    <FormEditModalButton
                      state={project}
                      title={text`edit_project`}
                    />
                    <DeleteConfirmButton
                      loading={projects.delete.isLoading && projects.delete.id === project.id}
                      modalTitle={text`delete_project${project.name}`}
                      onDelete={() => {
                        projects.delete(project);
                      }}
                    />
                  </>
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

export default ProjectsListPage;