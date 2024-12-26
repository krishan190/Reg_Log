import React from "react";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { UserProvider } from "../context/UserContext";
import Layout from "../components/Layout/Layout";

const HomePage = () => (
  <Layout>
    <UserProvider>
      <UserForm />
      <UserTable />
    </UserProvider>
  </Layout>
);

export default HomePage;
