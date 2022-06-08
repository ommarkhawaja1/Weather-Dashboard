// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// step 1 click button, event, grab text from text box, pass through query string to open weather api. Get response back from form
// step 2 paarse data and display it with city name, date, icon, temp, wind, humidity, uv index
// step 3 5 day forecast separate function that will call a for loop and create a card with formatted date, icon, and values
// step 4 additional functionality that creates a button with the last city searched. Save in localstorage as recent and it will be
// an array of strings of all the things that people searched for. When you refresh the page it will go to local storage get array of
// of strings of cities and render buttons. These buttons will have onclick functionality that will take the text and pass it into the search bar
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=e0090736d1a7d7d3d3989801cd196bfa"

var weatherForm = document.querySelector("#weather-form");
var cityInput = document.querySelector("#city");
// var weatherContainer = document.querySelector("#weather-container");


var searchCity = function (event) {
  event.preventDefault();

  // get value from input element
  var city = cityInput.value.trim();

  // format the github api url
  var locationApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=e0090736d1a7d7d3d3989801cd196bfa"

  // make a request to the url
  fetch(locationApiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    getCityWeather(lat, lon);
  });

  
function getCityWeather (lat, lon) {
  // format the github api url
  var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" +lon + "&exclude=minutely,hourly&appid=e0090736d1a7d7d3d3989801cd196bfa"
  // make a request to the url
  fetch(weatherApiUrl)
  .then(function (response) {
    return response.json();
    })
    .then(function (data) {
      var currentData = data.current;
      var dailyData = data.daily;
      console.log(currentData, dailyData)
    });
  }
};

weatherForm.addEventListener("submit", searchCity);
