import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppSettingsProvider } from './context/app-settings-context';

export default function App() {
  return (
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  );
}
