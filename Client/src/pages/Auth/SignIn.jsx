import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignIn = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  // Fetch countries
  useEffect(() => {
    console.log(user.country);
    
    axios
      .get("http://localhost:8081/api/users/countries")
      .then((response) => setCountries(response.data))
      .catch(() => toast.error("Error fetching countries"));
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (user.country) {
      axios
        .get(`http://localhost:8081/api/users/states/${user.country}`)
        .then((response) => {
          setStates(response.data);
          setCities([]);
          setUser((prev) => ({ ...prev, state: "", city: "" }));
        })
        .catch(() => toast.error("Error fetching states"));
    }
  }, [user.country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (user.state) {
      axios
        .get(`http://localhost:8081/api/users/cities/${user.state}`)
        .then((response) => setCities(response.data))
        .catch(() => toast.error("Error fetching cities"));
    }
  }, [user.state]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/api/users/register",
        user
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Your Name"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Your Address"
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="country"
              value={user.country}
              onChange={handleChange}
              className="form-control"
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
            <select
              name="state"
              value={user.state}
              onChange={handleChange}
              className="form-control"
              required
              disabled={!user.country}
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
            <select
              name="city"
              value={user.city}
              onChange={handleChange}
              className="form-control"
              required
              disabled={!user.state}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SignIn;
