import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Invoice, InvoiceFilterStatus } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import { useInvoiceFormFields, useInvoiceColumns } from './invoiceHooks';

const InvoiceList = () => {
  const { text } = useLocalization();
  const projects = r.projects.useList();
  const customers = r.customers.useList();
  const invoices = r.invoices.useList();
  const createInvoice = r.invoices.useCreate();
  const updateInvoice = r.invoices.useUpdate();
  const moveInvoice = r.invoices.useMove();
  const invoiceFormFields = useInvoiceFormFields();
  const [filterStatus, setFilterStatus] = useState<InvoiceFilterStatus>(null);
  const invoiceColumns = useInvoiceColumns({ filterStatus, onFilterStatusChange: setFilterStatus });

  return (
    <Container className='container-list'>
      {(!invoices.data || !customers.data || !projects.data)? <SmallSpinner /> :
        <FormModalProvider
          loading={createInvoice.isPending || updateInvoice.isPending}
          initialState={{
            name: '',
            status: 'open',
            due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
          }}
          createModalTitle={text`create_new_invoice`}
          editModalTitle={text`edit_invoice`}
          formFields={invoiceFormFields}
          onCreate={(invoice: Invoice, closeModal: () => void) => {
            createInvoice.mutate(invoice, { onSuccess: closeModal });
          }}
          onUpdate={(invoice: Invoice, closeModal: () => void) => {
            updateInvoice.mutate(invoice, { onSuccess: closeModal });
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
            data={invoices.data.filter(inv => filterStatus === null || inv.status === filterStatus)}
            onMove={onMove(moveInvoice)}
          />
        </FormModalProvider>
      }
    </Container>
  );
};

export default InvoiceList;
