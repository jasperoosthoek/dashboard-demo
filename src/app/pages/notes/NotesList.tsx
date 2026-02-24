import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  FormEditModalButton,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Note } from '../../stores/types';
import { use, onMove } from '../../stores/crudRegistry'
import { useNoteFormFields, useNoteColumns, noteInitialState } from './noteHooks';

const NotesList = () => {
  const { text } = useLocalization();
  const notes = use.notes();
  const employees = use.employees();
  const customers = use.customers();
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
          onCreate={(note: Note, closeModal: () => void) => {
            notes.create(note, { callback: closeModal});
          }}
          onUpdate={(note: Note, closeModal: () => void) => {
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
            columns={noteColumns}
            data={notes.list}
            onMove={onMove(notes)}
          />
        </FormModalProvider>
      }
    </Container>
  );
}

export default NotesList;
