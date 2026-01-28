let inputCity=document.querySelector("input");
let weatherIcon=document.querySelector("#icon");
let temperature=document.getElementById("temp");
let weatherMsg=document.getElementById("weather-description");
let cityName=document.querySelector("#city");
let infoFields=document.querySelectorAll(".info .data");
let currDate=document.getElementById("date");
let currTime=document.getElementById("time");
let currDay=document.getElementById("day");

const key="141a692e11234842295d9e8e54866001";

const validateCity=(cityValue)=>{

    if (!/^[a-zA-Z\s]+$/.test(cityValue)) {
        alert("Please enter a valid city name (only letters).");
        inputCity.value = "";
        inputCity.focus();
        cityName.innerText="Your City";
        return;
    }
}

const showData=async (cityValue) => {
    
    const URL=`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;

    let response=await fetch(URL);
    let data=await response.json();

    if (data.cod === "404") {
        alert("City not found! Please enter a valid city name.");
        inputCity.value = "";
        return;
    }

    cityName.innerText=`${data.name}`;

    let iconCode=data.weather[0].icon;
    let iconURL=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    temperature.innerText=`${data.main.temp} \u00B0C`;
    weatherMsg.innerText=`${data.weather[0].description}`;
    weatherIcon.src=iconURL;

    infoFields[0].innerText = `${(data.wind.speed * 3.6).toFixed(2)} km/hr`;
    infoFields[1].innerText=`${data.main.humidity} %`;
    infoFields[2].innerText=`${data.main.feels_like} \u00B0C`;
    infoFields[3].innerText=`${data.visibility/1000} km`;
    infoFields[4].innerText=`${data.main.pressure} mb`;
    infoFields[5].innerText=`${data.main.temp_min} \u00B0C`;
    infoFields[6].innerText=`${data.main.temp_max} \u00B0C`;

    let sunriseDate=new Date(data.sys.sunrise*1000);
    let sunsetDate=new Date(data.sys.sunset*1000);

    let options={hour:'2-digit',minute:'2-digit'};

    let sunriseTime=sunriseDate.toLocaleTimeString('en-US',options);
    let sunsetTime=sunsetDate.toLocaleTimeString('en-US',options);

    infoFields[7].innerText=`${sunriseTime}`;
    infoFields[8].innerText=`${sunsetTime}`;

    let localtime=new Date((data.dt+data.timezone)*1000);

    let now = new Date();
    let utc = now.getTime() + now.getTimezoneOffset() * 60000;
    let cityTimeMs = utc + data.timezone * 1000;
    let cityDate = new Date(cityTimeMs);
    
    let timeoptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    let formattedTime = cityDate.toLocaleTimeString('en-US', timeoptions);
    let optionsDay={weekday:'long'};
    let day=localtime.toLocaleDateString('en-US',optionsDay);

    let dayNum=localtime.getUTCDate();
    let monthName=localtime.toLocaleString('en-US',{month:'long'});
    let year=localtime.getUTCFullYear();

    let formattedDate=`${dayNum}-${monthName}-${year}`;

    currDate.innerText=`${formattedDate}`;
    currDay.innerText=`${day},`;
    currTime.innerText=`${formattedTime}`;
}

inputCity.addEventListener("change", async()=>{
    const typedCity=inputCity.value;
    validateCity(typedCity);
    showData(typedCity);
});

window.addEventListener("load",async () => {
    const defaultCity=cityName.innerText;
    validateCity(defaultCity);
    showData(defaultCity);
});