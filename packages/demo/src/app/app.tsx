
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { useEffect } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ToastContainer, toast } from 'react-toastify';
import { LocalizationProvider, useLocalization } from '@jasperoosthoek/react-toolbox';

import localization from './localization/localization';

import BrowserRouter from "./router";
import { setToastMessage } from './stores/crudRegistry';

const SetToastMessageOnChangeLanguage = () => {
  const { lang, text } = useLocalization()
  useEffect(() => {
    setToastMessage(text`on_error`)
  }, [lang, !!text])
  return null;
}
export function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider localization={localization}>
        <BrowserRouter />
        <SetToastMessageOnChangeLanguage />
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
      </LocalizationProvider>
    </DndProvider>
  );
}

export default App;
