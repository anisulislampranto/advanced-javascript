

document.getElementById("search-button").onclick = function () {
    const searchInput = document.getElementById("search-input").value;

    if (searchInput == "" || searchInput == " ") {

        const detailsArea = document.getElementById('details-area')
        detailsArea.innerHTML = `
                <h1 class="invalid-Input" >Sorry! Invalid Input.</h1>
            `

    }
    else {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
            .then(res => res.json())
            .then(data => displayMeals(data.meals))

    }

}

const displayMeals = meals => {
    const searchedMeals = document.getElementById('searched-meals')
    meals.forEach(meal => {
        const mealdDiv = document.createElement('div');
        mealdDiv.className = 'meal'

        const mealInfo = `
        <img onclick="details(${meal.idMeal})" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
        `;

        mealdDiv.innerHTML = mealInfo;
        searchedMeals.appendChild(mealdDiv);
    });
}
const details = id => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => showDetails(data.meals[0]))

}

const showDetails = details => {
    console.log(details);
    const detailsArea = document.getElementById('details-area')
    detailsArea.innerHTML = `
        <div class="namePicture" >
        <h1> ${details.strMeal} </h1>
        <img src="${details.strMealThumb}" alt="">
        </div>
        
        <div class="ingredients" >
        <p> Ingredients </p>

        <ul class="ingredients-section" > 

        <li>${details.strIngredient1}</li> 
        <li>${details.strIngredient2}</li> 
        <li>${details.strIngredient3}</li> 
        <li>${details.strIngredient4}</li> 
        <li>${details.strIngredient5}</li> 
        <li>${details.strIngredient6}</li> 
        <li>${details.strIngredient7}</li> 
        <li>${details.strIngredient8}</li> 
        <li>${details.strIngredient9}</li> 
        <li>${details.strIngredient10}</li> 
        <li>${details.strIngredient11}</li> 
        <li>${details.strIngredient12}</li> 
        <li>${details.strIngredient13}</li> 
        <li>${details.strIngredient14}</li> 
        <li>${details.strIngredient15}</li> 
        <li>${details.strIngredient16}</li> 
        <li>${details.strIngredient17}</li> 
        <li>${details.strIngredient18}</li> 
        <li>${details.strIngredient19}</li> 
        <li>${details.strIngredient20}</li> 

        </ul> 

        </div>

    `
}







