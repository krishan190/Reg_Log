import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    name: {
        type: "string",
        required: true
    },
    short_name: {
        type: "string",
        required: true
    },
    country_short_name: {
        type: "string",
        required: true
    }

})

export default mongoose.model("city", citySchema);