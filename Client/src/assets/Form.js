import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const UserForm = () => {
  const { addUser } = useUserContext();
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [success, setSuccess] = useState(false); // Track form submission success
  const [error, setError] = useState(""); // Track error messages

  // Fetch countries when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/users/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log("error fetching countries", error);
        setError("Error fetching countries");
      });
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:8081/api/users/states/${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
          setCities([]); // Reset cities when country changes
          setSelectedState(""); // Reset state selection
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => {
          console.log("error fetching states", error);
          setError("Error fetching states");
        });
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      axios
        .get(`http://localhost:8081/api/users/cities/${selectedState}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.log("error fetching cities", error);
          setError("Error fetching cities");
        });
    }
  }, [selectedState]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form data
    if (!user.name || !user.email || !user.address || !selectedCountry || !selectedState || !selectedCity) {
      setError("All fields must be filled out");
      return;
    }

    // Prepare user data including selected country, state, and city
    const userData = {
      ...user,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    };

    // Send the data to the backend API
    axios
      .post("http://localhost:8081/api/users", userData)
      .then((response) => {
        setSuccess(true);
        setError("");
        setUser({
          name: "",
          email: "",
          address: "",
          country: "",
          state: "",
          city: "",
        });
        setSelectedCountry("");
        setSelectedState("");
        setSelectedCity("");
      })
      .catch((error) => {
        console.log("Error adding user:", error);
        setError("Error adding user");
        setSuccess(false);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add New User</h2>

      {/* Success or Error Message */}
      {success && <div className="alert alert-success">User added successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
            value={user.name}
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
            value={user.email}
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
            value={user.address}
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
            required
          >
            <option value="">Select Country</option>
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
            required
          >
            <option value="">Select State</option>
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
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!user.name || !user.email || !user.address || !selectedCountry || !selectedState || !selectedCity}
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
