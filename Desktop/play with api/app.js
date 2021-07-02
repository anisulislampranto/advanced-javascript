fetch('https://restcountries.eu/rest/v2/all')
    .then(data => data.json())
    .then(data => displayCountries(data));

const displayCountries = countries => {
    const countriesDiv = document.getElementById('countries');

    countries.forEach(country => {

        const countryDiv = document.createElement('div');
        countryDiv.className = `country`;

        const countryInfo = `
            <h3 class= "country-name"  > ${country.name} </h3>
            <p> ${country.capital} </p> 
            <button onclick="displayCountryDetails('${country.name}')" >Details</button>

        `

        countryDiv.innerHTML = countryInfo;
        countriesDiv.appendChild(countryDiv);




    });

}

const displayCountryDetails = name => {
    const URL = `https://restcountries.eu/rest/v2/name/${name}
    `
    fetch(URL)
        .then(res => res.json())
        .then(data => randerCountryInfo(data[0]))
}

const randerCountryInfo = country => {
    const countryDiv = document.getElementById('countryDetails');
    countryDiv.innerHTML =`
        <h1>Name:${country.name}</h1>
        <p>Populaton:${country.population}</p>
        <p>Area:${country.area}</P>
        <img src="${country.flag}" alt="">
    `
}




