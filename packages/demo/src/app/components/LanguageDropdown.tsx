import { Dropdown } from 'react-bootstrap';
import { useLocalization, useLocalStorage} from '@jasperoosthoek/react-toolbox';

const LanguageDropdown = () => {
  const { setLanguage, languages, text, textByLang } = useLocalization();

  const [, setLang] = useLocalStorage('lang', 'en');
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