import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppSettingsProvider } from "./context/app-settings-context";
import { PermissionProvider } from "./context/permission-context";

export default function App() {
  return (
    <AppSettingsProvider>
      <PermissionProvider>
        <RouterProvider router={router} />
      </PermissionProvider>
    </AppSettingsProvider>
  );
}
