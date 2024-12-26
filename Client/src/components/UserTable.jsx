import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const UserTable = () => {
  const { users, deleteUser, updateUser } = useUserContext();
  const [showModel, setShowModel] = useState(false);
  const [showDeltete, setShowDelete] = useState(false);
  const [selectUser, setSelecteUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleEdit = (user) => {
    setEditData(user);
    console.log(user);
    setShowModel(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    await updateUser(editData._id, editData);
    setShowModel(false);
  };

  const handleDelete = async () => {
    console.log(selectUser._id);
    await deleteUser(selectUser._id);
    setShowDelete(false);
  };

  const confirmDelete = (user) => {
    setSelecteUser(user);
    setShowDelete(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User List</h2>
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
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => confirmDelete(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeltete && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you Sure Want to delete</h5>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModel && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModel(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="false">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group mt-3">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="name">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={editData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="name">Address</label>
                    <input
                      type="address"
                      id="address"
                      name="address"
                      className="form-control"
                      value={editData.address}
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
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModel(false)}
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

export default UserTable;
