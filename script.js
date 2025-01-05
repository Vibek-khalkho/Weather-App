const cityinput =document.querySelector('.city-input')
const searchbtn = document.querySelector('.search-btn')
const apikey ='2e2c72e4de295767ba3da66c8433aa6c'

const weatherinfosection =document.querySelector('.weather-info')
const notfoundsection = document.querySelector('.not-found')
const searchcitysection = document.querySelector('.search-city')

const countrytxt = document.querySelector('.country-txt')
const temptxt = document.querySelector('.temp-txt')
const conditiontxt = document.querySelector('.condition-txt')
const humidityvaluetxt = document.querySelector('.humidity-value-txt')
const windvaluetxt = document.querySelector('.wind-value-txt')
const weathersummaryimg = document.querySelector('.weather-summary-img')
const currentdatetxt = document.querySelector('.current-date-txt');
const forecastitemscontainer = document.querySelector('.forecast-items-container')



searchbtn.addEventListener('click',() =>{
    if(cityinput.value.trim() != "") {
    updateweatherinfo(cityinput.value)
    cityinput.value = ""
    cityinput.blur()
}
})
cityinput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
    cityinput.value.trim() != ""
    ){
        updateweatherinfo(cityinput.value)
        cityinput.value = ""
        cityinput.blur()
    }
})

async function getfetchdata(endpoint,city){
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}`;
    

    const response = await fetch(apiurl)
    return response.json()
}
function getweathericon(id){
    if (id <= 232) return 'thunderstorm.svg';
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}
function getcurrentdate(){
    const currentdate  = new Date()
    const options ={
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    }
    return currentdate.toLocaleDateString('en-GB',options)
   
}

async function updateweatherinfo(city) {
    const weatherdata = await getfetchdata('weather', city)
    if(weatherdata.cod != 200){
        showdisplaysection(notfoundsection)
        console.log(weatherdata)
        return
    }
    const {
      name: country,
      main: {temp,humidity},
      weather:[{ id, main}],
      wind:{speed}

    } = weatherdata
    countrytxt.textContent = country 
    temptxt.textContent = Math.round(temp - 273.15) + " °C";
    conditiontxt.textContent = main
    
    humidityvaluetxt.textContent =  Math.round(humidity)  + "%"
    windvaluetxt.textContent =  Math.round(speed)  + " M/s"
    currentdatetxt.textContent = getcurrentdate()
    weathersummaryimg.src = `assets/weather/${getweathericon(id)}`

    await updateforecastsinfo(city)
    showdisplaysection(weatherinfosection)
    
}
 async function updateforecastsinfo(city){
    const forecastsdata = await getfetchdata('forecast',city)

    const timetaken = '12:00:00'
    const todaydate = new Date().toISOString().split('T')[0]

    forecastitemscontainer.innerHTML =""

    forecastsdata.list.forEach(forecastweather =>{
        if (forecastweather.dt_txt.includes(timetaken) && 
        !forecastweather.dt_txt.includes(todaydate)){
            
           updateforecastitems(forecastweather)
        }
    })
}
function updateforecastitems(weatherdata) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp },
    } = weatherdata;
    

    const datetaken = new Date(date);
    const dateoption = {
        day: '2-digit',
        month: 'short',
    };
    const dateresult = datetaken.toLocaleString('en-US', dateoption)

    const forecastitem = `
        <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
        <img src="assets/weather/${getweathericon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp - 273.15)}°C</h5>
        </div>
    `;

    forecastitemscontainer.insertAdjacentHTML('beforeend', forecastitem);
}


function showdisplaysection(section) {
    [weatherinfosection, searchcitysection, notfoundsection]
    .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}

// Array of background images
const images = [
    'assets/bg1.jfif',
    'assets/bg2.jfif',
    'assets/bg3.jfif', 
    'assets/bg4.jfif', 
    'assets/bg5.jfif', 
    'assets/bg6.jfif', 
    'assets/bg7.jfif', 
    'assets/bg.jpg', 
];

let currentIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length; // Loop back to the first image after the last one
}

setInterval(changeBackground, 6000);

changeBackground();
