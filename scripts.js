import { urlAPI } from "./api.js";
import { locationAPI } from "./api.js";
// import { test2 } from "./api.js";

// const BASE_URL = "https://api.openweathermap.org/data/4.0/onecall/current?lat=52.2297&lon=21.0122&units=metric&lang=en&appid=7bb0286dca3f35164851c0ad90e0ca84";

const city = document.getElementById("city");
const state = document.getElementById("state");
const temp = document.getElementById("temp");
const tempMax = document.getElementById("temp-max");
const tempMin = document.getElementById("temp-min");
const Weather = document.getElementById("weather");
const weatherIcon = document.getElementById("weather-icon");

const wind = document.getElementById("wind");
const FeelLike = document.getElementById("feel-like");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const todayDate = document.getElementById("date");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("city-input");

const errorMess = document.getElementById("error");


const getWeather = async (lat, long) => {
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=7bb0286dca3f35164851c0ad90e0ca84`;
    
    // const res = await fetch(url);
    // const data = await res.json();
    // console.log(data);
    const data = await urlAPI(`weather?lat=${lat}&lon=${long}&units=imperial&appid=7bb0286dca3f35164851c0ad90e0ca84`);
    console.log(data);
    
    city.textContent = `City: ${data.name}`;
    state.textContent = `State: ${data.sys.country}`

    temp.textContent = `${data.main.temp}°`;
    tempMax.textContent = `H: ${data.main.temp_max}°`;
    tempMin.textContent = `L: ${data.main.temp_min}°`;
    Weather.textContent = `${data.weather[0].main}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    wind.textContent = `Wind (Speed: ${data.wind.speed} / Temp: ${data.wind.deg}°)`;
    FeelLike.textContent = `Feels like: ${data.main.feels_like}°`;
    sunrise.textContent = `Sunrise: ${getCityTime(data.sys.sunrise, data.timezone)}`;
    sunset.textContent = `Sunset: ${getCityTime(data.sys.sunset, data.timezone)}`;
    todayDate.textContent = `Date: ${date}/${month}/${year}`;
}

//-------FIND OUT TODAY's DATE----------
const now = new Date();
const date = now.getDate();
const month = now.getMonth() + 1; // Months are zero-based
const year = now.getFullYear();
// console.log(`${date}/${month}/${year}`);

// console.log(new Date().toLocaleString());

//----------GET RIGHT TIME------------
function getCityTime(unixSeconds, timezone) {
  // return "TODO";
  const date = new Date((unixSeconds + timezone) * 1000);
  return date.toLocaleTimeString("en-US", {timeZone: "UTC", hour:"numeric", minute: "2-digit"});
}


//--------------------CHECKING DAYS-------------------------------
async function get5DayForecast (lat,long){
    // const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=7bb0286dca3f35164851c0ad90e0ca84`;
    // const res = await fetch(BASE_URL);
    // const data = await res.json();
    // console.log(data);
    const data = await urlAPI(`forecast?lat=${lat}&lon=${long}&units=imperial&appid=7bb0286dca3f35164851c0ad90e0ca84`);

    showForecast(data);
}



function getCityDate(unixSeconds, timezone) {
  const date = new Date((unixSeconds + timezone) * 1000);
  return date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" });
}

function groupByDay(list, timezone) {
  const days = {};

  for (const item of list) {
    const date = getCityDate(item.dt, timezone)
    if(!days[date]){
      days[date] = {
        date:date,
        high: item.main.temp_max,
        low: item.main.temp_min,
        icon: item.weather[0].icon,
        description: item.weather[0].description
      };
    }
    if(item.main.temp_max > days[date].high){
      days[date].high = item.main.temp_max;
    }
  
    if(item.main.temp_min < days[date].low){
      days[date].low = item.main.temp_min;
    }
  }

  // turn the buckets into an array: one item per day
  const dayList = [];
  for (const day in days) {
    dayList.push(days[day]);
  }

// console.log(dayList)

  return dayList; // return Object.values(days);
}


function showForecast(data) {

console.log(data);

  const allDays = groupByDay(data.list, data.city.timezone);
  const fiveDays = allDays.slice(1, 6); // skip today, keep the next 5

//   document.getElementById("city-name").textContent = data.city.name + ", " + data.city.country;
//   document.getElementById("counts").textContent =
//     data.list.length + " readings → " + allDays.length + " days found → showing " + fiveDays.length;

  const container = document.getElementById("forecast");
  container.innerHTML = "";

  for (const day of fiveDays) {
    container.innerHTML += `
      <div class="rounded-2xl bg-white/15 p-4 text-center shadow-lg">
        <p class="font-semibold">${day.date}</p>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" class="mx-auto h-20 w-20">
        <p class="capitalize">${day.description}</p>
        <p class="mt-2 text-lg font-bold">${Math.round(day.high)}° <span class="font-normal text-sky-200">/ ${Math.round(day.low)}°</span></p>
      </div>
    `;
  }
}

// getWeather(52.2297, 21.0122);
// get5DayForecast(52.2297, 21.0122);



// const success = (position) => {
//     console.log(position);

//     const lat = position.coords.latitude;
//     const lon = position.coords.longitude;

//     latitudeText.textContent = lat.toFixed(2);
//     longitudeText.textContent = lon.toFixed(2);
//     status.textContent = "Found you :)!";

//     getWeather(lat,lon)

// }

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // const LOCATION_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value.trim()}&limit=5&appid=7bb0286dca3f35164851c0ad90e0ca84`;

    errorMess.textContent = ``;    

    if(searchInput.value === ""){
      errorMess.textContent = `No city name is entered!`;
    } else {
      // const res = await fetch(LOCATION_URL);
      // const data = await res.json();
      const data = await locationAPI(`direct?q=${searchInput.value.trim()}&limit=5&appid=7bb0286dca3f35164851c0ad90e0ca84`)
      console.log(data);

      if (data.length === 0){ //Checks if array is empty
        errorMess.textContent = `City name doesn't exist!`;
      } else {
        const cityLat = await (`${data[0].lat}`);
        const cityLong = await (`${data[0].lon}`);
        getWeather(cityLat, cityLong);
        get5DayForecast(cityLat, cityLong);

      }

    }

  });