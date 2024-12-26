import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    password: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  // Fetch countries when the component mounts
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
          setSelectedState("");
          setSelectedCity("");
        })
        .catch((error) => {
          console.log("error fetching states", error);
          setError("Error fetching states");
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
          console.log("error fetching cities", error);
          setError("Error fetching cities");
        });
    }
  }, [selectedState]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      ...user,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    };

    // Send the data to the backend API
    const res = await axios
      .post("http://localhost:8081/api/users/register", userData)
      .then((res) => {
        setUser({
          name: "",
          email: "",
          address: "",
          password: "",
          country: "",
          state: "",
          city: "",
        });
        setSelectedCountry("");
        setSelectedState("");
        setSelectedCity("");
        if (res && res.data.success) {
          alert("user Register successfully");
          navigate("/login");
        }
      })
      .catch((error) => {
        alert("Invalid data");
        console.log("Error adding user:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Register Page</h2>

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
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <select
            id="country"
            className="form-select" // Bootstrap class for styled select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.name} value={country.short_name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="state" className="form-lable">
            State
          </label>
          <select
            id="state"
            className="form-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.name} value={state.short_name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-lable">
            City
          </label>
          <select
            id="city"
            className="form-select"
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

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
