import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    name: {
        type: "string",
        required: true
    },
    short_name: {
        type: "string",
        required: true
    }

})

export default mongoose.model("country", countrySchema);