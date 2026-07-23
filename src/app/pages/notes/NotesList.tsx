import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';

import type { Note } from '../../stores/types';
import { r } from '../../resources';
import { onMove } from '../../resources/move';
import { useNoteFormFields, useNoteColumns, noteInitialState } from './noteHooks';

const NotesList = () => {
  const { text } = useLocalization();
  const notes = r.notes.useList();
  const createNote = r.notes.useCreate();
  const updateNote = r.notes.useUpdate();
  const moveNote = r.notes.useMove();
  const employees = r.employees.useList();
  const customers = r.customers.useList();
  const noteFormFields = useNoteFormFields();
  const noteColumns = useNoteColumns();

  return (
    <Container className='container-list'>
      {(!notes.data || !employees.data || !customers.data) ? <SmallSpinner /> :
        <FormModalProvider
          loading={createNote.isPending || updateNote.isPending}
          initialState={noteInitialState}
          createModalTitle={text`create_new_note`}
          editModalTitle={text`edit_note`}
          formFields={noteFormFields}
          onCreate={(note: Note, closeModal: () => void) => {
            createNote.mutate(note, { onSuccess: closeModal });
          }}
          onUpdate={(note: Note, closeModal: () => void) => {
            updateNote.mutate(note, { onSuccess: closeModal });
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
            data={notes.data}
            onMove={onMove(moveNote)}
          />
        </FormModalProvider>
      }
    </Container>
  );
}

export default NotesList;
