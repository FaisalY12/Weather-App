window.addEventListener('load', ()=> {
    let long;
    let lat;
    const apiKey ='9d6f3d2936a5d23c5a2086c6ba0dad20';

    const temperatureDescritpion = document.querySelector('.temperature-description');
    const temperatureDegree = document.querySelector('.temperature-degree');
    const locationTimeZone = document.querySelector('.location-timezone');
   

    // adds data from API to DOM elements 
    function renderResponse(data) {
        const { temp } = data.main;
        const { description, icon, id } = data.weather[0];
        const name = data.name;
    
        temperatureDescritpion.textContent = description;
        temperatureDegree.textContent =temp;
        locationTimeZone.textContent = name;
        setIcons(id); 
        
    }
   
    // retrieve data for current location
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const api =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
            
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE){
                    console.log(xhr.response);
                    renderResponse(xhr.response);
                }
            };

            xhr.open('GET', api)
            xhr.send();

        }, (error) => {
        locationTimeZone.textContent = `Oops! \n ${error.message}`;
        console.log(error);
    });
}


    
    // function sets skycon animated weather icon based on the weather id from the OpenWeather API

    function setIcons(id) {
        const skycons = new Skycons({color: "white"});
        if (id === 800) {
            skycons.color= "yellow";
            skycons.add("icon1", Skycons.CLEAR_DAY);
            skycons.play();
        }
        else if (id > 800) {
            skycons.add("icon1", Skycons.CLOUDY);
            skycons.play();
        }
        else if (id >= 700) {
            skycons.add("icon1", Skycons.FOG);
            skycons.play();
        }
        else if (id >= 612) {
            skycons.add("icon1", Skycons.RAIN_SNOW);
            skycons.play();
        }
        else if (id === 611) {
            skycons.add("icon1", Skycons.SLEET);
            skycons.play();
        }
        else if (id >= 600 && id <= 602) {
            skycons.add("icon1", Skycons.SNOW);
            skycons.play();
        }
        else if (id >= 500) {
            skycons.add("icon1", Skycons.RAIN);
            skycons.play();
        } 
        else if (id >= 300) {
            skycons.add("icon1", Skycons.RAIN);  // no drizzle icon with skycon
            skycons.play();
        } 
        else if ( (id >= 200 && id <= 202) || (id >= 230 ) ){
            skycons.add("icon1", Skycons.THUNDER_RAIN);
            skycons.play();
        }
        else if (id >= 210 && id <= 221) {
            skycons.add("icon1", Skycons.THUNDER);
            skycons.play();
        }        
           
    };
    // added functionality to allow looking up weather in different cities

    const inputField= document.querySelector('#input');  
    const form= document.querySelector('form'); 
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const cityName = inputField.value;
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        inputField.value = '';

        fetch(api)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
               renderResponse(data)
            })
            .catch( networkError => {
                locationTimeZone.textContent = networkError.message;
            });
    });

});


