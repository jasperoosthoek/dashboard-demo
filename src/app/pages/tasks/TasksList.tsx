import { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Task, TaskFilterStatus } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import { useTaskFormFields, useTaskColumns, taskInitialState } from './taskHooks';

const TasksList = () => {
  const { text } = useLocalization();
  const tasks = r.tasks.useList();
  const createTask = r.tasks.useCreate();
  const updateTask = r.tasks.useUpdate();
  const moveTask = r.tasks.useMove();
  const employees = r.employees.useList();
  const customers = r.customers.useList();
  const roles = r.roles.useList();
  const taskFormFields = useTaskFormFields();
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>(null);
  const taskColumns = useTaskColumns({ filterStatus, onFilterStatusChange: setFilterStatus });

  return (
    <Container className='container-list'>
      {(!tasks.data || !customers.data || !employees.data || !roles.data)? <SmallSpinner /> :
        <FormModalProvider
          loading={createTask.isPending || updateTask.isPending}
          initialState={taskInitialState}
          createModalTitle={text`create_new_task`}
          editModalTitle={text`edit_task`}
          formFields={taskFormFields}
          onCreate={(task: Task, closeModal: () => void) => {
            createTask.mutate(task, { onSuccess: closeModal });
          }}
          onUpdate={(task: Task, closeModal: () => void) => {
            updateTask.mutate(task, { onSuccess: closeModal });
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
            data={tasks.data.filter(task => filterStatus === null || task.status === filterStatus)}
            onMove={onMove(moveTask)}
          />
        </FormModalProvider>
      }

    </Container>
  )
}

export default TasksList;
