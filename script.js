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
let currentWeatherDiv = document.querySelector('#current');
let forecastDiv = document.querySelector('#forecast')
let forecastHeaderEl = document.getElementById("forecast-header");
const APIKey = "eb52eb5452da47e3828a6d3d29f21b3b"
console.log(APIKey)

//API current call = https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API forecast call = https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
let fetchCurrentWeather = (data) => {

    
    let temperature = data.main.temp;
    console.log(temperature)
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    //let uvi = data.current.uvi;
    let city = data.name
    

    
    currentWeatherDiv.textContent = ""
    let currentCityNameDiv = document.createElement("div")
    currentCityNameDiv.setAttribute("class", "card-header")
    let date = dayjs().format("MMMM D YYYY");
    let currentCityNameEl = document.createElement("h1");
    currentCityNameEl.textContent = city + " : " + date ;
    

    //display current city
    currentCityNameDiv.appendChild(currentCityNameEl)
    currentWeatherDiv.appendChild(currentCityNameDiv)

    //append weather data elements to current city
    let displayData = document.createElement("ul")
    displayData.setAttribute("class", "list-group list-group-flush")
    let tempEl = document.createElement("li");
    tempEl.setAttribute("class", "list-group-item")
    let humidityEl = document.createElement("li");
    humidityEl.setAttribute("class", "list-group-item")
    let windEl = document.createElement("li");
    windEl.setAttribute("class", "list-group-item")
    let uviEl = document.createElement ("li");
    uviEl.setAttribute("class", "list-group-item")
    //let uviColor = document.createElement("span")

    tempEl.textContent = "Temperature: " + temperature + "°F";
    windEl.textContent = "Wind: " + wind + " MPH";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    uviEl.textContent = "UV Index: ";
    //uviEl.appendChild(uviColor)

    //append elements to section
    displayData.appendChild(tempEl);
    displayData.appendChild(windEl);
    displayData.appendChild(humidityEl);
    displayData.appendChild(uviEl);

    currentWeatherDiv.appendChild(displayData);
    
};
let renderPrevSearches = (cityName) => {
    let prevCity = document.createElement("li");
    prevCity.setAttribute("class", "search-again-btn list-group-item align-top text-center bg-dark text-white");
    
    
    prevCity.textContent = cityName.toUpperCase();
    
    searchListEl.appendChild(prevCity)

    prevCity.addEventListener("click", function (event) {
        console.log(event.target.value)
        fetchCityInfo(cityName)
    });

    
}

let fetchForecast= (latitude, longitude) => {

    let forecastApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + APIKey;

    fetch(forecastApiUrl)
    .then((response) => {
        response.json().then((data) => {
           
            forecastDiv.textContent = "";
            forecastHeaderEl.textContent = "5-day Forecast:"

            for (let i = 1; i < 6; i++) {
                let forecastIcon = data.daily[i].weather[0].icon;
                let forecastTemp = data.daily[i].temp.day;
                let forecastWind = data.daily[i].wind_speed;
                let forecastHumidity = data.daily[i].humidity;

                
                let forecastCard = document.createElement("div");
                forecastCard.setAttribute("class", "card bg-dark text-white text-center mx-2 col-2");

                let cardBody = document.createElement("div");
                cardBody.setAttribute("class", "card-body");
                let forecastDate = document.createElement("h5");
                forecastDate.textContent = dayjs().add(i, 'days').format("MMMM DD");

                let forecastIconEl = document.createElement("img");
                forecastIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png")

                let forecastTempEl = document.createElement("h6");
                forecastTempEl.setAttribute("class", "card-text");
                forecastTempEl.textContent = "Temperature:  " + forecastTemp + "°F";

                let forecastWindEl = document.createElement("h6");
                forecastWindEl.setAttribute("class", "card-text")
                forecastWindEl.textContent = "Wind:  " + forecastWind + "MPH";



                let forecastHumidityEl = document.createElement("h6")
                forecastHumidityEl.setAttribute("class", "card-text");
                forecastHumidityEl.textContent = "Humidity:  " + forecastHumidity + "%";

              
                cardBody.appendChild(forecastDate)
                cardBody.appendChild(forecastIconEl)
                cardBody.appendChild(forecastTempEl)
                cardBody.appendChild(forecastWindEl)
                cardBody.appendChild(forecastHumidityEl)

              
                forecastCard.appendChild(cardBody);
                forecastDiv.appendChild(forecastCard);
                searchFormEl.reset()

            }
        })
    })
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

                    renderPrevSearches(cityName)
                }

                fetchCurrentWeather(data);
                fetchForecast(latitude,longitude)

            });


        } else {
            alert("Not found")
        }
    });
};

let loadStoredCities = () => {
    let cities = localStorage.getItem("storedCities")
    if(!cities) {
        return;
    }
    
    cities = JSON.parse(cities);
    
    for (let i=0; i < cities.length; i++) {
        renderPrevSearches(cities[i])
        storedCitiesArray.push(cities[i])
    }
}

loadStoredCities()

searchFormEl.addEventListener("submit", function () {
    
    cityName = searchInputEl.value.trim();
    fetchCityInfo(cityName);
})
