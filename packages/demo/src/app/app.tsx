
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider, useLocalization } from '@jasperoosthoek/react-toolbox';

import localization from './localization/localization';
import Dashboard from './components/Dashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import NoMatchPage from './pages/NoMatchPage';
import { setToastMessage } from './stores/crudRegistry';

const SetToastMessageOnChangeLanguage = () => {
  const { lang, text } = useLocalization()
  useEffect(() => {
    console.log(text`on_error`);
    setToastMessage(text`on_error`)
  }, [lang, !!text])
  return null;
}
export function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider localization={localization}>
        <SetToastMessageOnChangeLanguage />
        {/* <ToastContainer hideProgressBar={true} newestOnTop={true} /> */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            >
              <Route
                index
                element={<DashboardPage />}
              />
              <Route
                path="datatable"
                element={<UsersPage />}
              />
            </Route>            
            <Route path="*"
              element={<NoMatchPage />}
            />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </DndProvider>
  );
}

export default App;
