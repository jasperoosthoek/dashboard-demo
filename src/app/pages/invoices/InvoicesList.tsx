import { useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Invoice } from '../../stores/types';
import { use, onMove } from '../../stores/crudRegistry'
import { useInvoiceFormFields, useInvoiceColumns, useInvoiceStatusText } from './invoiceHooks';

const InvoiceList = () => {
  const { text } = useLocalization();
  const projects = use.projects();
  const customers = use.customers();
  const invoices = use.invoices();
  const invoiceFormFields = useInvoiceFormFields();
  const invoiceColumns = useInvoiceColumns({ filterStatus: true });
  const invoiceStatusText = useInvoiceStatusText()
  const { filterStatus } = invoices.state;
  useEffect(() => invoices.setState({ filterStatus: null }), [])

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
          onCreate={(invoice: Invoice, closeModal: () => void) => {
            invoices.create(invoice, { callback: closeModal});
          }}
          onUpdate={(invoice: Invoice, closeModal: () => void) => {
            invoices.update(invoice, { callback: closeModal});
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
            columns={invoiceColumns}
            data={invoices.list.filter(inv => filterStatus === null || inv.status === filterStatus)}
            onMove={onMove(invoices)}
          />
        </FormModalProvider>
      }
    </Container>
  );
};

export default InvoiceList;
