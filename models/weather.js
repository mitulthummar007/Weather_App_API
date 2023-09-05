import mongoose, { model } from "mongoose";

const weatherSchema = new mongoose.Schema({
    Date_and_Time: String,
    Temperature: String,
    Feels_Like_in: String,
    Minimum_Temperature: String,
    Maximum_Temperature: String,
    pressure: String,
    humidity: String,
    country: String,
    sunrise: String,
    sunset: String,
    wind_speed: String,
    wind_deg: String,
    clouds: String,
    Description: String,
});

const weatherTable = mongoose.model('weatherData',weatherSchema);

export default weatherTable 