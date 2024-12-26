import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import SignIn from "./pages/Auth/signIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        {/* <Route path="/register" element={<SignIn />}></Route> */}
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
