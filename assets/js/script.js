// grabs coordinates of city
var apiKey = 'c815eea855df2241ab24e06d69f9fa74';

var currentWeatherIcon = document.querySelector('#icon-today');
var cityNameEl = document.querySelector("#name-date");
var currentTempEl = document.querySelector("#temp");
var currentHumidEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUVEl = document.querySelector("#UV");
var fiveDayEl = document.querySelector(".day-container");
var formEl = document.querySelector("#submit-city");
var citySearchEl = document.querySelector("#city-search")
// cityNameEl.textContent += moment().add(2, 'days').format("L")
// cityNameEl.textContent = "fu"

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
    fiveDayEl.innerHTML = ""
    for (var i = 0; i < 5; i++){
        // console.log(dailyArray[i]);
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
        console.log(dailyArray[i]);
        tempEl.innerHTML = "Temp: " + dailyArray[i].temp.day + "&deg;F";
        var windEl = document.createElement('p');
        windEl.textContent = "Wind: " + dailyArray[i].wind_speed + "MPH";
        var humidEl = document.createElement('p');
        humidEl.textContent = "Humidity: " + dailyArray[i].humidity + "%";


        dailyForecastDiv.append(dateEl, iconEl, tempEl, humidEl, windEl);
        fiveDayEl.append(dailyForecastDiv);
    }
}

formEl.addEventListener('submit', function(event){
    event.preventDefault();
    var name = citySearchEl.value.trim();
    getLatLong(name);
})


