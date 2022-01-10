/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city*/




let searchFormEl = document.querySelector('#search-form');
let searchInputEl = document.querySelector('#search-input')
let searchListEl = document.querySelector('#searched-list');
let btnEl = document.getElementById("search-btn");
let storedCitiesArray=[]
let currentWeatherEl = document.querySelector('#current');
let forecastEl = document.querySelector('#forecast')
const APIKey = "eb52eb5452da47e3828a6d3d29f21b3b"
console.log(APIKey)

//API call = https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


let renderSearchedCities = (cityName) => {
    let city = document.createElement("li");
    city.setAttribute("class", "search-again-btn");
    city.setAttribute("class", "card-body")
    
    city.textContent = cityName;
    
    searchListEl.appendChild(city)

    city.addEventListener("click", function (event) {
        console.log(event.target.value)
        fetchCityInfo(cityName)
    });

    
}

let fetchCityInfo = (cityName) => {
    event.preventDefault();

    
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;

    //make a request to the url
    fetch(apiUrl).then((response) => {

        if (response.ok) {
            response.json().then((data) => {
                console.log(data);



                let latitude = data.coord.lat;
                let longitude = data.coord.lon;
                let locationName = data.name;

                
                let searchHistory = storedCitiesArray.includes(cityName)
                if (!searchHistory) {
                    storedCitiesArray.push(cityName)
                    localStorage.setItem("storedCities", JSON.stringify(storedCitiesArray))

                    renderSearchedCities(cityName)
                }

                //fetchCurrentWeather(latitude, longitude, locationName);
                //fetchForecast(latitude,longitude, locationName)

            });


        } else {
            alert("Not found")
        }
    });
};

searchFormEl.addEventListener("submit", function () {
    cityName = searchInputEl.value.trim();
    fetchCityInfo(cityName);
})
