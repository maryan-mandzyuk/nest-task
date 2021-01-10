import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import axios from 'axios';
import { appConfig } from 'src/AppConfig';
@Injectable()
export class WeatherService {
  public async handleGetCurrentWeather(req: Request, res: Response) {
    try {
      const city = req.body.queryResult.parameters['geo-city'];

      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appConfig.WEATHER_API_KEY}`,
      );
      const temperatureInCelsius = (response.data.main.temp - 273.15).toFixed(
        2,
      );
      const weather = response.data.weather[0].description;
      const msg = {
        fulfillmentMessages: [
          {
            text: {
              text: [
                `Weather in ${city}: ${weather} \nTemperature: ${temperatureInCelsius}°C `,
              ],
            },
          },
        ],
      };
      res.json(msg);
    } catch (e) {
      console.log(e.data.message);
    }
  }
}
