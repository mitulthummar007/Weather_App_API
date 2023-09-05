import express, { response } from "express";
import dotenv from 'dotenv'
import https from 'https'
import path from 'path'
import bodyParser from 'body-parser';
import ejs from 'ejs'
import APP_STATUS from "./constant/APP_STATUS.js";
import weatherRouter from "./Routers/weather.js";

//call mongodb connection
// import mongoose from "./connections/mongodb.js";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config({
    path: "./.env"
})
const port = process.env.PORT || 5001
const hostname = process.env.HOST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Assuming your CSS file is in the "public" directory
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index'); // Render the "index.ejs" template
});
app.post('/show', (req, res) => {
    const apiKey = process.env.KEY
    let cityName = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    console.log(req.body.cityName);
    
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({
                status: APP_STATUS.FAILED,
                msg: "Enter Correct cityname",
                data: null,
            });
        } 
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);

            const temp = weatherData.main.temp;
            let feels_like = weatherData.main.feels_like;
            let temp_min = weatherData.main.temp_min
            let temp_max = weatherData.main.temp_max
            let pressure = weatherData.main.pressure
            let humidity = weatherData.main.humidity
            let country = weatherData.sys.country
            let curDate = new Date()
            let description = weatherData.weather[0].description
            console.log(temp);
            const weatherInfoHTML = `
        <div class="weather-info">
            <h1>${cityName} Temp is ${temp} degree celcius</h1>
            <p>Feels Like: ${feels_like}</p>
            <p>Minimum Temperature: ${temp_min}</p>
            <p>Maximum Temperature: ${temp_max}</p>
            <p>Pressure: ${pressure}</p>
            <p>Humidity: ${humidity}</p>
            <p>Country: ${country}</p>
            <p class="description">Description: ${description}</p>
            <p>Date: ${curDate}</p>
        </div>
    `;
    res.write(weatherInfoHTML);
        });
    });
});

//Router config.
app.use('/api/weather', weatherRouter)
app.listen(port, () => {
    console.log(`Listening on Server at URL http://${hostname}:${port}`);
});
