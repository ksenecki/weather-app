import axios from 'axios';

//https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin

export function getWeather(lat, lng, timezone) {
	return axios.get(
		'https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime',
		{
			params: {
				latitude: lat,
				longitude: lng,
				timezone,
			},
		}
	).then(({data}) => {
    return {
      current: parseCurrentWeather(data),
      daily: parseDailyWeather(data),
      hourly: parseHourlyWeather(data)
    };
  });
}

  function parseCurrentWeather({ current_weather, daily}) {
    const {
      temperature: currentTemperature,
      windspeed: windSpeed,
      weathercode: iconCode
    } = current_weather;

    const {
      temperature_2m_max: [maxTemperature],
      temperature_2m_min: [minTemperature],
      apparent_temperature_max: [maxFeelsLike],
      apparent_temperature_min: [minFeelsLike],
      precipitation_sum: [precipitation],
    } = daily;

    return {
      currentTemperature: Math.round(currentTemperature),
      highTemperature: Math.round(maxTemperature),
      lowTemperature: Math.round(minTemperature),
      highFeelsLike: Math.round(maxFeelsLike),
      lowFeelsLike: Math.round(minFeelsLike),
      windSpeed: Math.round(windSpeed),
      precipitation: Math.round(precipitation * 100)/100,
      iconCode
    };
  }

  function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: daily.weathercode[index],
        maxTemperature: Math.round(daily.temperature_2m_max[index])
      };
    });
  }

  function parseHourlyWeather({ hourly, current_weather }) {
    return hourly.time.map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        temperature: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        precipitation: Math.round(hourly.precipitation[index]*100)/100
      };
    }).filter(({timestamp}) => timestamp >= current_weather.time * 1000);
  }

