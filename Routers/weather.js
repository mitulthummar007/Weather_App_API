import express from 'express';
import APP_STATUS from '../constant/APP_STATUS.js';
import getWeatherData from '../controllers/wheathercontroller.js';

const weatherRouter = express.Router();

/**
 * @usage : weather API
 * @url : http://localhost:8001/api/weather/{unitType}
 * @method : POST
 */

weatherRouter.post('/', async (req, res) => {
    try {
        await getWeatherData(req, res);
    } catch (err) {
        return res.status(500).json({
            status: APP_STATUS.FAILED,
            msg: "Internal server Error",
            data: null,
            Error: err
        });
    }
});

export default weatherRouter;

