import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/roles"
          element={<div>Roles page en construcción...</div>}
        />
      </Routes>
    </>
  );
};

export default App;
