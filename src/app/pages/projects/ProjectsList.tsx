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

import type { Project, ProjectFilterStatus } from '../../stores/types';
import { use, useGetListOnMount, onMove } from '../../stores/crudRegistry'
import { formatCurrency, useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useProjectStatus, useProjectStatusText } from './ProjectItem';
import { useEmployeeFormList } from '../employees/EmployeesList';
import EmployeeLink from '../employees/EmployeeLink';

export const useProjectFormFields = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {  
  const customers = use.customers();
  const { text } = useLocalization();
  const employeeList = useEmployeeFormList();
  const projectStatusText = useProjectStatusText();

  if (!customers.list || !employeeList) {
    return [];
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
              name: projectStatusText('pending'),
            },
            {
              id: 'in_progress',
              name: projectStatusText('in_progress'),
            },
            {
              id: 'completed',
              name: projectStatusText('completed'),
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
      ...!excludeEmployee
        ? {
            employee_id: {
              formProps: {
                list: employeeList,
              },
              component: FormDropdown,
              label: text`employee`,
            },
          }
        : {},
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

export type UseProjectColumnsProps = { excludeEmployee?: boolean; filterStatus?: boolean }

export const useProjectColumns = ({ excludeEmployee, filterStatus }: UseProjectColumnsProps = {}) => {  
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  useGetListOnMount(projects, employees, customers, roles);
  const formatDate = useFormatDate();
  
  const projectStatus = useProjectStatus();
  const projectStatusText = useProjectStatusText();
  return (
    [
      {
        name: text`name`,
        selector: (project: Project) => (
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
        name: text`customer`,
        selector: ({ customer_id }: Project) => {
          const customer = customers.record && customers.record[customer_id];
          return (
            customer
              ? <div title={`${customer?.name} (${customer?.contact_person})`}>
                  {customer?.name}
                </div>
              : <NotFound />
          );
        },
        orderBy: ({ customer_id }: Project) => customers.record && customers.record[customer_id]?.name || customer_id,
      },
      ...!excludeEmployee ? [
        {
          name: text`employee`,
          selector: ({ employee_id }: Project) => {
            const employee = employees.record && employees.record[employee_id];
            return (
              employee
                ? <EmployeeLink employee={employee} />
                : <NotFound />
            );
          },
          orderBy: ({ employee_id }: Project) => employees.record && employees.record[employee_id]?.name || employee_id,
        },
      ] : [],
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
        name: text`status`,
        selector: (project: Project) => projectStatus(project),
        orderBy: 'status',
        ...filterStatus ? (
          {
            optionsDropdown: {
              selected: projects.state.filterStatus,
              onSelect: (status: string | null) => projects.setState({ filterStatus: status as ProjectFilterStatus }),
              options: {
                pending: projectStatusText('pending'),
                in_progress: projectStatusText('in_progress'),
                completed: projectStatusText('completed'),
              }
            },
          }
        ) : {},
      },
      {
        name: text`actions`,
        selector: (project: Project) => (
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
    ]
  )
}

export const projectInitialState = (
  {
    name: '',
    status: 'pending',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  }
) as Partial<Project>

const ProjectsList = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  useGetListOnMount(projects, employees, customers, roles)
  
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
            filterColumn={[
              'name',
              'amount',
              ({ status }: Project) => projectStatusText(status),
              ({ customer_id }: Project) => customers.record && customers.record[customer_id]?.name || '',
              ({ employee_id }: Project) => employees.record && employees.record[employee_id]?.name || '',
            ]}
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