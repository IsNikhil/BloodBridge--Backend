import { AppRoutes } from "./routes/config";
import { AuthProvider } from "./authentication/use-auth";
import { Footer } from "./components/Footer/Footer";
import { ScrollToTop } from "./components/ScrollToTop";


import {
  MantineProvider,
  Container,
  createTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import { MantineEmotionProvider } from "@mantine/emotion";

const theme = createTheme({});

//This is almost the base level of your app.  You can also put global things here.
function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <MantineEmotionProvider>
        <Notifications position="top-right" autoClose={3000} limit={5} />

        <div style={{ 
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}>
          <AuthProvider>
            <div style={{ flex: 1 }}>
              <AppRoutes />
            </div>

            <Footer />
          </AuthProvider>
        </div>

      </MantineEmotionProvider>
    </MantineProvider>
  );
}

export default App;
