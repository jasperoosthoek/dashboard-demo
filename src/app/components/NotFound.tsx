import { useLocalization } from '@jasperoosthoek/react-toolbox';

const NotFound = () => {
  const { text } = useLocalization();
  return (
    <i>{text`not_found`}</i>
  );
}

export default NotFound;