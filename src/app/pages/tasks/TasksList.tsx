import { useState, useEffect } from 'react';
import { Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormEditModalButton,
  FormModalProvider,
  useLocalization,
  FormTextarea,
  SmallSpinner,
  FormDropdown,
  FormDate,
  DeleteConfirmButton,
  type FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import type { Project, Task, TaskFilterStatus, Employee, MapStatus } from '../../stores/types';
import { use, onMove } from '../../stores/crudRegistry'
import { useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/EmployeesList';
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
  const projects = use.projects()
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
                list={projects.list?.sort((p1, p2) => p1.name > p2.name ? 1 : -1) || []}
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

export type UseTaskColumnsProps = { excludeProject?: boolean, excludeEmployee?: boolean; filterStatus?: boolean }
export const useTaskColumns = ({ excludeProject, excludeEmployee, filterStatus }: UseTaskColumnsProps = {}) => {
  const { text } = useLocalization();
  const employees = use.employees();
  const tasks = use.tasks();
  const taskStatus = useTaskStatus();
  const projects = use.projects();
  const formatDate = useFormatDate();
  const taskStatusText = useTaskStatusText();
  
  if (!tasks.list || !employees.record || !projects.record) {
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
            const project = projects.record && projects.record[project_id];
            return (
              project
                ? <Link to={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                : <NotFound />
            );
          },
          orderBy: 'project_id',
          search: ({ project_id }: Task) => projects.record && projects.record[project_id]?.name || '',
        }
      ] : [],
      ...!excludeEmployee ? [
        {
          name: text`assigned_to_employee`,
          selector: ({ employee_id }: Task) => {
            const employee = employees.record && employees.record[employee_id];
            return (
              employee
                ? <EmployeeLink employee={employee} />
                : <NotFound />
            );
          },
          search: ({ employee_id }: Task) => employees.record && employees.record[employee_id]?.name || '',
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
        ...filterStatus ? (
          {
            optionsDropdown: {
              selected: tasks.state.filterStatus,
              onSelect: (status: string | null) => tasks.setState({ filterStatus: status as TaskFilterStatus }),
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
              loading={tasks.delete.isLoading && tasks.delete.id === task.id}
              modalTitle={text`delete_task${task.title}`}
              onDelete={() => {
                tasks.delete(task);
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
const TasksList = () => {
  const { text } = useLocalization();
  const tasks = use.tasks();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  const taskFormFields = useTaskFormFields();
  const taskColumns = useTaskColumns({ filterStatus: true });
  const taskStatusText = useTaskStatusText();
  const { filterStatus } = tasks.state;
  useEffect(() => tasks.setState({ filterStatus: null }), [])

  return (
    <Container className='container-list'>
      {(!tasks.list || !customers.list || !employees.list || !roles.record)? <SmallSpinner /> : 
        <FormModalProvider
          loading={tasks.create.isLoading || tasks.update.isLoading}
          initialState={taskInitialState}
          createModalTitle={text`create_new_task`}
          editModalTitle={text`edit_task`}
          formFields={taskFormFields}
          onCreate={(task: Task, closeModal: () => void) => {
            tasks.create(task, { callback: closeModal});
          }}
          onUpdate={(task: Task, closeModal: () => void) => {
            tasks.update(task, { callback: closeModal});
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
                  {text`create_new_task`}
                </FormCreateModalButton> 
              )
            }}
            columns={taskColumns}
            data={tasks.list.filter(task => filterStatus === null || task.status === filterStatus)}
            onMove={onMove(tasks)}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default TasksList;