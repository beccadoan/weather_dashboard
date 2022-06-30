// grabs coordinates of city
var apiKey = 'c815eea855df2241ab24e06d69f9fa74';

var currentWeatherIcon = document.querySelector('#icon-today');
var cityNameEl = document.querySelector("#name-date");
var currentTempEl = document.querySelector("#temp");
var currentHumidEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUVEl = document.querySelector("#UV");
var fiveDayEl = document.querySelector("#day-container");


// cityNameEl.textContent = moment().format("L");
// cityNameEl.textContent += moment().add(2, 'days').format("L")

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
    console.log(dailyArray);
}

getLatLong("austin");

