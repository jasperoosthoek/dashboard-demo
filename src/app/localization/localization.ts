import { combineLocalization, useLocalization, type AdditionalLocalization } from '@jasperoosthoek/react-toolbox';
import { format, parse, type Locale } from 'date-fns';
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
      unhandled_error: 'Er heeft zich een onverwacht probleem voorgedaan en de gegevens zijn gereset.',
      
      invoice_amounts: 'Factuurbedragen',
      dashboard: 'Dashboard',
      active_projects: 'Lopende projecten:',
      outstanding_invoices: 'Openstaande facturen:',
      overdue_tasks: 'Overdue taken:',
      active_employees: 'Actieve medewerkers:',
      project_status: 'Projectstatus',
      invoice_amounts_per_month: 'Factuurbedragen per maand',
      latest_projects: 'Laatste projecten',
      latest_notes: 'Laatste notities',

      create_new_employee: 'Nieuwe medewerker aanmaken',
      edit_employee: 'Medewerker bewerken',
      delete_employee: (name) => `Medewerker "${name}" verwijderen?`,
      name: 'Naam',
      role: 'Rol',
      email_address: 'E-mailadres',
      actions: 'Acties',
      error_email_requires_at: 'E-mailadres moet minstens één @ bevatten',
      employee_info: 'Medewerkerinformatie',

      create_new_role: 'Nieuwe rol aanmaken',
      edit_role: 'Rol bewerken',
      delete_role: (name) => `Rol "${name}" verwijderen?`,

      amount: 'Bedrag',
      customer: 'Klant',
      employee: 'Medewerker',
      start_date: 'Startdatum',
      end_date: 'Einddatum',

      projects: 'Projecten',
      create_new_project: 'Nieuw project aanmaken',
      edit_project: 'Project bewerken?',
      delete_project: (name) => `Project "${name}" verwijderen?`,
      status: 'Status',
      project_status_pending: 'In afwachting',
      project_status_in_progress: 'Bezig',
      project_status_completed: 'Voltooid',
      project: 'Project',
      
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
      description: 'Beschrijving',
      invoice_status_open: 'Open',
      invoice_status_paid: 'Betaald',
      all: 'Alles',
      all_customers: 'Alle klanten',

      tasks: 'Taken',
      task_status_todo: 'Te doen',
      task_status_in_progress: 'Bezig',
      task_status_done: 'Gedaan',
      create_new_task: 'Nieuwe taak aanmaken',
      edit_task: 'Taak bewerken',
      delete_task: (title) => `Taak "${title}" verwijderen?`,
      created_at: 'Aangemaakt op',
      assigned_to_employee: 'Toegewezen aan',

      invoices: 'Facturen',
      create_new_invoice: 'Nieuwe factuur aanmaken',
      edit_invoice: 'Factuur bewerken',
      delete_invoice: (id) => `Factuur #${id} verwijderen?`,

      notes: 'Notities',
      content: 'Inhoud',
      create_new_note: 'Nieuwe notitie aanmaken',
      edit_note: 'Notitie bewerken',
      delete_note: 'Notitie verwijderen?',
    },
    en: {
      not_found: 'Not found',
      page_not_found: 'Page cannot be found.',
      language_full: "English",
      link_employees: 'Employees',
      link_roles: 'Roles',
      on_error: 'Something went wrong',
      unhandled_error: 'An unexpected problem occurred and the data was reset.',
      
      invoice_amounts: 'Invoice Amounts',
      dashboard: 'Dashboard',
      active_projects: 'Active projects:',
      outstanding_invoices: 'Outstanding invoices:',
      overdue_tasks: 'Overdue tasks:',
      active_employees: 'Active employees:',
      project_status: 'Project Status',
      invoice_amounts_per_month: 'Invoice Amounts per Month',
      latest_projects: 'Latest projects',
      latest_notes: 'Latest notes',

      create_new_employee: 'Create new employee',
      edit_employee: 'Edit employee',
      delete_employee: (name) => `Delete employee "${name}"?`,
      name: 'Name',
      role: 'Role',
      email_address: 'Email address',
      actions: 'Actions',
      error_email_requires_at: 'Email address should contain at least one @',
      employee_info: 'Employee info',

      create_new_role: 'Create new role',
      edit_role: 'Edit role',
      delete_role: (name) => `Delete role "${name}"?`,

      amount: 'Amount',
      customer: 'Customer',
      employee: 'Employee',
      start_date: 'Start date',
      end_date: 'End date',

      projects: 'Projects',
      create_new_project: 'Create new project',
      edit_project: 'Edit project?',
      delete_project: (name) => `Delete project "${name}"?`,
      status: 'Status',
      project_status_pending: 'Pending',
      project_status_in_progress: 'In progress',
      project_status_completed: 'Completed',
      project: 'Project',

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
      description: 'Description',
      invoice_status_open: 'Open',
      invoice_status_paid: 'Paid',
      all: 'All',
      all_customers: 'All customers',

      tasks: 'Tasks',
      task_status_todo: 'To do',
      task_status_in_progress: 'In progress',
      task_status_done: 'Done',
      create_new_task: 'Create new task',
      edit_task: 'Edit task',
      delete_task: (title) => `Delete task "${title}"?`,
      assigned_to_employee: 'Assigned to employee',
      created_at: 'Created at',

      invoices: 'Invoices',
      create_new_invoice: 'Create new invoice',
      edit_invoice: 'Edit invoice',
      delete_invoice: (id) => `Delete invoice #${id}?`,

      notes: 'Notes',
      content: 'Content',
      create_new_note: 'Create new note',
      edit_note: 'Edit note',
      delete_note: 'Delete note?',
    },
    fr: {
      not_found: 'Non trouvé',
      page_not_found: 'Page introuvable.',
      language_full: "Français",
      link_employees: 'Employés',
      link_roles: 'Rôles',
      on_error: 'Une erreur s\'est produite',
      unhandled_error: "Un problème inattendu s'est produit, les données sont réinitialisées.",

      invoice_amounts: 'Montants des factures',
      dashboard: 'Tableau de bord',
      active_projects: 'Projets en cours :',
      outstanding_invoices: 'Factures en attente :',
      overdue_tasks: 'Tâches en retard :',
      active_employees: 'Employés actifs :',
      project_status: 'Statut du projet',
      invoice_amounts_per_month: 'Montants des factures par mois',
      latest_projects: 'Derniers projets',
      latest_notes: 'Dernières notes',
      
      create_new_employee: 'Créer un nouvel employé',
      edit_employee: 'Modifier l\'employé',
      delete_employee: (name) => `Supprimer l'employé "${name}" ?`,
      name: 'Nom',
      role: 'Rôle',
      email_address: 'Adresse e-mail',
      actions: 'Actions',
      error_email_requires_at: 'L\'adresse e-mail doit contenir au moins un @',
      employee_info: 'Informations sur l’employé',

      create_new_role: 'Créer un nouveau rôle',
      edit_role: 'Modifier le rôle',
      delete_role: (name) => `Supprimer le rôle "${name}" ?`,

      amount: 'Montant',
      customer: 'Client',
      employee: 'Employé',
      start_date: 'Date de début',
      end_date: 'Date de fin',

      projects: 'Projets',
      create_new_project: 'Créer un nouveau projet',
      edit_project: 'Modifier le projet?',
      delete_project: (name) => `Supprimer le projet "${name}" ?`,
      status: 'Statut',
      project_status_pending: 'En attente',
      project_status_in_progress: 'En cours',
      project_status_completed: 'Terminé',
      project: 'Projet',

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
      description: 'Description',
      invoice_status_open: 'Ouverte',
      invoice_status_paid: 'Payée',
      all: 'Tous',
      all_customers: 'Tous les clients',

      tasks: 'Tâches',
      task_status_todo: 'À faire',
      task_status_in_progress: 'En cours',
      task_status_done: 'Terminé',
      create_new_task: 'Créer une nouvelle tâche',
      edit_task: 'Modifier la tâche',
      delete_task: (title) => `Supprimer la tâche "${title}" ?`,
      assigned_to_employee: 'Assigné à un employé',
      created_at: 'Créé à',

      invoices: 'Factures',
      create_new_invoice: 'Créer une nouvelle facture',
      edit_invoice: 'Modifier la facture',
      delete_invoice: (id) => `Supprimer la facture n°${id} ?`,

      notes: 'Notes',
      content: 'Contenu',
      create_new_note: 'Créer une nouvelle note',
      edit_note: 'Modifier la note',
      delete_note: 'Supprimer la note ?',
    }
  }
) as AdditionalLocalization;

export default localization;

export const locales = {
  en: enGB,
  nl: nl,
  fr: fr,
} as Record<string, Locale>;

export const useFormatDate = () => {
  const { lang } = useLocalization();
  return (
    (date: string, formatString: string = 'PP') => {
  
      try {
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return  format(
          parsedDate,
          formatString,
          { locale: (locales[lang] || enGB) as Locale }
        )
      } catch (error) {
        console.error('Error formatting currency:', error);
        return `Invalid timestamp: ${date}`;
      }
    }
  );
}

export const formatCurrency = (number: number | string) => {
  // For simplicity, ignore errors in formatting as this is normally handled by validation in the database.
  const n = Number(number);
  return `€ ${Number.isNaN(n) ? number : n.toLocaleString()}`;
}
