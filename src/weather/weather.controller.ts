import { Controller, Post, Request, Response } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Post('')
  currentWeather(@Request() req, @Response() res) {
    this.weatherService.handleGetCurrentWeather(req, res);
  }
}
