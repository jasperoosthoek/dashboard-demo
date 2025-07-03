import React, { useState } from 'react';
import { Link } from 'react-router';
import { addDays, format } from 'date-fns';
import {
  Container, Row, Col, Card, Button, Form, Table, Modal, Badge
} from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  FormDate,
  FormEditModalButton,
  useLocalization,
  DeleteConfirmButton,
  FormDropdown,
  FormTextArea,
  type FormInputProps,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import { formatCurrency, useFormatDate } from '../../localization/localization';
import { Note, Customer, Employee, Role } from '../../stores/types';
import { use, useGetListOnMount, onMove } from '../../stores/crudRegistry'
import NotFound from '../../components/NotFound';
import { useEmployeeFormList } from '../employees/EmployeesList';


export const  useNoteFormFields = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {
  const { text } = useLocalization();
  const customers = use.customers()
  const employeeList = useEmployeeFormList();
  
  if (!customers.list || (excludeEmployee && !employeeList)) return [];

  return {
    content: {
      label: text`content`,
      component: FormTextArea,
      formProps: {
        rows: 5,
      } as FormInputProps,
    },
    ...!excludeEmployee ? (
      {
        employee_id: {
          formProps: {
            list: employeeList,
          },
          component: FormDropdown,
          label: text`employee`,
        },
      }
     ) : {},
    customer_id: {
      formProps: {
        list: customers.list?.sort((c1, c2) => c1.name > c2.name ? 1 : -1) || [],
      },
      component: FormDropdown,
      label: text`customer`,
      required: true,
    },
  };
}

export const useNoteColumns = ({ excludeEmployee }: { excludeEmployee?: boolean } = {}) => {
  const { text } = useLocalization();
  const notes = use.notes();
  const employees = use.employees();
  const customers = use.customers();
  const formatDate = useFormatDate();

  if (!customers.record || !notes.list || !employees.record) {
    return [];
  }
  return (
    [
      {
        name: text`content`,
        selector: ({ content }: Note) => content,
        orderBy: 'content',
      },
      ...!excludeEmployee ? [
        {
          name: text`employee`,
          selector: ({ employee_id }: Note) => {
            const employee = employees.record[employee_id];
            return (
              employee
                ? <Link to={`/employees/${employee.id}`}>
                    {employee.name}
                  </Link>
                : <NotFound />
            );
          },
          orderBy: 'employee_id',
        }
      ] : [],
      {
        name: text`customer`,
        selector: ({ customer_id }: Note) => {
          const customer = customers.record[customer_id];
          return (
            customer
              ? customer.name
              : <NotFound />
          );
        },
        orderBy: 'customer_id',
      },
      {
        name: text`created_at`,
        selector: ({ created_at }: Note) => formatDate(created_at),
        orderBy: 'created_at',
      },
      {
        name: text`actions`,
        selector: (note: Note) => (
          <>
            <FormEditModalButton
              state={note}
              title={text`edit_note`}
            />
            <DeleteConfirmButton
              loading={notes.delete.isLoading && notes.delete.id === note.id}
              modalTitle={text`delete_note${note.id}`}
              onDelete={() => {
                notes.delete(note);
              }}
            />
          </>
        )
      }
    ]
  )
}

export const noteInitialState = (
  {
    name: '',
    status: 'open',
    due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
  }
) as Partial<Note>

const NotesList = () => {
  const { text } = useLocalization();
  const notes = use.notes();
  const employees = use.employees();
  const customers = use.customers();
  const roles = use.roles();
  useGetListOnMount(notes,employees, customers, roles)
  const noteFormFields = useNoteFormFields();
  const noteColumns = useNoteColumns();

  return (
    <Container className='container-list'>
      {(!notes.list || !employees.list || !customers.list) ? <SmallSpinner /> :
        <FormModalProvider
          loading={notes.create.isLoading || notes.update.isLoading}
          initialState={noteInitialState}
          createModalTitle={text`create_new_note`}
          editModalTitle={text`edit_note`}
          formFields={noteFormFields}
          onCreate={(note, closeModal: () => void) => {
            notes.create(note, { callback: closeModal});
          }}
          onUpdate={(note, closeModal: () => void) => {
            notes.update(note, { callback: closeModal});
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
                  {text`create_new_note`}
                </FormCreateModalButton> 
              )
            }}
            filterColumn={[
              'content',
              ({ employee_id }: Note) => employees.record[employee_id]?.name || '',
              ({ customer_id }: Note) => customers.record[customer_id]?.name || '',
            ]}
            columns={noteColumns}
            data={notes.list} //.filter(inv => filterStatus === null || inv.status === filterStatus)}
            onMove={onMove(notes)}
          />
        </FormModalProvider>
      }
    </Container>
  );
}

export default NotesList;