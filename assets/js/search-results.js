var formInputEl = document.querySelector("#city-form")
var currentCity=document.querySelector("#current-city")


var Search = [];

//collects the first search parameter out of the URL
function getParams() {
    // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
    var searchParams = document.location.search.split('=').pop();
    console.log(searchParams)
    
    saveFirstSearch(searchParams)
    searchApi(searchParams);
}

//Search for data from open weathermap API

function searchApi(searchParams) {
    
    var requestUrl ='https://api.openweathermap.org/data/2.5/weather';
    
    requestUrl = requestUrl + '?q=' + searchParams + '&appid=76cee6a71bbc1d723e4c1fa7b8084ebe';
    console.log(requestUrl)
    fetch(requestUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
        // write query to page so user knows what they are viewing
        console.log(locRes);
        searchUVApi(locRes);
      })
    
}

//Searches the onecall weather api from openweathermap
function searchUVApi(currentWeatherRes){

    var cityName = currentWeatherRes.name

    var longitude = currentWeatherRes.coord.lon
    
    var latitude = currentWeatherRes.coord.lat
    
    var UvrequestUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    UvrequestUrl = UvrequestUrl + '?lat=' + latitude + '&lon=' + longitude + '&exlude=current,minutely,hourly,alerts&appid=76cee6a71bbc1d723e4c1fa7b8084ebe'

    fetch(UvrequestUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
        // write query to page so user knows what they are viewing
        
        printResults(locRes);
        var spanEl=document.createElement('span')
        var iconVal = locRes.current.weather[0].icon
        var imgEl = document.createElement('img')
        imgEl.src = 'http://openweathermap.org/img/wn/'+ iconVal +'@2x.png'
        spanEl.append(imgEl)
        currentCity.textContent = cityName + ' ' + moment.unix(locRes.current.dt).format('DD/MM/YYYY') + ' ';
        currentCity.append(spanEl)
      })

}
//find daily weather and render to screen
function printResults(locRes){
    //print Temp, Humidity, Wind ,UV
    clearResultDisplay()
    
    var currentWeather = document.querySelector("#current-weather-results")
    var h3TempEl = document.createElement("h3")
    h3TempEl.innerHTML = '<strong>Temp: </strong> ' + locRes.current.temp + ' F <br/>';
    
    var h3WindEl = document.createElement("h3")
    h3WindEl.innerHTML = '<strong>Wind: </strong> ' + locRes.current.wind_speed + ' m/s <br/>';
    
    var h3Humidity = document.createElement("h3")
    h3Humidity.innerHTML = '<strong>Humidity: </strong> ' + locRes.current.humidity + ' % <br/>';

    var h3UVEl = document.createElement("h3")
    h3UVEl.innerHTML = '<strong>UV index: </strong> ' + locRes.current.uvi + '<br/>';
    currentWeather.append(h3TempEl, h3WindEl, h3Humidity, h3UVEl )

    printFiveDayResults(locRes)


}
//find 5 day forcast and remder to screen
function printFiveDayResults(locRes) {
    clearFiveDayResults()
    var fiveDayWeatherDiv = document.querySelector(".five-day-weather")
    for (i=1;i<=5;i++){
        var div = document.createElement('div')
        div.classList.add('card', 'small')
        //creating date from unix value
        var date = moment.unix(locRes.daily[i].dt).format('DD/MM/YYYY')
        // console.log(date)
        var h5 = document.createElement('h5')
        h5.innerHTML = '<strong>Date: </strong>' + date + '<br/>';
        var pTemp = document.createElement('p')
        //adding icon to heading
        var spanEl=document.createElement('span')
        var iconVal = locRes.daily[i].weather[0].icon
        var imgEl = document.createElement('img')
        imgEl.src = 'http://openweathermap.org/img/wn/'+ iconVal +'@2x.png'
        spanEl.append(imgEl)
        h5.append(spanEl)
        //Adding weather information to cards
        pTemp.innerHTML = 'Temp: ' + locRes.daily[i].temp.day + 'F <br/>';
        var pWind = document.createElement('p')
        pWind.innerHTML = 'Wind: ' + locRes.daily[i].wind_speed + 'm/s <br/>';
        var pHumidity = document.createElement('p')
        pHumidity.innerHTML = 'Humidity: ' + locRes.daily[i].humidity + '% <br/>';
        var pUv = document.createElement('p')
        pUv.innerHTML = 'UV index: ' + locRes.daily[i].uvi + '<br/>';
        //appending information to weather card
        div.append(h5, pTemp, pWind, pHumidity, pUv)
        fiveDayWeatherDiv.append(div)


    }
}

