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
let forecastEl = document.querySelector('#forecast')
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
    let uviColor = document.createElement("span")
    //color indicator for uvi

    /*uviColor.textContent = "UV Index: " + uvi
        if (uvi <= 3) {
            uviColor.setAttribute("class", "bg-success ")
        } else if (uvi <= 8) {
            uviColor.setAttribute("class","bg-warning ")
        } else {
            uviColor.setAttribute("class", "bg-danger ")
        }
    */
    // interpolate data
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
let renderSearchedCities = (cityName) => {
    let prevCity = document.createElement("li");
    prevCity.setAttribute("class", "search-again-btn list-group-item align-top");
    
    
    prevCity.textContent = cityName;
    
    searchListEl.appendChild(prevCity)

    prevCity.addEventListener("click", function (event) {
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

                fetchCurrentWeather(data);
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
