import mongoose from "mongoose";
import { State, City } from "country-state-city";

const seedDatabase = async () => {
    try {

        const db = mongoose.connection.db;

        // Insert Countries
        const countriesCollection = db.collection("countries");
        const countries = Country.getAllCountries();
        const countryDocs = countries.map(country => ({
            name: country.name,
            short_name: country.isoCode
        }));

        if (countryDocs.length > 0) {
            await countriesCollection.insertMany(countryDocs);
            console.log("Countries inserted");
        }

        // Insert States
        const statesCollection = db.collection("states");
        const states = State.getAllStates();
        const stateDocs = states.map(state => ({
            name: state.name,
            short_name: state.isoCode,
            country_short_name: state.countryCode
        }));

        if (stateDocs.length > 0) {
            await statesCollection.insertMany(stateDocs);
            console.log("States inserted");
        }

        // Insert Cities
        const citiesCollection = db.collection("cities");
        const cities = City.getAllCities();
        const cityDocs = cities.map(city => ({
            name: city.name,
            short_name: city.stateCode,
            country_short_name: city.countryCode
        }));

        if (cityDocs.length > 0) {
            await citiesCollection.insertMany(cityDocs);
            console.log("Cities inserted");
        }

        console.log("Seeding complete!");


        mongoose.connection.close();
    } catch (error) {
        console.log(`Error in seeding database: ${error}`);
    }
};

export default seedDatabase;