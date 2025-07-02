import { Link } from 'react-router';
import { Employee } from '../../stores/types';
import { use } from '../../stores/crudRegistry'


const EmployeeLink = ({ employee }: { employee: Employee }) => {
  const roles = use.roles();
  return (
    <Link
      to={`/employees/${employee.id}`}
      title={`${employee.name} (${roles.record[employee.role_id]?.name})`}
    >
      {employee.name}
    </Link>
  )
}

export default EmployeeLink;