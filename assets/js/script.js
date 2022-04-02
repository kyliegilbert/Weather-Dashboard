var cityFormEl=document.querySelector("#city-form");
console.log(cityFormEl)

//var requestUrl ='https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}'

//var todayDate = moment().format("DD/M/YYYY");
//console.log (todayDate)


//collect city
function handleSearchForm(event) {
    event.preventDefault();

    var cityInputVal = document.querySelector(".city-input").value;  
    console.log(cityInputVal)

    if (!cityInputVal) {
      console.error('You need a search input value!');
      return;
    }
      
    var queryString = './search-results.html?q=' + cityInputVal;
      
    location.assign(queryString);

}




cityFormEl.addEventListener('submit', handleSearchForm);
