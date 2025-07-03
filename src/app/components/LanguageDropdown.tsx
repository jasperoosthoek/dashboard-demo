import { Dropdown } from 'react-bootstrap';
import { useLocalization, useLocalStorage } from '@jasperoosthoek/react-toolbox';
import { locales } from '../localization/localization';

const LanguageDropdown = () => {
  const { setLanguage, languages, text, textByLang } = useLocalization();
  // Get the base language from the browser's language setting
  // This will be used to set the default language if it is available in the locales
  const baseLanguage = navigator.language.split('-')[0];

  // Use localStorage to persist the selected language
  const [, setLang] = useLocalStorage('lang', !!locales[baseLanguage] ? baseLanguage : 'en');
  return (
    <Dropdown className='language-dropdown'>
      <Dropdown.Toggle variant="outline-primary">
        {text`language_full`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages
          .map((lang: string) => 
            <Dropdown.Item 
              onClick={() => {
                setLang(lang);
                setLanguage(lang);
              }}
              key={lang}
            >
              {textByLang(lang)`language_full`}
            </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
};

export default LanguageDropdown;