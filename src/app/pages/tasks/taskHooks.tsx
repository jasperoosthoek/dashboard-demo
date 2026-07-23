import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import {
  useLocalization,
  FormDropdown,
  FormTextarea,
  FormDate,
  FormEditModalButton,
  DeleteConfirmButton,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Project, Task, TaskFilterStatus, Employee, MapStatus } from '../../stores/types';
import { r } from '../../resources';
import { useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/employeeHooks';
import EmployeeLink from '../employees/EmployeeLink';

export const useTaskStatusText = () => {
  const { text } = useLocalization();
  const taskStatusTexts = (
    {
      todo: text`task_status_todo`,
      in_progress: text`task_status_in_progress`,
      done: text`task_status_done`,
    }
  )
  return (status: Task['status']) => taskStatusTexts[status] || '';
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

export const  useTaskFormFields = ({ excludeProject, excludeEmployee }: { excludeProject?: boolean, excludeEmployee?: boolean } = {}) => {
  const { text } = useLocalization();
  const employeeList = useEmployeeFormList();
  const projects = r.projects.useList();
  const taskStatusText = useTaskStatusText();

  return {
    title: {
      label: text`title`,
      required: true,
    },
    description: {
      label: text`description`,
      component: FormTextarea,
    },
    status: {
      component: (props: FormDropdownProps<MapStatus<Task['status']>>) => (
        <FormDropdown
          {...props}
          idKey='id'
          nameKey='name'
          list={[
            {
              id: 'todo',
              name: taskStatusText('todo'),
            },
            {
              id: 'in_progress',
              name: taskStatusText('in_progress'),
            },
            {
              id: 'done',
              name: taskStatusText('done'),
            },
          ]}
        />
      ),
      label: text`status`,
      required: true,
    },
    due_date: {
      component: FormDate,
      label: text`due_date`,
      required: true,
    },

    ...!excludeProject
      ? {
          project_id: {
            component: (props: FormDropdownProps<Project>) => (
              <FormDropdown
                {...props}
                idKey='id'
                nameKey='name'
                list={projects.data ? [...projects.data].sort((p1, p2) => p1.name > p2.name ? 1 : -1) : []}
                // Disable changing project when already saved i.e. project has an id
                disabled={({ state: project }) => !!project.id}
              />
            ),
            label: text`project`,
          },
        }
      : {},
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
            label: text`assigned_to_employee`,
            required: true,
          },
        }
      : {},
  };
}

export type UseTaskColumnsProps = {
  excludeProject?: boolean;
  excludeEmployee?: boolean;
  filterStatus?: TaskFilterStatus;
  onFilterStatusChange?: (status: TaskFilterStatus) => void;
};
export const useTaskColumns = ({ excludeProject, excludeEmployee, filterStatus, onFilterStatusChange }: UseTaskColumnsProps = {}) => {
  const { text } = useLocalization();
  const employees = r.employees.useList();
  const deleteTask = r.tasks.useDelete();
  const taskStatus = useTaskStatus();
  const projects = r.projects.useList();
  const roles = r.roles.useList();
  const formatDate = useFormatDate();
  const taskStatusText = useTaskStatusText();

  if (!employees.data || !projects.data) {
    return [];
  }

  return (
    [
      {
        name: text`title`,
        selector: ({ title, description }: Task) => (
          <div title={description}>
            {title}
          </div>
        ),
        orderBy: 'title',
        search: 'title',
      },
      ...!excludeProject ? [
        {
          name: text`project`,
          selector: ({ project_id }: Task) => {
            const project = projects.find(project_id);
            return (
              project
                ? <Link to={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                : <NotFound />
            );
          },
          orderBy: 'project_id',
          search: ({ project_id }: Task) => projects.find(project_id)?.name || '',
        }
      ] : [],
      ...!excludeEmployee ? [
        {
          name: text`assigned_to_employee`,
          selector: ({ employee_id }: Task) => {
            const employee = employees.find(employee_id);
            return (
              employee
                ? <EmployeeLink employee={employee} role={roles.find(employee.role_id)} />
                : <NotFound />
            );
          },
          search: ({ employee_id }: Task) => employees.find(employee_id)?.name || '',
          orderBy: 'employee_id',
        }
      ] : [],
      {
        name: text`due_date`,
        selector: ({ due_date }: Task) => formatDate(due_date),
        orderBy: 'due_date',
      },
      {
        name: text`status`,
        selector: (task: Task) => taskStatus(task),
        orderBy: 'status',
        search: ({ status }: Task) => taskStatusText(status) || '',
        ...onFilterStatusChange ? (
          {
            optionsDropdown: {
              selected: filterStatus ?? null,
              onSelect: (status: string | null) => onFilterStatusChange(status as TaskFilterStatus),
              options: {
                todo: taskStatusText('todo'),
                in_progress: taskStatusText('in_progress'),
                done: taskStatusText('done'),
              }
            },
          }
        ) : {},
      },
      {
        name: text`actions`,
        selector: (task: Task) => (
          <>
            <FormEditModalButton
              state={task}
              title={text`edit_task`}
            />
            <DeleteConfirmButton
              loading={deleteTask.isPending}
              modalTitle={text`delete_task${task.title}`}
              onDelete={() => {
                deleteTask.mutate(task);
              }}
            />
          </>
        )
      }
    ]
  )
}

export const taskInitialState: Partial<Task> = (
  {
    title: '',
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
  }
)
