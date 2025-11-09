import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import "./index.css";
import App from "./App";
import { ToastWrapper } from "./components/ui/Toaster";
import { ThemeProvider } from "./components/layout/ThemeProvider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
          <ToastWrapper />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
