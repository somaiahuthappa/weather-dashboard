var apiKey = "3a5eefa4c9e8240981d4cf41c8e7d65b";
var currentCity = "";
var finalCity = "";

var currentWeather = (event) => {
    let city = $('#city-search').val();
    currentCity = $('#city-search').val();

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=" + apiKey;
    fetch(queryURL)
    .then((response) => {
        return response.json()
    })
    
    .then((response) => {
        saveCity(city);

    // create image for current weather
    let currentWeatherImage = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    let timeUTC = response.dt;
    let timeZoneOffset = response.timezone;
    let timezoneOffsetHours = timeZoneOffset/ 60 /60;
    let thisMoment = moment.unix(timeUTC).utc().utcOffset(timezoneOffsetHours);


    searchHistory();

    // create HTML for the current weather field

    let weatherHTML = `
    <h3>${response.name} ${thisMoment.format("(DD/MM/YY)")}<img src="${currentWeatherImage}"></h3>
    <ul class="list-unstyled">
    <li>Temperature: ${response.main.temp}&#8451;</li>
    <li>Humidity: ${response.main.humidity}%</li>
    <li>Wind Speed: ${response.wind.speed} m/sec</li>
    <li id="uv-index">UV Index:${response.current_uvi}</li>
    </ul>
    `
    // append results
    $('#current-weather').html(weatherHTML);

    })
}

// check if city is existing
var saveCity = (newCity) => {
    let existingCity = false;
    for (let i=0; i<localStorage.length; i++) {
        if(localStorage["cities" + i] === newCity) {
            existingCity = true;
            break;
        }
    }
    // save to local storage
    if(existingCity === false) {
        localStorage.setItem('cities' + localStorage.length, newCity)
    }
}

// render the city search history

var searchHistory = () => {
    $('#search-history').empty();

    if(localStorage.length === 0) {
        if (finalCity) {
            $('#city-search').attr("value", finalCity);
        } else {
            $('#city-search').attr("value", "Burlington");
        }
    } else {
        let finalCityList = "cities" + (localStorage.length-1);
        finalCity = localStorage.getItem(finalCityList);
        // set input to most recent city searched
        $('#city-search').attr("value", finalCity);
        // append to list on page
        for (let i=0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl;
            if(currentCity==="") {
                currentCity=finalCity
            }
            if(city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
                
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            }
            // append
            $('#search-history').prepend(cityEl);
        }
    }
}

// event listener
$('#search-btn').on("click", (event) => {
    event.preventDefault();
    currentCity = $('city-search').val();
    currentWeather(event);
});

// search history event listener
$('#search-history').on("click", (event) => {
    event.preventDefault();
    $('#city-search').val(event.target.textContent);
    currentCity=$('#city-search').val();
    currentWeather();
});

// clear search history
$('#clear-search').on("click", (event) => {
localStorage.clear();
$('#search-history').empty();
currentWeather;
})

searchHistory();

currentWeather();
