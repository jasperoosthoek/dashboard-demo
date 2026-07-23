import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import {
  useLocalization,
  FormDropdown,
  FormDate,
  FormEditModalButton,
  DeleteConfirmButton,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Project, ProjectFilterStatus, Employee, Customer, MapStatus } from '../../stores/types';
import { r } from '../../resources';
import { formatCurrency, useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/employeeHooks';
import EmployeeLink from '../employees/EmployeeLink';

export const useProjectStatusText = () => {
  const { text } = useLocalization();
  const projectStatusTexts = (
    {
      pending: text`project_status_pending`,
      in_progress: text`project_status_in_progress`,
      completed: text`project_status_completed`,
    }
  )
  return (status: Project['status']) => projectStatusTexts[status] || '';
}

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

export const useProjectFormFields = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {
  const customers = r.customers.useList();
  const { text } = useLocalization();
  const employeeList = useEmployeeFormList();
  const projectStatusText = useProjectStatusText();

  if (!customers.data || !employeeList) {
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
        },
        component: (props: FormDropdownProps<MapStatus<Project['status']>>) => (
          <FormDropdown
            {...props}
            idKey='id'
            nameKey='name'
            list={[
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
            ]}
          />
        ),
        label: text`status`,
        required: true,
      },
      customer_id: {
        component: (props: FormDropdownProps<Customer>) => (
          <FormDropdown
            {...props}
            idKey='id'
            nameKey='name'
            list={[...customers.data].sort((c1, c2) => c1.name > c2.name ? 1 : -1)}
          />
        ),
        label: text`customer`,
        required: true,
      },
      ...!excludeEmployee
        ? {
            employee_id: {
              component: (props: FormDropdownProps<Employee>) => (
                <FormDropdown
                  {...props}
                  idKey='id'
                  nameKey='name'
                  list={employeeList || []}
                />
              ),
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

export type UseProjectColumnsProps = {
  excludeEmployee?: boolean;
  filterStatus?: ProjectFilterStatus;
  onFilterStatusChange?: (status: ProjectFilterStatus) => void;
};

export const useProjectColumns = ({ excludeEmployee, filterStatus, onFilterStatusChange }: UseProjectColumnsProps = {}) => {
  const { text } = useLocalization();
  const deleteProject = r.projects.useDelete();
  const employees = r.employees.useList();
  const customers = r.customers.useList();
  const roles = r.roles.useList();
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
        search: 'name',
      },
      {
        name: text`amount`,
        selector: ({ amount }: Project) => formatCurrency(amount),
        orderBy: 'amount',
        search: 'amount',
      },
      {
        name: text`customer`,
        selector: ({ customer_id }: Project) => {
          const customer = customers.find(customer_id);
          return (
            customer
              ? <div title={`${customer?.name} (${customer?.contact_person})`}>
                  {customer?.name}
                </div>
              : <NotFound />
          );
        },
        orderBy: ({ customer_id }: Project) => customers.find(customer_id)?.name || customer_id,
        search: ({ customer_id }: Project) => customers.find(customer_id)?.name || '',
      },
      ...!excludeEmployee ? [
        {
          name: text`employee`,
          selector: ({ employee_id }: Project) => {
            const employee = employees.find(employee_id);
            return (
              employee
                ? <EmployeeLink employee={employee} role={roles.find(employee.role_id)} />
                : <NotFound />
            );
          },
          orderBy: ({ employee_id }: Project) => employees.find(employee_id)?.name || employee_id,
          search: ({ employee_id }: Project) => employees.find(employee_id)?.name || '',
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
        search: ({ status }: Project) => projectStatusText(status),
        ...onFilterStatusChange ? (
          {
            optionsDropdown: {
              selected: filterStatus ?? null,
              onSelect: (status: string | null) => onFilterStatusChange(status as ProjectFilterStatus),
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
              loading={deleteProject.isPending}
              modalTitle={text`delete_project${project.name}`}
              onDelete={() => {
                deleteProject.mutate(project);
              }}
            />
          </>
        )
      }
    ]
  )
}

export const projectInitialState: Partial<Project> = (
  {
    name: '',
    status: 'pending',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  }
)
