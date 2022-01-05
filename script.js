const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#seach-input');
const searchList = document.querySelector('#search-list');
let searchedCitiesArray=[]
const currentWeather = document.querySelector('#current');
const forecast = document.querySelector('#forecast')

const getWeather = async function(location){

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=2c46a57714cfaf2673339b7b2f255993`
    )
    const data = await response.json();
}