const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const popularCities = ['London', 'New York', 'Buenos Aires', 'Tokyo', 'Addis Ababa', 'Liverpool'];

const titleDivEL = document.querySelector('.title-div');
const dateEL = document.querySelector(".date-div");
const searchingEL = document.getElementById("searching");
const containerEL = document.querySelector('.example-container');

searchingEL.addEventListener("submit", searching);

function writingDate(){
    const date = new Date();
    console.log(date);
    let output = `<p>${weekday[date.getDay()-1]}, ${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}</p>`
    dateEL.innerHTML = output;
}
writingDate();

const apiKey = '7c6d0adfdcba86dcedd7b766663a03a5';

async function displayExample(){
    try{
        const promises = popularCities.map(city => 
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
                .then(res => res.json())
            );

        const results = await Promise.all(promises);

        results.forEach(data => {
            const article = document.createElement('article');
            article.classList.add("example");
            article.innerHTML = `
                <h3>${data.name} - ${data.main.temp}°C</h3>
                <p>${data.main.temp_min}°C (min) / ${data.main.temp_max}°C (max)</p>
            `;

            article.addEventListener('click', () => {
                document.getElementById('search').value = data.name;
                searchingEL.dispatchEvent(new Event('submit' , {bubbles:true}));
            });

            containerEL.appendChild(article);
        });

    } catch(error) {
        console.log('Error:', error);
    }
}
displayExample();

async function searching(e){
    e.preventDefault();

    const searchEL = document.getElementById("search").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchEL}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temp').textContent = `${data.main.temp}°C`;
        document.getElementById('temp-range').textContent = `${data.main.temp_min}°C (min) / ${data.main.temp_max}°C (max)`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity-wind').textContent = `Humidity: ${data.main.humidity}% / Wind: ${data.wind.speed} m/s`;

        document.querySelector('.weather-output').style.display = 'block';
        titleDivEL.style.display = 'none';

        const bg = getBackground(data.weather[0].description);
        document.body.style.backgroundImage = `url('images/${bg}')`;
        

    } catch(error) {
        console.log('Error:', error);
    }
}

function getBackground(description){
    if(description.includes('thunderstorm')) return 'thunderstorm.jpg';
    if(description.includes('drizzle'))      return 'drizzle.jpg';
    if(description.includes('rain'))         return 'rain.jpg';
    if(description.includes('snow'))         return 'snow.jpg';
    if(description.includes('clear'))        return 'clear.jpg';
    if(description.includes('cloud'))        return 'cloudy.jpg';
    return 'default.jpg';
}
