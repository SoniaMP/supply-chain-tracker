import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";

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
