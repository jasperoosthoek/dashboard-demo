import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalStorage,
  DeleteConfirmButton,
  ConfirmButton,
  ResetButton,
} from '@jasperoosthoek/react-toolbox';
import { use } from '../../stores/crudRegistry'

const DashboardPage = () => {
  const employees = use.employees();
  const customers = use.customers();
  useEffect(() => {
    employees.getList();
    customers.getList();
  }, []);
  
  const CreateUserButton = () => <FormCreateModalButton title='Create new user'/>
  return (
    <Container className='container-list'>
        Dashboard
    </Container>
  );
}

export default DashboardPage
