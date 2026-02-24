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

import type { Invoice, Project, InvoiceFilterStatus, MapStatus } from '../../stores/types';
import { use } from '../../stores/crudRegistry'
import { formatCurrency, useFormatDate } from '../../localization/localization';
import NotFound from '../../components/NotFound';

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
      component: (props: FormDropdownProps<MapStatus<Invoice['status']>>) => (
        <FormDropdown
          {...props}
          idKey='id'
          nameKey='name'
          list={[
            {
              id: 'open',
              name: invoiceStatusText('open'),
            },
            {
              id: 'paid',
              name: invoiceStatusText('paid'),
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
            required: true,
          },
        }
      : {},
  };
}

export type UseInvoiceColumnsProps = { excludeProject?: boolean; filterStatus?: boolean };

export const useInvoiceColumns = ({ excludeProject, filterStatus }: UseInvoiceColumnsProps = {}) => {
  const { text } = useLocalization();
  const invoices = use.invoices();
  const invoiceStatus = useInvoiceStatus();
  const invoiceStatusText = useInvoiceStatusText();
  const projects = use.projects();
  const formatDate = useFormatDate();

  if (!invoices.list || !projects.record) {
    return [];
  }

  return (
    [
      {
        name: text`invoice_id`,
        selector: ({ id }: Invoice) => `#${id}`,
        orderBy: 'id',
        search: 'id',
      },
      ...!excludeProject ? [
        {
          name: text`project`,
          selector: ({ project_id }: Invoice) => {
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
          search: ({ project_id }: Invoice) => projects.record && projects.record[project_id]?.name || '',
        }
      ] : [],
      {
        name: text`amount`,
        selector: ({ amount }: Invoice) => formatCurrency(amount),
        orderBy: 'amount',
        search: 'amount',
      },
      {
        name: text`due_date`,
        selector: ({ due_date }: Invoice) => formatDate(due_date),
        orderBy: 'due_date',
      },
      {
        name: 'status',
        selector: (invoice: Invoice) => invoiceStatus(invoice),
        orderBy: 'status',
        search: ({ status }: Invoice) => invoiceStatusText(status) || '',
        ...filterStatus ? (
          {
            optionsDropdown: {
              selected: invoices.state.filterStatus,
              onSelect: (status: string | null) => invoices.setState({ filterStatus: status as InvoiceFilterStatus }),
              options: {
                open: invoiceStatusText('open'),
                paid: invoiceStatusText('paid'),
              }
            },
          }
        ) : {},
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
