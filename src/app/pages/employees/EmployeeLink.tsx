import { Link } from 'react-router';
import type { Employee, Role } from '../../stores/types';

// Takes the resolved role as a prop rather than fetching its own copy -
// this renders once per table row, and an independent useList() call here
// would mount a fresh query observer per row (see EmployeeLink usage in
// projectHooks.tsx / taskHooks.tsx for the shared roles list it reads from).
const EmployeeLink = ({ employee, role }: { employee: Employee; role?: Role }) => (
  <Link
    to={`/employees/${employee.id}`}
    title={`${employee.name} (${role?.name})`}
  >
    {employee.name}
  </Link>
);

export default EmployeeLink;
