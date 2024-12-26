import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const UserTable1 = () => {
  const { users, deleteUser, updateUser } = useUserContext();
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [editingUser, setEditingUser] = useState({
    name: "",
    email: "",
    address: "",
  }); // To track the user being edited

  // Open the modal and populate the form with user data
  const handleEdit = (user) => {
    setEditingUser(user); // Set the user to edit
    setShowModal(true); // Open the modal
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value }); // Update the editing user data
  };

  // Handle Update submission
  const handleUpdate = async () => {
    await updateUser(editingUser._id, editingUser); // Call the updateUser function from context
    setShowModal(false); // Close the modal
  };

  return (
    <div className="container mt-4">
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" tabIndex="-2" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="close btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="false">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={editingUser.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={editingUser.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      value={editingUser.address}
                      onChange={handleChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable1;
