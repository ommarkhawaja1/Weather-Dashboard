var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=e0090736d1a7d7d3d3989801cd196bfa"
var weatherForm = document.querySelector("#weather-form");
var cityInput = document.querySelector("#city");
var existingEntries = JSON.parse(localStorage.getItem("allEntries")) || [];
var existingCity = []


var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var city = cityInput.value.trim()

  if (city) {
    searchCity(city);
    saveCity(city)
  }

  else if (handleSearchHistoryClick) {
  }

  else {
    alert("Please enter a city name")
  }
};

var searchCity = function (city) {
  // format the github api url
  var locationApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=e0090736d1a7d7d3d3989801cd196bfa"

  // make a request to the url
  fetch(locationApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      console.log(lat, lon)
      getCityWeather(lat, lon, city);
    });


  function getCityWeather(lat, lon, city) {
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
        displayWeather(currentData, dailyData, city)
      });
  }
};

function displayWeather(currentData, dailyData, city) {
  $("#daily-weather").text("")
  //create children for current info card
  var cardBodyEl = $("#daily-weather")
  cardBodyEl.append(city)

  cityInput.value = '';

  //create and append icon
  var iconCode = currentData.weather[0].icon;
  var iconLocation = "./assets/images/" + iconCode + ".png";
  var currentCloudEl = $("<img>")
    .addClass("current-icon")
    .attr("src", iconLocation);
  cardBodyEl.append(currentCloudEl);
  //create and append temperature
  var currentTempEl = $("<p>").text("Temperature: " + currentData.temp + " ??F");
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
      .text("Temp: " + dayData.temp.day + " ??F");
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

// Populate the citybuttons list
for (i = 0; i < existingEntries.length; i++) {
  existingCity[i] = document.createElement("button")
  existingCity[i].innerHTML = existingEntries[i]
  existingCity[i].setAttribute('class', 'city-button btn btn-secondary btn-block')
  existingCity[i].setAttribute('data-searchterm', existingEntries[i])
  weatherForm.appendChild(existingCity[i])
}

//save the city to the citybuttons list 
function saveCity(city) {
  if (!existingEntries.includes(city)) {
    existingEntries.push(city)
    localStorage.setItem("allEntries", JSON.stringify(existingEntries));
    var newCityButton = document.createElement("button")
    newCityButton.setAttribute('class', 'city-button btn btn-secondary btn-block')
    newCityButton.setAttribute('data-searchterm', city)
    newCityButton.innerHTML = city
    weatherForm.appendChild(newCityButton)
  }
}

//transforms user's click on the citybutton into a value that can be passed to getapi function
function handleSearchHistoryClick(event) {
  if (event.target.matches('.city-button')) {
    var button = event.target;
    var searchTerm = button.getAttribute('data-searchterm');
    searchCity(searchTerm);
  }
}

var cityButtons = document.querySelectorAll('.city-button')
cityButtons.forEach(function (currentBtn) {
  currentBtn.addEventListener('click', handleSearchHistoryClick)
})

weatherForm.addEventListener("submit", formSubmitHandler);
