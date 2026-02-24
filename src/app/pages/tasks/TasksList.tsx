import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Task } from '../../stores/types';
import { use, onMove } from '../../stores/crudRegistry'
import { useTaskFormFields, useTaskColumns, useTaskStatusText, taskInitialState } from './taskHooks';

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
