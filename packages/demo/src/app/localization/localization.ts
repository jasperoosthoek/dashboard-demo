import { AdditionalLocalization, combineLocalization } from '@jasperoosthoek/react-toolbox';


const localization = combineLocalization(
  {
    nl: {
      not_found: 'Niet gevonden',
      page_not_found: 'Pagina kan niet worden gevonden.',
      language_full: "Nederlands",
      link_datatable: 'Datatabellen',
      link_form: 'Formulieren',
      on_error: 'Er is iets fout gegaan',

      create_new_user: 'Nieuwe gebruiker aanmaken',
      edit_user: 'Gebruiker bewerken',
      delete_user: (name) => `Gebruiker "${name}" verwijderen?`,
      name: 'Naam',
      role: 'Rol',
      email_address: 'E-mailadres',
      actions: 'Acties',
      error_email_requires_at: 'E-mailadres moet minstens één @ bevatten',
    },
    en: {
      not_found: 'Not found',
      page_not_found: 'Page cannot be found.',
      language_full: "English",
      link_datatable: 'Data tabels',
      link_form: 'Forms',
      on_error: 'Something went wrong',

      create_new_user: 'Create new user',
      edit_user: 'Edit user',
      delete_user: (name) => `Delete user "${name}"?`,
      name: 'Name',
      role: 'Role',
      email_address: 'Email address',
      actions: 'Actions',
      error_email_requires_at: 'Email address should contain at least one @',
    },
    fr: {
      not_found: 'Non trouvé',
      page_not_found: 'Page introuvable.',
      language_full: "Français",
      link_datatable: 'Tableaux de données',
      link_form: 'Formulaires',
      on_error: 'Une erreur s\'est produite',

      create_new_user: 'Créer un nouvel utilisateur',
      edit_user: 'Modifier l\'utilisateur',
      delete_user: (name) => `Supprimer l'utilisateur "${name}" ?`,
      name: 'Nom',
      role: 'Rôle',
      email_address: 'Adresse e-mail',
      actions: 'Actions',
      error_email_requires_at: 'L\'adresse e-mail doit contenir au moins un @',
    }
  }
) as AdditionalLocalization;

export default localization;