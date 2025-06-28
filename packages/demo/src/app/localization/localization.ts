import { AdditionalLocalization, combineLocalization } from '@jasperoosthoek/react-toolbox';


const localization = combineLocalization(
  {
    nl: {
      not_found: 'Niet gevonden',
      page_not_found: 'Pagina kan niet worden gevonden.',
      language_full: "Nederlands",
      link_employees: 'Medewerkers',
      link_roles: 'Rollen',
      on_error: 'Er is iets fout gegaan',

      create_new_employee: 'Nieuwe medewerker aanmaken',
      edit_employee: 'Medewerker bewerken',
      delete_employee: (name) => `Medewerker "${name}" verwijderen?`,
      name: 'Naam',
      role: 'Rol',
      email_address: 'E-mailadres',
      actions: 'Acties',
      error_email_requires_at: 'E-mailadres moet minstens één @ bevatten',

      create_new_role: 'Nieuwe rol aanmaken',
      edit_role: 'Rol bewerken',
      delete_role: (name) => `Rol "${name}" verwijderen?`,
    },
    en: {
      not_found: 'Not found',
      page_not_found: 'Page cannot be found.',

      amount: 'Amount',
      customer: 'Customer',
      employeer: 'Employeer',
      start_date: 'Start date',
      end_date: 'End date',

      language_full: "English",
      link_employees: 'Employees',
      link_roles: 'Roles',
      on_error: 'Something went wrong',

      create_new_employee: 'Create new employee',
      edit_employee: 'Edit employee?',
      delete_employee: (name) => `Delete employee "${name}"?`,
      name: 'Name',
      role: 'Role',
      email_address: 'Email address',
      actions: 'Actions',
      error_email_requires_at: 'Email address should contain at least one @',

      create_new_role: 'Create new role',
      edit_role: 'Edit role',
      delete_role: (name) => `Delete role "${name}"?`,

      link_projects: 'Projects',
      create_new_project: 'Create new project',
      edit_project: 'Edit project?',
      delete_project: (name) => `Delete project "${name}"?`,
      status: 'Status',
      project_status_pending: 'Pending',
      project_status_in_progress: 'In Progress',
      project_status_completed: 'Completed',

      link_tasks: 'Tasks',
      link_quotations: 'Quotations',
      link_notes: 'Notes',
    },
    fr: {
      not_found: 'Non trouvé',
      page_not_found: 'Page introuvable.',
      language_full: "Français",
      link_employees: 'Employés',
      link_roles: 'Rôles',
      on_error: 'Une erreur s\'est produite',

      create_new_employee: 'Créer un nouvel employé',
      edit_employee: 'Modifier l\'employé',
      delete_employee: (name) => `Supprimer l'employé "${name}" ?`,
      name: 'Nom',
      role: 'Rôle',
      email_address: 'Adresse e-mail',
      actions: 'Actions',
      error_email_requires_at: 'L\'adresse e-mail doit contenir au moins un @',

      create_new_role: 'Créer un nouveau rôle',
      edit_role: 'Modifier le rôle',
      delete_role: (name) => `Supprimer le rôle "${name}" ?`,
    }
  }
) as AdditionalLocalization;

export default localization;