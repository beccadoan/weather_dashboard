// grabs coordinates of city
var apiKey = 'c815eea855df2241ab24e06d69f9fa74';
searchHistory = {}; // set global variable

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

var updateCities = function(cities){
    cityHistoryEl.textContent = "";
 for (var i=0; i < cities.length; i++){
    var cityEl = document.createElement('li');
    cityEl.textContent = cities[i];
    cityEl.classList.add("history");
    cityHistoryEl.append(cityEl);
 }
}

var loadCities = function() {
    searchHistory = JSON.parse(localStorage.getItem("city-search-history"));
  
    // if nothing in localStorage, create a new object to track all task status arrays
    if (!searchHistory) {
      searchHistory = {
        cities: []
      } } else {
        updateCities(searchHistory.cities)
      }
  };
  
  var saveCities = function() {
    localStorage.setItem("city-search-history", JSON.stringify(searchHistory));
  };


var getLatLong = function(city){
    var url = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=' + apiKey

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        }).then(data => {
            var lat = data[0].lat.toString();
            var lon = data[0].lon.toString();
            var name = data[0].name;
            cityNameEl.innerHTML = name + " (" + moment().format("L") + ") <span><img id='c-icon' class='w-icon'></span>";
            searchHistory.cities.unshift(name)
            console.log(searchHistory);
            saveCities();
            updateCities(searchHistory.cities)
            getCityData(lat,lon);
        })
    }

var getCityData = function(lat, lon) {
    var url = 'http://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid=' + apiKey;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        }).then(data => {
            var todayIconEl = document.querySelector("#c-icon");
            var icon = data.current.weather[0].icon;
            var source = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
            todayIconEl.setAttribute('src', source);
            populateCurrentData(data.current);
            populateFutureData(data.daily);
        })
}

var populateCurrentData = function(weather) {
    currentTempEl.textContent = weather.temp;
    currentWindEl.textContent = weather.wind_speed;
    currentHumidEl.textContent = weather.humidity;
    currentUVEl.textContent = weather.uvi;
}

var populateFutureData = function(weather) {
    var dailyArray = weather.slice(1,6);
    fiveDayEl.innerHTML = ""
    for (var i = 0; i < 5; i++){
        var dailyForecastDiv = document.createElement('div');
        dailyForecastDiv.classList.add("one-day-forecast");
        var dateEl = document.createElement('h4');
        dateEl.textContent = moment().add(i+1, 'days').format("L");
        var icon = dailyArray[i].weather[0].icon;
        var source = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
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
})


