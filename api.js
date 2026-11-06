const url = `https://api.openweathermap.org/data/2.5/`;

export const  urlAPI = async (route) => {
const res = await fetch(url + route);
const data = await res.json();
return data;
}

// export const  test2 = async (route) => {
// const res = await fetch(url + route);
// const data = await res.json();
// return data;
// }

const LOCATION_URL = `http://api.openweathermap.org/geo/1.0/`;

export const  locationAPI = async (route) => {
const res = await fetch(LOCATION_URL + route);
const data = await res.json();
return data;
}