import React, { useState } from 'react';
import { Link } from 'react-router';
import { addDays, format } from 'date-fns';
import { Table, Container, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormEditModalButton,
  FormModalProvider,
  useLocalization,
  FormTextArea,
  SmallSpinner,
  FormDropdown,
  type FormDropdownProps,
  FormDate,
  DeleteConfirmButton,
  useLocalStorage,
  DisabledProps,
} from '@jasperoosthoek/react-toolbox';
import { use, useGetListOnMount } from '../../stores/crudRegistry'
import NotFound from '../../components/NotFound';
import { type Invoice, type Project } from '../../stores/types';
import { formatCurrency, formatDate } from '../../localization/localization';

type FilterStatus = 'all' | Invoice['status']
export const useInvoiceStatusText = () => {
  const { text } = useLocalization(); 
  const invoiceStatusTexts = (
    {
      open: text`invoice_status_open`,
      paid: text`invoice_status_paid`,
    }
  )
  return (status: Invoice['status']) => invoiceStatusTexts[status] || '';
}

export const useInvoiceStatus = () => {
  const { text } = useLocalization(); 
  return (
    ({ status }: Invoice) => {
      switch (status) {
        case 'open': return <Badge bg='warning'>{text`invoice_status_open`}</Badge>
        case 'paid': return <Badge bg='success'>{text`invoice_status_paid`}</Badge>
        default: return status;
      }
    }
  );
}


export const  useInvoiceFormFields = ({ excludeProject }: { excludeProject?: boolean } = {}) => {
  const { text } = useLocalization();
  const projects = use.projects()
  const invoiceStatusText = useInvoiceStatusText();
  
  return {
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
            id: 'open',
            name: invoiceStatusText('open'),
          },
          {
            id: 'paid',
            name: invoiceStatusText('paid'),
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
    ...!excludeProject
      ? {
          project_id: {
            formProps: {
              list: projects.list?.sort((p1, p2) => p1.name > p2.name ? 1 : -1) || [],
              // Disable changing project when already saved i.e. project has an id
              disabled: ({ state: project }) => !!project.id,
            } as Partial<FormDropdownProps<Project>>,
            component: FormDropdown,
            label: text`project`,
            required: true,
          },
        }
      : {},
  };
}

export const useInvoiceColumns = ({ excludeProject }: { excludeProject?: boolean } = {}) => {
  const { text } = useLocalization();
  const invoices = use.invoices();
  const invoiceStatus = useInvoiceStatus();
  const invoiceStatusText = useInvoiceStatusText();
  const projects = use.projects();

  if (!invoices.list || !projects.record) {
    return [];
  }
  return (
    [
      {
        name: text`invoice_id`,
        selector: ({ id }: Invoice) => `#${id}`,
        orderBy: 'id',
      },
      ...!excludeProject ? [
        {
          name: text`project`,
          selector: ({ project_id }: Invoice) => {
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
        name: text`amount`,
        selector: ({ amount }: Invoice) => formatCurrency(amount),
        orderBy: 'amount',
      },
      {
        name: text`due_date`,
        selector: ({ due_date }: Invoice) => formatDate(due_date),
        orderBy: 'due_date',
      },
      {
        name: (
          <Form.Select
            size="sm"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation()
            }}
            className="w-auto"
            value={invoices.state.filterStatus}
            onChange={(e) => invoices.setState({ filterStatus: e.target.value as FilterStatus })}
          >
            <option value="all">{text`all`}</option>
            <option value="open">{invoiceStatusText('open')}</option>
            <option value="paid">{invoiceStatusText('paid')}</option>
          </Form.Select>
        ),
        selector: (invoice: Invoice) => invoiceStatus(invoice),
      },
      {
        name: text`actions`,
        selector: (invoice: Invoice) => (
          <>
            <FormEditModalButton
              state={invoice}
              title={text`edit_invoice`}
            />
            <DeleteConfirmButton
              loading={invoices.delete.isLoading && invoices.delete.id === invoice.id}
              modalTitle={text`delete_invoice${invoice.id}`}
              onDelete={() => {
                invoices.delete(invoice);
              }}
            />
          </>
        )
      }
    ]
  )
}

const InvoiceList = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const customers = use.customers();
  const invoices = use.invoices();
  useGetListOnMount(projects, customers, invoices)
  const invoiceFormFields = useInvoiceFormFields();
  const invoiceColumns = useInvoiceColumns();
  const invoiceStatusText = useInvoiceStatusText()
  const { filterStatus } = invoices.state;

  return (
    <Container className='container-list'>
      {(!invoices.list || !customers.list || !projects.record)? <SmallSpinner /> : 
        <FormModalProvider
          loading={invoices.create.isLoading || invoices.update.isLoading}
          initialState={{
            name: '',
            status: 'open',
            due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
          }}
          createModalTitle={text`create_new_invoice`}
          editModalTitle={text`edit_invoice`}
          formFields={invoiceFormFields}
          onCreate={(invoice, closeModal: () => void) => {
            invoices.create(invoice, { callback: () => closeModal()});
          }}
          onUpdate={(invoice, closeModal: () => void) => {
            invoices.update(invoice, { callback: () => closeModal()});
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
                  {text`create_new_invoice`}
                </FormCreateModalButton> 
              )
            }}
            filterColumn={[
              'id',
              'amount',
              ({ project_id }: Invoice) => projects.record[project_id]?.name || '',
              ({ status }: Invoice) => invoiceStatusText(status) || '',
            ]}
            columns={invoiceColumns}
            data={invoices.list.filter(inv => filterStatus === 'all' || inv.status === filterStatus)}
          />
        </FormModalProvider>
      }
    </Container>
  );
};

export default InvoiceList;
