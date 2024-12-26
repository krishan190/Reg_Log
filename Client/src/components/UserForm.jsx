import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const UserForm = () => {
  const { addUser } = useUserContext();
  const [user, setUser] = useState({ name: "", email: "", address: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(user);
    setUser({ name: "", email: "", address: "" });
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/users/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log("error fetching countries", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:8081/api/users/states/${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
          setCities([]);
        })
        .catch((error) => {
          console.log("error fetching countries", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      axios
        .get(`http://localhost:8081/api/users/cities/${selectedState}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.log("error fetching countries", error);
        });
    }
  }, [selectedState]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter address"
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-table">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option>Select Country</option>
            {countries.map((country) => (
              <option key={country.short_name} value={country.short_name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="state" className="form-table">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
          >
            <option>Select State</option>
            {states.map((state) => (
              <option key={state.short_name} value={state.short_name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-table">
            City
          </label>
          <select disabled={!selectedState}>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
