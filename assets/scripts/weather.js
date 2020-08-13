const currentUserTemp=document.getElementById('currentUsertTempearture');
const currentUserWeatherInfo=document.getElementById('currentWeatherInfo');
const currentUserLocation=document.getElementById('currentUserLocation');
const apikey="f3327a7a39577399fb4fa2aaa5db87cc";
const searchLocationBtn=document.getElementById('searchBtn');
const textbox=document.getElementById('textbox');
const body=document.querySelector('body');
const renderedContent=document.getElementById('renderedbody');
const weatherIcon=document.getElementById('wicon');
const weatherIcon1=document.getElementById('user-weather-icon');
const modalBtn=document.getElementById('confirm');
const modal=document.querySelector('.loadmodal');
const viewportHeight=window.visualViewport.height;
  window.addEventListener('resize', () => {
  if ( window.innerHeight <viewportHeight) {
    const metaViewport = document.querySelector("meta[name=viewport]")
    document.documentElement.style.setProperty("overflow", "auto")
    metaViewport.setAttribute("content", "height=" + viewportHeight + "px, width=device-width, initial-scale=1.0");
  } 
  });

function trackUser() {
alert('searching your location');
   const promise=new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(position=>{
       resolve(position);
    },error=>{
        reject(error);
    });
   })
    return promise;
}
function sendHttpRequest(url) {
  return fetch(url).then(response=>{
      if (response.status>=200&&response.status<300) {
        return response.json();
      }
      else
      {
          alert('Location does not exist.enter another location or check!! to make sure you entered the location name correctly');
      }
     
  }).catch(error=>{
    alert('please connet your internet and try again');
  });
}
window.addEventListener('load',()=>{
fecthCurrentUserWeatherData();
})
let user;
async function fecthCurrentUserWeatherData() {
    let userposition;
    let userweather;
    try {
        const userposition=await trackUser();
        const userweather=await sendHttpRequest(`https://api.openweathermap.org/data/2.5/weather?lat=${userposition.coords.latitude}&lon=${userposition.coords.longitude}&appid=${apikey}`);
        const iconcode = userweather.weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        weatherIcon1.setAttribute('src',iconurl);
          currentUserLocation.innerHTML=`${userweather.name},${userweather.sys.country}`;
          currentUserTemp.innerHTML=`${userweather.main.temp}F`;
          currentUserWeatherInfo.innerHTML=`${userweather.weather[0].description}`
    } catch (error) {
        throw new Error(error);
    }
}
function fechWeatherData() {
    let searcLocation=textbox.value;
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    const dateNumber=d.getDate().toString();
    const dayName = days[d.getDay()];
    const forcastDays=[];
    let forCast=[];
    const men ="hello";
    Promise.all([sendHttpRequest(`https://api.openweathermap.org/data/2.5/weather?q=${searcLocation}&appid=${apikey}`),sendHttpRequest(`https://api.openweathermap.org/data/2.5/forecast?q=${searcLocation}&appid=${apikey}`)]).then(promiseData=>{
      try {
        const iconcode = promiseData[0].weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        weatherIcon.setAttribute('src',iconurl);
         document.querySelector('#country-name').textContent=`${promiseData[0].name},${promiseData[0].sys.country}`;
         document.querySelector('#searchLocationTemp').textContent=`${promiseData[0].main.temp}F`;
         document.querySelector('#searchLocationinfo').textContent=`${promiseData[0].weather[0].description}`;
         document.querySelector('#searchLocationDate').textContent=`${dayName} ${dateNumber}`;
         document.querySelector('#windspeed').textContent=`Wind Speed : ${promiseData[0].wind.speed} Mph`;
         document.querySelector('#humidity').textContent=`Humidity : ${promiseData[0].main.humidity} %`;
         document.querySelector('#pressure').textContent=`Pressure  : ${promiseData[0].main.pressure} Pa`;
         document.querySelector('#sealevel').textContent=`Sea level : ${promiseData[0].main.sea_level} m`;
         renderedContent.style.display="block";
      } catch (error) {
          throw new Error(error);
      }    
   
    })
       
        
   
}
searchLocationBtn.addEventListener('click',event=>{
event.preventDefault();
if (textbox.value!=="") {
    fechWeatherData();
    textbox.value="";
}
else
{
    alert('please enter country name');
}
})
modalBtn.addEventListener('click',()=>{
modal.style.display="none";
})