//clears display of the previous current weather results ready for new results
function clearResultDisplay() {
    var currentWeather = document.querySelector("#current-weather-results")
    while(currentWeather.firstChild){
        currentWeather.removeChild(currentWeather.firstChild)
    }


}

//clears the previous 5 day weather forcast results ready for new results
function clearFiveDayResults(){
    var fiveDayResultsEl = document.querySelector(".five-day-weather")
    while(fiveDayResultsEl.firstChild){
        fiveDayResultsEl.removeChild(fiveDayResultsEl.firstChild)
    }

}

//saves the first search into local storage
function saveFirstSearch(searchParams){

    // Get stored list of searches from localStorage
    var oldSearch = []
    console.log(searchParams)
    console.log(JSON.parse(localStorage.getItem("Search")))
    oldSearch = JSON.parse(localStorage.getItem("Search"));
    
    console.log(oldSearch)
  
    // If searches were retrieved from localStorage, update the search list array to it
    if (oldSearch === null) {
        Search[0]=searchParams
        localStorage.setItem("Search", JSON.stringify(Search))
        console.log(JSON.stringify(searchParams))

        displaySearch()
       
       
    }
}



//if the Search button is pressed it will search for the new city and then saves it into local storage
formInputEl.addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    var formInputVal = document.querySelector(".city-input").value;  
    console.log(formInputVal)
    
    if (!formInputVal) {
          return;
    }
    var oldSearch = []   
    oldSearch = JSON.parse(localStorage.getItem("Search"));
    console.log(oldSearch)
    
    if (oldSearch.includes(formInputVal)) {
        console.log(oldSearch.includes(formInputVal))
        
    }else{
         oldSearch.push(formInputVal)
        localStorage.setItem("Search", JSON.stringify(oldSearch))
        displaySearch()
        
    }
   searchApi(formInputVal)
    
})
    
    
//Displays the searches that have previously been performed
function displaySearch(){
    clearSearchDisplay()
    var storedSearch = JSON.parse(localStorage.getItem("Search"));
    
    console.log(storedSearch)
    console.log(storedSearch.length)
    
    for(i=0;i<storedSearch.length;i++) {
        var list = document.querySelector(".city-list")
        var aEl=document.createElement("a")
        aEl.textContent = storedSearch[i];
        
        aEl.setAttribute("class", "btn")
        aEl.setAttribute("id", "stored-search")
        list.appendChild(aEl);
    }
    

}

//Clears the search buttons
function clearSearchDisplay(){
    var list = document.querySelector(".city-list")
    while(list.firstChild){
        list.removeChild(list.firstChild)
    }

}

function previousSearch(){
    var previousSearchCity = document.querySelector(".city-list")
    console.log(previousSearchCity)
    if (!previousSearchCity){
        console.log ("no cities to Search")
    } else{
        previousSearchCity.addEventListener('click', function(event){
            
            console.log(previousSearchCity)
            console.log(event.target)
            console.log(event.target.innerHTML)
            var prevSearch = event.target.innerHTML
            searchApi(prevSearch)

        
        })
        

    }
}

// previousSearchCity.addEventListener('submit', function(event){
//     event.preventDefault
//     console.log(event.target)

// })

getParams()
displaySearch()
previousSearch()




//question 1: getting melbourne australia just using the city name?
//question 2: should the inforamtion of a previous search be stored into the local storage? Or do you just perform the seach again