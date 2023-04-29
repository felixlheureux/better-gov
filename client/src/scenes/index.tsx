import { MantineProvider } from "@mantine/core";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Saaq from "./saaq";

const Index = () => {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Saaq />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default Index;
