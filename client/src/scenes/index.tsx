import { AppShell, MantineProvider } from "@mantine/core";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Saaq from "./saaq";

const Index = () => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}>
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
            padding: 0,
          },
        })}>
        <Router>
          <Routes>
            <Route path="/" element={<Saaq />} />
          </Routes>
        </Router>
      </AppShell>
    </MantineProvider>
  );
};

export default Index;
