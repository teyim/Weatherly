
const openSearchModalBtn=document.getElementById('locateBtn');
const searchBox=document.getElementById('search-box');
const cancelBtn=document.getElementById('cancelmodalbtn');
const currentWeatherLocation=document.querySelector('#current h1');
const currentDate=document.querySelector('#current h2');
const currentweatherIcon=document.querySelector('.inner img');
const currentTemperature=document.querySelector('.temp');
const apikey="f3327a7a39577399fb4fa2aaa5db87cc";
const currentWeatherConditions=document.querySelector('.conditions');
const textbox=document.getElementById('textbox');
const searchBtn=document.getElementById('searchBtn');
const loadingModal=document.getElementById('loadingmodal');
const wind=document.querySelector('.wind');
const humidity=document.querySelector('.humidity');
const pressure=document.querySelector('.pressure');
const forcastDomList=document.getElementById('future');
let mainWeatherIcon;
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const  today  = new Date();
const date=today.toLocaleDateString("en-US", options);
const forCastDate=today.toISOString().slice(0,10);



function controlModal(text,DomEl) {
    if (text==="open") {
       DomEl.classList.remove('hide');
    }
    else
    {
        DomEl.classList.add('hide');   
    }
}
openSearchModalBtn.addEventListener('click',()=>{
    togglemodal(searchBox);
    })
    cancelBtn.addEventListener('click',()=>{
        togglemodal(searchBox);  
    })
    function togglemodal(domElement)
    {
    domElement.classList.toggle('hide');
    }
   
function trackUser() {
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
              alert("Location does not exist.enter another location or check!! to make sure you entered the location name correctly");
              controlModal('close',loadingModal);
          }
         
      }).catch(error=>{
        alert("please connect to internet and try again");
        controlModal('close',loadingModal);
      });
    }
    window.addEventListener('load',()=>{
    fecthCurrentUserWeatherData();
    })
   
   
    
    function updateUi(userweather,forcastData) {
        const tempINFaraheit=parseInt(userweather.main.temp);
        const variable=273.15;
       const celsius=(tempINFaraheit-variable);
      const  roundCelsius= Math.round(celsius);
        currentWeatherLocation.innerHTML=`${userweather.name},${userweather.sys.country}`;
            currentTemperature.innerHTML=`${userweather.main.temp}K | ${roundCelsius}°c`;
            currentWeatherConditions.innerHTML=`${userweather.weather[0].description}`;
            currentDate.innerHTML=`${date}`; 
            wind.innerHTML=`Wind Speed : ${userweather.wind.speed} Mph`;
            humidity.innerHTML=`Humidity : ${userweather.main.humidity} %`;
            pressure.innerHTML=`Pressure  : ${userweather.main.pressure} Pa`;
            const forcastDataArray=[];
            forcastData.list.forEach(element => {
                forcastDataArray.push(element);
            });
            const forcastWeatherInfo=[];
           for (let index = 0; index < forcastDataArray.length; index+=8) {
               const temp={};
                    temp.date=forcastDataArray[index].dt_txt,
                    temp.description=forcastDataArray[index].weather[0].description,
                    temp.max=forcastDataArray[index].main.temp_max,
                     temp.min=forcastDataArray[index].main.temp_min
                     if (temp.description===("overcast clouds")) {
                         temp.weatherIcon="./images/cloud.svg"
                     }
                     else if (temp.description===("broken clouds")||temp.description===("scattered clouds")||temp.description===("few clouds")) {
                        temp.weatherIcon="./images/partly_cloudy_day.svg"
                     }
                     else if (temp.description===("light rain")||temp.description===('moderate rain')) {
                        temp.weatherIcon="./images/rain.svg" 
                     }
                     else if (temp.description===("clear sky")) {
                        temp.weatherIcon="./images/sun.svg"
                     }
                     else if (temp.description===('snow')) {
                        temp.weatherIcon="./images/snow.svg"
                       
                     }
                     else if (temp.description===('storm')) {
                        temp.weatherIcon="./images/storm.svg"
                     }
                    
                     forcastWeatherInfo.push(temp);
                     
           }
           currentweatherIcon.src=forcastWeatherInfo[0].weatherIcon;
           forcastDomList.innerHTML="";
        forcastWeatherInfo.forEach(el=>{
            const domElement=document.createElement('div');
            domElement.classList.add('container');
            domElement.innerHTML=`
			<h3 class="day">${el.date.substring(0,10)}</h3>
			<div class="weatherIcon">
				<div class="partlycloudy">
					<div class="inner"><img src=${el.weatherIcon} alt="image" ></div>
				</div>
			</div>
			<p class="conditions">${el.description}</p>
			<p class="tempRange"><span class="high">${Math.round(el.max-273.15)}°c</span> | <span class="low">${Math.floor(el.min-273.15)}°c</span></p>
        `;
        forcastDomList.appendChild(domElement);
        })
    }


    async function fecthCurrentUserWeatherData() {
        let userposition;

        try {
           controlModal('open',loadingModal);
            userposition=await trackUser();
            Promise.all([sendHttpRequest(`https://api.openweathermap.org/data/2.5/weather?lat=${userposition.coords.latitude}&lon=${userposition.coords.longitude}&appid=${apikey}`),sendHttpRequest(`https://api.openweathermap.org/data/2.5/forecast?lat=${userposition.coords.latitude}&lon=${userposition.coords.longitude}&appid=${apikey}`)]).then(promiseData=>{
            updateUi(promiseData[0],promiseData[1]);
            controlModal('close',loadingModal);
        })
        } catch (error) {
            showStatusBar("An Error occured");
        }
    }
   function fechWeatherData() {
    try {
        controlModal('open',loadingModal); 
        Promise.all([sendHttpRequest(`https://api.openweathermap.org/data/2.5/weather?q=${textbox.value}&appid=${apikey}`),sendHttpRequest(`https://api.openweathermap.org/data/2.5/forecast?q=${textbox.value}&appid=${apikey}`)]).then(promiseData=>{
            updateUi(promiseData[0],promiseData[1]);
            controlModal('close',loadingModal);
          }) 
        }catch (error) {
            showStatusBar("An Error occured");
          }   
        
    }
    searchBtn.addEventListener('click',event=>{
    event.preventDefault();
    if (textbox.value!=="") {
        togglemodal(searchBox);  
        fechWeatherData();
        textbox.value="";  
    }
    else
    {
        alert('please enter country name');
    }
    }) 
    
