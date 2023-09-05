import APP_STATUS from '../constant/APP_STATUS.js';
import https from 'https';
import weatherTable from '../models/weather.js';

/**
 * @usage : weather API
 * @url : http://localhost:8001/api/weather/{unitType}
 * @method : POST
 */
const getWeatherData = async (req, res) => {
    try {
        let { cityName, units } = req.query;
        const apiKey = process.env.KEY;
        const unitType = units === 'F' ? 'imperial' : 'metric';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitType}`;
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).json({
                    status: APP_STATUS.FAILED,
                    msg: "Enter Correct cityName",
                    data: null,
                });    
            }
            response.on('data', (data) => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                let feels_like = weatherData.main.feels_like;
                let temp_min = weatherData.main.temp_min;
                let temp_max = weatherData.main.temp_max;
                let pressure = weatherData.main.pressure;
                let humidity = weatherData.main.humidity;
                let country = weatherData.sys.country;
                let sunriseTimestamp = weatherData.sys.sunrise * 1000; // Convert to milliseconds
                let sunriseTime = new Date(sunriseTimestamp);
                let sunriseFormatted = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}:${sunriseTime.getSeconds()}`;
                let sunsetTimestamp = weatherData.sys.sunset * 1000; // Convert to milliseconds
                let sunsetTime = new Date(sunsetTimestamp);
                let sunsetFormatted = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}:${sunsetTime.getSeconds()}`;
                let curDate = new Date();
                let day = curDate.getDate().toString().padStart(2, '0');
                let month = (curDate.getMonth() + 1).toString().padStart(2, '0');
                let year = curDate.getFullYear();
                let hours = curDate.getHours().toString().padStart(2, '0');
                let minutes = curDate.getMinutes().toString().padStart(2, '0');
                let seconds = curDate.getSeconds().toString().padStart(2, '0');
                let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} `;
                
                let windspeed = weatherData.wind.speed;
                let winddeg = weatherData.wind.deg;
                let clouds = weatherData.clouds.all
                let description = weatherData.weather[0].description;

                const temperatureType = units === 'F' ? 'Fahrenheit' : 'degree Celsius';

                const weatherDataObject = {
                    Date_and_Time: formattedDate,
                    Temperature: (`${cityName} Temp is ${temp} ${temperatureType}`),
                    Feels_Like_in: (`in ${cityName} : ${feels_like} Feel Like`),
                    Minimum_Temperature: (`Minimum Temperature in ${cityName} : ${temp_min}`),
                    Maximum_Temperature: (`Maximum Temperature in ${cityName}: ${temp_max}`),
                    pressure: (`in ${cityName}: ${pressure}`),
                    humidity: (`in ${cityName}: ${humidity}`),
                    country,
                    sunrise: sunriseFormatted,
                    sunset: sunsetFormatted,
                    wind_speed: windspeed + " m/s",
                    wind_deg: winddeg,
                    clouds,
                    Description: description
                  };

                //   const newWeatherData = new weatherTable(weatherDataObject).save()
                //   if(newWeatherData){

                return res.status(200).json({
                    status: APP_STATUS.SUCCESS,
                    msg: "Weather Data",
                    data:{
                    Date_and_Time: formattedDate,
                    Temperature: (`${cityName} Temp is ${temp} ${temperatureType}`),
                    Feels_Like_in: (`in ${cityName} : ${feels_like} Feel Like`),
                    Minimum_Temperature: (`Minimum Temperature in ${cityName} : ${temp_min}`),
                    Maximum_Temperature: (`Maximum Temperature in ${cityName}: ${temp_max}`),
                    pressure: (`in ${cityName}: ${pressure}`),
                    humidity: (`in ${cityName}: ${humidity}`),
                    country,
                    sunrise: sunriseFormatted,
                    sunset: sunsetFormatted,
                    wind_speed: windspeed + " m/s",
                    wind_deg: winddeg,
                    clouds,
                    Description: description
                    }
                });
                // }
            });
        });
    } catch (err) {
        return res.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: "Invalid City name",
            Error: err
        });
    }
};

export default getWeatherData