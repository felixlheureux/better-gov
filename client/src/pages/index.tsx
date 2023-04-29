import Index from "@/scenes";
import { useEffect, useState } from "react";

const App = () => {
  const [server, setServer] = useState(true);

  useEffect(() => {
    setServer(false);
  }, []);

  if (server || typeof window === "undefined") {
    return null;
  }

  return <Index />;
};

App.configs = {
  title: "A Better Gov Service",
  desc: "Simply a better way to manage your government services.",
};

export default App;
