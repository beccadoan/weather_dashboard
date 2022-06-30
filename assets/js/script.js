// apiKey for weather api
var apiKey = 'c815eea855df2241ab24e06d69f9fa74';
searchHistory = {}; // set global variable


// grab variables from DOM
var currentWeatherIcon = document.querySelector('#icon-today');
var cityNameEl = document.querySelector("#name-date");
var currentTempEl = document.querySelector("#temp");
var currentHumidEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUVEl = document.querySelector("#UV");
var fiveDayEl = document.querySelector(".day-container");
var formEl = document.querySelector("#submit-city");
var citySearchEl = document.querySelector("#city-search");
var cityHistoryEl = document.querySelector("#city-history");

// take locally stored history and create elements on web page
var updateCities = function(){
    var cities = searchHistory.cities;
    cityHistoryEl.textContent = "";
    
    // only display the latest 8 searches
    var arrayLength = cities.length;
    if (arrayLength>8){
        arrayLength = 8;
    }
    // create a list element for each searched city
    for (var i=0; i < arrayLength; i++){
        var cityEl = document.createElement('li');
        cityEl.textContent = cities[i];
        cityEl.classList.add("history");
        cityHistoryEl.append(cityEl);
    }
}

// load cities from local storage and display them to page
var loadCities = function() {
    searchHistory = JSON.parse(localStorage.getItem("city-search-history"));
  
    // if nothing in localStorage, create a new object
    if (!searchHistory) {
      searchHistory = {
        cities: []
      } } else {
        updateCities()
      }
  };
  
  // save city history to local storage
  var saveCities = function() {
    localStorage.setItem("city-search-history", JSON.stringify(searchHistory));
  };

// get latitude and longitude of any city in the US
var getLatLong = function(city){
    var url = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=' + apiKey

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        }).then(data => {
            // grab latitude, longitude, and official city name from data
            var lat = data[0].lat.toString();
            var lon = data[0].lon.toString();
            var name = data[0].name;
            // add city name, date, and weather icon for current weather
            cityNameEl.innerHTML = name + " (" + moment().format("L") + ") <span><img id='c-icon' class='w-icon'></span>";
            // add newest city name to beginning of city history array
            searchHistory.cities.unshift(name)
            // save cities, update page, and grab the rest of the weather data
            saveCities();
            updateCities()
            getCityData(lat,lon);
        })
    }

// gets weather data for a city given it's latitude and longitude
var getCityData = function(lat, lon) {
    var url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid=' + apiKey;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        }).then(data => {
            // get source for weather icon
            var todayIconEl = document.querySelector("#c-icon");
            var icon = data.current.weather[0].icon;
            var source = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
            todayIconEl.setAttribute('src', source);
            // call functions to populate web page with current and future data
            populateCurrentData(data.current);
            populateFutureData(data.daily);
        })
}
// pupulate dom elements with data from api
var populateCurrentData = function(weather) {
    currentTempEl.textContent = weather.temp;
    currentWindEl.textContent = weather.wind_speed;
    currentHumidEl.textContent = weather.humidity;
    currentUVEl.textContent = weather.uvi;
    var uviVal = parseInt(weather.uvi);
    var uviColor = "";
    if (uviVal < 3){
        uviColor = 'orange';
    } else if (uviVal < 8) {
        uviColor = 'red';
    } else {
        uviColor = '#230555';
    }
    currentUVEl.style.backgroundColor = uviColor;
}

// create dom elements with datat from api
var populateFutureData = function(weather) {
    // only use data for the next 5 days
    var dailyArray = weather.slice(1,6);
    // emply contents before creating new elements
    fiveDayEl.innerHTML = ""
    // create the 5 daily weather containers and their contents
    for (var i = 0; i < 5; i++){
        var dailyForecastDiv = document.createElement('div');
        dailyForecastDiv.classList.add("one-day-forecast");
        var dateEl = document.createElement('h4');
        dateEl.textContent = moment().add(i+1, 'days').format("L");
        var icon = dailyArray[i].weather[0].icon;
        var source = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
        var iconEl = document.createElement('img');
        iconEl.classList.add("icon-today")
        iconEl.setAttribute('src', source);
        var tempEl = document.createElement('p');
        tempEl.innerHTML = "Temp: " + dailyArray[i].temp.day + "&deg;F";
        var windEl = document.createElement('p');
        windEl.textContent = "Wind: " + dailyArray[i].wind_speed + "MPH";
        var humidEl = document.createElement('p');
        humidEl.textContent = "Humidity: " + dailyArray[i].humidity + "%";


        dailyForecastDiv.append(dateEl, iconEl, tempEl, humidEl, windEl);
        fiveDayEl.append(dailyForecastDiv);
    }
}

loadCities();

formEl.addEventListener('submit', function(event){
    event.preventDefault();
    var name = citySearchEl.value.trim();
    getLatLong(name);
    citySearchEl.value = "";
})

cityHistoryEl.addEventListener('click', function(event){
    var city = event.target.textContent;
    getLatLong(city);
    citySearchEl.value = "";
})


