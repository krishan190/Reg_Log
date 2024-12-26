import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { userReducer } from "../reducers/userReducer";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, dispatch] = useReducer(userReducer, []);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/api/users");
    dispatch({ type: "FETCH_USERS", payload: res.data });
  };

  // Add a new user
  const addUser = async (user) => {
    const res = await axios.post("http://localhost:8080/api/users", user);
    dispatch({ type: "ADD_USER", payload: res.data });
  };

  // Update a user
  const updateUser = async (id, updatedUser) => {
    const res = await axios.put(
      `http://localhost:8080/api/users/${id}`,
      updatedUser
    );
    dispatch({ type: "UPDATE_USER", payload: res.data });
  };

  // Delete a user
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8080/api/users/${id}`);
    dispatch({ type: "DELETE_USER", payload: id });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
