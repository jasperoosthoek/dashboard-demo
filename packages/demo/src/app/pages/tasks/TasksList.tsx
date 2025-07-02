import { useState, useEffect } from 'react';
import { Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  DataTable,
  FormCreateModalButton,
  FormEditModalButton,
  FormModalProvider,
  useLocalization,
  FormTextArea,
  SmallSpinner,
  FormDropdown,
  FormDate,
  DeleteConfirmButton,
  FormDropdownProps,
} from '@jasperoosthoek/react-toolbox';

import { Project, Task } from '../../stores/types';
import { use, useGetListOnMount } from '../../stores/crudRegistry'
import { formatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/EmployeesList';

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

export const  useTaskFormFields = ({ includeProject }: { includeProject?: boolean } = {}) => {
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
      component: FormTextArea,
    },
    status: {
      formProps: {
        list: [
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
    
    ...includeProject
      ? {
          project_id: {
            formProps: {
              list: projects.list?.sort((p1, p2) => p1.name > p2.name ? 1 : -1) || [],
              // Disable changing project when already saved i.e. project has an id
              disabled: ({ state: project }) => !!project.id,
            } as FormDropdownProps<Project>,
            component: FormDropdown,
            label: text`project`,
          },
        }
      : {},
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

export const useTaskColumns = ({ includeProject }: { includeProject?: boolean } = {}) => {
  const { text } = useLocalization();
  const employees = use.employees();
  const tasks = use.tasks();
  const taskStatus = useTaskStatus();
  const projects = use.projects();
  
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
      },
      ...includeProject ? [
        {
          name: text`project`,
          selector: ({ project_id }: Task) => {
            const project = projects.record[project_id];
            return (
              project
                ? <Link to={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                : <NotFound />
            );
          },
          orderBy: 'project_id',
        }
      ] : [],
      {
        name: text`assigned_to_employee`,
        selector: ({ assigned_to_id }: Task) => {
          const employee = employees.record[assigned_to_id];
          return (
            employee
              ? <div title={`${employee?.name} (${employee?.email})`}>
                  {employee?.name}
                </div>
              : <NotFound />
          );
        },
        orderBy: 'assigned_to_id',
      },
      {
        name: text`due_date`,
        selector: ({ due_date }: Task) => formatDate(due_date),
        orderBy: 'due_date',
      },
      {
        name: text`status`,
        selector: (task: Task) => taskStatus(task),
        orderBy: 'status',
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
const TasksList = () => {
  const { text } = useLocalization();
  const tasks = use.tasks();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  const projects = use.projects();
  useGetListOnMount(tasks, employees, customers, projects, roles)
  const taskFormFields = useTaskFormFields();
  const taskColumns = useTaskColumns({ includeProject: true });
  const taskStatusText = useTaskStatusText();

  return (
    <Container className='container-list'>
      {(!tasks.list || !customers.list || !employees.list || !roles.record)? <SmallSpinner /> : 
        <FormModalProvider
          loading={tasks.create.isLoading || tasks.update.isLoading}
          initialState={{
            name: '',
            status: 'pending',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
          }}
          createModalTitle={text`create_new_task`}
          editModalTitle={text`edit_task`}
          formFields={taskFormFields}
          onCreate={(task, closeModal: () => void) => {
            tasks.create(task, { callback: () => closeModal()});
          }}
          onUpdate={(task, closeModal: () => void) => {
            tasks.update(task, { callback: () => closeModal()});
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
            filterColumn={[
              'title',
              'status',
              ({ assigned_to_id }: Task) => employees.record[assigned_to_id]?.name || '',
              ({ project_id }: Task) => projects.record[project_id]?.name || '',
              ({ status }: Task) => taskStatusText(status) || '',
            ]}
            columns={taskColumns}
            data={tasks.list}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default TasksList;