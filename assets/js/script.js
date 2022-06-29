// step 1 click button, event, grab text from text box, pass through query string to open weather api. Get response back from form
// step 2 paarse data and display it with city name, date, icon, temp, wind, humidity, uv index
// step 3 5 day forecast separate function that will call a for loop and create a card with formatted date, icon, and values
// step 4 additional functionality that creates a button with the last city searched. Save in localstorage as recent and it will be
// an array of strings of all the things that people searched for. When you refresh the page it will go to local storage get array of
// of strings of cities and render buttons. These buttons will have onclick functionality that will take the text and pass it into the search bar
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=e0090736d1a7d7d3d3989801cd196bfa"

var weatherForm = document.querySelector("#weather-form");
var cityInput = document.querySelector("#city");


var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var city = cityInput.value.trim()

  if (city) {
    searchCity(city);

  } else {
    alert("Please enter a city name")
  }

};

var searchCity = function (city) {
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
      console.log(lat, lon)
      getCityWeather(lat, lon);
    });


  function getCityWeather(lat, lon) {
    // format the github api url
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=e0090736d1a7d7d3d3989801cd196bfa"
    console.log(weatherApiUrl)
    // make a request to the url
    fetch(weatherApiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var currentData = data.current;
        var dailyData = data.daily;
        console.log(currentData, dailyData)
        displayWeather(currentData, dailyData)
      });
  }
};

function displayWeather(currentData, dailyData) {
  $("#daily-weather").text("")
  //create children for current info card
  var cardBodyEl = $("#daily-weather")
  cardBodyEl.append(cityInput.value.trim())
  
  cityInput.value = '';

  //create and append icon
  var iconCode = currentData.weather[0].icon;
  var iconLocation = "./assets/images/" + iconCode + ".png";
  var currentCloudEl = $("<img>")
    .addClass("current-icon")
    .attr("src", iconLocation);
  cardBodyEl.append(currentCloudEl);
  //create and append temperature
  var currentTempEl = $("<p>").text("Temperature: " + currentData.temp + " °F");
  cardBodyEl.append(currentTempEl);
  //create and append wind speed
  var currentWindEl = $("<p>").text("Wind: " + currentData.wind_speed + " MPH");
  cardBodyEl.append(currentWindEl);
  //create and append humidity
  var currentHumidityEl = $("<p>").text(
    "Humidity: " + currentData.humidity + "%"
  );
  cardBodyEl.append(currentHumidityEl);
  //create and append uvi
  var currentUviEl = $("<p>").text("UV Index: ");
  var uviSpanEl = $("<span>").text(currentData.uvi);
  if (currentData.uvi < 3.33) {
    uviSpanEl.addClass('favorable');
  } else if (currentData.uvi > 6.66) {
    uviSpanEl.addClass('severe');
  } else {
    uviSpanEl.addClass('moderate');
  }
  currentUviEl.append(uviSpanEl);
  cardBodyEl.append(currentUviEl);

  //create the header for the future container
  $("#future-header").text("5-Day Forecast:");
  // empty card container
  $("#card-container").text("");
  //create cards for the next 5 days
  for (var i = 1; i < 6; i++) {
    dayData = dailyData[i];
    var cardContainerEl = $("#card-container");
    var dayCardEl = $("<div>").addClass("card");
    var dayCardBodyEl = $("<div>").addClass("card-body");
    //add title for date
    var cardTitleEl = $("<h4>")
      .addClass("card-title")
      .text(moment().add(i, "days").format("MM[/]DD[/]YY"));
    dayCardBodyEl.append(cardTitleEl);
    //add weather icon
    var iconCode = dayData.weather[0].icon;
    var iconLocation = "./assets/images/" + iconCode + ".png";
    var dayCloudEl = $("<img>")
      .addClass("card-icon card-text")
      .attr("src", iconLocation);
    dayCardBodyEl.append(dayCloudEl);
    //add card text for temp
    var dayTempEl = $("<p>")
      .addClass("card-text")
      .text("Temp: " + dayData.temp.day + " °F");
    dayCardBodyEl.append(dayTempEl);
    //add card text for wind_speed
    var dayWindEl = $("<p>")
      .addClass("card-text")
      .text("Wind: " + dayData.wind_speed + " MPH");
    dayCardBodyEl.append(dayWindEl);
    //add card text for humidity
    var dayHumidityEl = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + dayData.humidity + "%");
    dayCardBodyEl.append(dayHumidityEl);
    //append the whole card
    dayCardEl.append(dayCardBodyEl);
    cardContainerEl.append(dayCardEl);
  }
}



weatherForm.addEventListener("submit", formSubmitHandler);
