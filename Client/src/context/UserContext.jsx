import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8081/api/users");
    setUsers(res.data);
  };

  const addUser = async (user) => {
    const res = await axios.post("http://localhost:8081/api/users", user);
    setUsers([...users, res.data]);
  };

   

  const updateUser = async (id, updatedUser) => {
    const res = await axios.put(
      `http://localhost:8081/api/users/${id}`,
      updatedUser
    );
    setUsers(users.map((user) => (user._id === id ? res.data : user)));
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8081/api/users/${id}`);
    setUsers(users.filter((user) => user._id !== id));
  };

  useEffect(() => {
    // console.log(users);
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
