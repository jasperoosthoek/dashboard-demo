import { AdditionalLocalization, combineLocalization, useLocalization } from '@jasperoosthoek/react-toolbox';
import { format, Locale, parse } from 'date-fns';
import { enGB, nl, fr } from 'date-fns/locale';

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

      amount: 'Bedrag',
      customer: 'Klant',
      employee: 'Medewerker',
      start_date: 'Startdatum',
      end_date: 'Einddatum',

      link_projects: 'Projecten',
      create_new_project: 'Nieuw project aanmaken',
      edit_project: 'Project bewerken?',
      delete_project: (name) => `Project "${name}" verwijderen?`,
      status: 'Status',
      project_status_pending: 'In afwachting',
      project_status_in_progress: 'Bezig',
      project_status_completed: 'Voltooid',

      budget: 'Budget',
      project_info: 'Projectinformatie',
      linked_tasks: 'Gekoppelde taken',
      linked_invoices: 'Gekoppelde facturen',
      customer_info: 'Klantinformatie',
      title: 'Titel',
      due_date: 'Vervaldatum',
      invoice_id: 'Factuurnummer',
      company: 'Bedrijf',
      contact: 'Contactpersoon',
      email: 'E-mail',
      invoice_status_paid: 'Betaald',

      link_tasks: 'Taken',
      task_status_todo: 'Te doen',
      task_status_in_progress: 'Bezig',
      task_status_done: 'Gedaan',

      link_quotations: 'Offertes',
      link_notes: 'Notities',
    },
    en: {
      not_found: 'Not found',
      page_not_found: 'Page cannot be found.',
      language_full: "English",
      link_employees: 'Employees',
      link_roles: 'Roles',
      on_error: 'Something went wrong',

      create_new_employee: 'Create new employee',
      edit_employee: 'Edit employee',
      delete_employee: (name) => `Delete employee "${name}"?`,
      name: 'Name',
      role: 'Role',
      email_address: 'Email address',
      actions: 'Actions',
      error_email_requires_at: 'Email address should contain at least one @',

      create_new_role: 'Create new role',
      edit_role: 'Edit role',
      delete_role: (name) => `Delete role "${name}"?`,

      amount: 'Amount',
      customer: 'Customer',
      employee: 'Employee',
      start_date: 'Start date',
      end_date: 'End date',

      link_projects: 'Projects',
      create_new_project: 'Create new project',
      edit_project: 'Edit project?',
      delete_project: (name) => `Delete project "${name}"?`,
      status: 'Status',
      project_status_pending: 'Pending',
      project_status_in_progress: 'In progress',
      project_status_completed: 'Completed',

      budget: 'Budget',
      project_info: 'Project info',
      linked_tasks: 'Linked tasks',
      linked_invoices: 'Linked invoices',
      customer_info: 'Customer info',
      title: 'Title',
      due_date: 'Due date',
      invoice_id: 'Invoice number',
      company: 'Company',
      contact: 'Contact',
      email: 'Email',
      invoice_status_paid: 'Paid',

      link_tasks: 'Tasks',
      task_status_todo: 'To do',
      task_status_in_progress: 'In progress',
      task_status_done: 'Done',

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

      amount: 'Montant',
      customer: 'Client',
      employee: 'Employé',
      start_date: 'Date de début',
      end_date: 'Date de fin',

      link_projects: 'Projets',
      create_new_project: 'Créer un nouveau projet',
      edit_project: 'Modifier le projet?',
      delete_project: (name) => `Supprimer le projet "${name}" ?`,
      status: 'Statut',
      project_status_pending: 'En attente',
      project_status_in_progress: 'En cours',
      project_status_completed: 'Terminé',

      budget: 'Budget',
      project_info: 'Infos projet',
      linked_tasks: 'Tâches liées',
      linked_invoices: 'Factures liées',
      customer_info: 'Infos client',
      title: 'Titre',
      due_date: 'Date d\'échéance',
      invoice_id: 'Numéro de facture',
      company: 'Entreprise',
      contact: 'Contact',
      email: 'Email',
      invoice_status_paid: 'Payée',

      link_tasks: 'Tâches',
      task_status_todo: 'À faire',
      task_status_in_progress: 'En cours',
      task_status_done: 'Terminé',

      link_quotations: 'Devis',
      link_notes: 'Notes',
    }
  }
) as AdditionalLocalization;

export default localization;

export const locales = {
  en: enGB,
  nl: nl,
  fr: fr,
} as Record<string, Locale>;

export const formatDate = (date: string, formatString: string = 'PP') => {
  const { lang } = useLocalization();
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
  return  format(
    parsedDate,
    formatString,
    { locale: (locales[lang] || enGB) as Locale }
  )
};

export const formatCurrency = (number: number) => {
  return `€ ${number.toLocaleString()}`;
  const sign = Math.sign(number);
  // Convert the number to a string and remove sign
  const numStr = (number * sign).toString();

  // Check for the presence of a decimal part
  const [integer, decimal] = numStr.split(".");

  // Reverse the integer part to facilitate the insertion of dots
  const reversed = integer.split("").reverse().join("");

  // Insert a dot every three characters
  const withDots = reversed.match(/.{1,3}/g)?.join(".");

  // Reverse it back to normal
  const formatted = withDots?.split("").reverse().join("");

  // Add euro sign and reattach the decimal part if it exists and minus sign
  return `€ ${sign === -1 ? '-' : ''}${formatted}${decimal ? `.${decimal}` : ''}`;
}