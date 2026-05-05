const searchBtn = document.getElementById('searchBtn');
const userQuery = document.getElementById('userQuery');
const recipeContainer = document.getElementById('recipeContainer');
const loadingStatus = document.getElementById('loadingStatus');
const errorMessage = document.getElementById('errorMessage');

const categoriesLink = document.getElementById('categoriesLink');
const categoryDropdown = document.getElementById('categoryDropdown');
const countriesLink = document.getElementById('countriesLink');
const randomLink = document.getElementById('randomLink');
const homeLink = document.getElementById('homeLink');
const favoritesLink = document.getElementById('favoritesLink');
const filterOptions = document.getElementById('filterOptions');
const heroSection = document.querySelector('.hero-section');
const recipeModal = document.getElementById('recipeModal'); 

const mainSectionTitle = document.getElementById('mainSectionTitle');

// Favorites State (LocalStorage)
let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];

// --- API FUNCTIONS ---
async function fetchRecipes(url, titleText = "Today's Featured Recipes", isInitialLoad = false) {
    if (!isInitialLoad) {
        window.scrollTo(0, 0);
        recipeContainer.innerHTML = ''; 
        loadingStatus.style.display = 'block';
        if (heroSection) heroSection.style.display = 'none'; 
        filterOptions.style.display = 'none';
        recipeContainer.style.display = 'grid'; 
    }
    
    if (mainSectionTitle) {
        mainSectionTitle.innerText = titleText.toUpperCase();
        mainSectionTitle.style.display = 'block';
    }

    errorMessage.style.display = 'none';

    try {
        const response = await fetch(url);
        const data = await response.json();
        loadingStatus.style.display = 'none';

        if (data.meals) {
            displayRecipes(data.meals, isInitialLoad);
        } else if (!isInitialLoad) {
            errorMessage.style.display = 'block';
            if (mainSectionTitle) {
                mainSectionTitle.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Fetch error:", error);
        loadingStatus.style.display = 'none';
    }
}

function displayRecipes(meals, isInitialLoad = false) {
    if (!meals) return;
    
    if (!isInitialLoad && recipeContainer.innerHTML !== '') {
        recipeContainer.innerHTML = '';
    }

    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const isFav = favorites.some(fav => fav.id === meal.idMeal);
        
        recipeCard.innerHTML = `
            <div class="card-img-container">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <div class="tags">
                    <span>${meal.strCategory || 'General'}</span>
                    <span>${meal.strArea || 'Global'}</span>
                </div>
                <div class="card-buttons">
                    <button class="view-btn">View Full Recipe</button>
                    <button class="fav-btn" id="fav-${meal.idMeal}" onclick="event.stopPropagation(); toggleFavorite('${meal.idMeal}', '${meal.strMeal.replace(/'/g, "\\'")}', '${meal.strMealThumb}')">
                        ${isFav ? 'Saved' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        `;
        recipeCard.onclick = () => showRecipeDetails(meal.idMeal);
        recipeContainer.appendChild(recipeCard);
    });
}

async function showRecipeDetails(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const meal = data.meals[0];

        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
                ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
            }
        }

        const instructionBullets = meal.strInstructions
            .split(/\r?\n/)
            .filter(step => step.trim().length > 5) 
            .map(step => step.replace(/^\d+[\.\s\-]+/, '').trim());

        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="modal-img-container">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <h2 class="modal-title">${meal.strMeal}</h2>
            </div>
            <div class="modal-info">
                <h3>Ingredients:</h3>
                <ul class="ingredients-list">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <h3>Instructions:</h3>
                <ul class="instructions-bullets">
                    ${instructionBullets.map(step => `<li>${step}</li>`).join('')}
                </ul>
                <button class="video-btn" onclick="window.open('${meal.strYoutube}', '_blank')">
                    Watch on YouTube
                </button>
            </div>
        `;
        
        recipeModal.style.display = "block";
        document.body.style.overflow = "hidden"; 

        const modalContent = document.querySelector('.modal-content');
        if (modalContent) modalContent.scrollTop = 0;

    } catch (error) {
        console.error("Error loading details:", error);
    }
}

const closeModal = () => {
    recipeModal.style.display = "none";
    document.body.style.overflow = "auto"; 
};

document.querySelector('.close-btn').onclick = closeModal;
window.onclick = (event) => {
    if (event.target == recipeModal) closeModal();
};

async function fetchFilters(type) {
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?${type}=list`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (type === 'c') {
            renderDropdown(data.meals);
        } else {
            const sortedCountries = data.meals.sort((a, b) => a.strArea.localeCompare(b.strArea));
            renderFilterButtons(sortedCountries);
        }
    } catch (error) {
        console.error("Error fetching filters:", error);
    }
}

function renderDropdown(items) {
    categoryDropdown.innerHTML = '';
    items.forEach(item => {
        const link = document.createElement('a');
        link.href = "#";
        link.innerText = item.strCategory;
        link.onclick = (e) => {
            e.preventDefault();
            fetchRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${item.strCategory}`, `${item.strCategory} Recipes`);
        };
        categoryDropdown.appendChild(link);
    });
}

function renderFilterButtons(items) {
    window.scrollTo(0, 0);

    if (heroSection) heroSection.style.display = 'none';
    if (mainSectionTitle) mainSectionTitle.style.display = "none";
    recipeContainer.style.display = 'none'; 

    filterOptions.innerHTML = '';
    filterOptions.className = 'alphabetical-container'; 
    filterOptions.style.display = 'block';
    filterOptions.style.paddingTop = "30px";

    const browseTitle = document.createElement('h2');
    browseTitle.className = 'section-title';
    browseTitle.innerText = 'BROWSE BY COUNTRY/ORIGIN';
    filterOptions.appendChild(browseTitle);

    const groups = {};
    items.forEach(item => {
        const firstLetter = item.strArea[0].toUpperCase();
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(item);
    });

    Object.keys(groups).sort().forEach(letter => {
        const section = document.createElement('div');
        section.className = 'letter-section';
        section.innerHTML = `
            <h3 class="letter-header">${letter}</h3>
            <div class="country-pill-container"></div>
        `;
        const pillContainer = section.querySelector('.country-pill-container');
        groups[letter].forEach(item => {
            const area = item.strArea;
            const btn = document.createElement('button');
            btn.className = 'country-pill';
            btn.innerHTML = `<span>${area}</span>`;
            btn.onclick = () => {
                filterOptions.style.display = 'none';
                fetchRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, `${area} Cuisine`);
            };
            pillContainer.appendChild(btn);
        });
        filterOptions.appendChild(section);
    });
}

// FAVORITES LOGIC
function toggleFavorite(id, name, img) {
    const index = favorites.findIndex(fav => fav.id === id);
    const btn = document.getElementById(`fav-${id}`);

    if (index === -1) {
        favorites.push({ id, name, img });
        alert(`Successfully added "${name}" to favorites!`); // Eto yung notification
        if (btn) btn.innerText = "Saved";
    } else {
        favorites.splice(index, 1);
        if (btn) btn.innerText = "Add to Favorites";
    }
    
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
    
    if (mainSectionTitle && mainSectionTitle.innerText === "YOUR FAVORITES") {
        showFavorites();
    }
}

function showFavorites() {
    window.scrollTo(0, 0);
    if (heroSection) heroSection.style.display = 'none';
    filterOptions.style.display = 'none';
    recipeContainer.innerHTML = '';
    recipeContainer.style.display = 'grid';
    errorMessage.style.display = 'none';
    
    if (mainSectionTitle) {
        mainSectionTitle.innerText = "YOUR FAVORITES";
        mainSectionTitle.style.display = 'block';
    }

    if (favorites.length === 0) {
        recipeContainer.innerHTML = '<p class="status-msg error">You haven\'t added any favorites yet.</p>';
        return;
    }

    favorites.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="card-img-container">
                <img src="${meal.img}" alt="${meal.name}">
            </div>
            <div class="recipe-info">
                <h3>${meal.name}</h3>
                <button class="view-btn" onclick="showRecipeDetails('${meal.id}')">View Recipe</button>
                <button class="fav-btn remove" onclick="event.stopPropagation(); toggleFavorite('${meal.id}', '${meal.name}', '${meal.img}')">
                    Remove from Favorites
                </button>
            </div>
        `;
        recipeContainer.appendChild(recipeCard);
    });
}

// --- EVENT LISTENERS ---
searchBtn.addEventListener('click', () => {
    const query = userQuery.value.trim();
    if (query) {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`, `Search Results for: "${query}"`);
    }
});

userQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

categoriesLink.addEventListener('mouseenter', () => fetchFilters('c'));

countriesLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetchFilters('a');
});

randomLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetchRecipes(`https://www.themealdb.com/api/json/v1/1/random.php`, "Your Random Recipe");
});

if (favoritesLink) {
    favoritesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showFavorites();
    });
}

homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    if (heroSection) heroSection.style.display = 'flex';
    filterOptions.style.display = 'none';
    recipeContainer.innerHTML = '';
    recipeContainer.style.display = 'grid';
    userQuery.value = ''; 
    
    for(let i = 0; i < 8; i++) {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/random.php`, "Today's Featured Recipes", true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < 8; i++) {
        fetchRecipes(`https://www.themealdb.com/api/json/v1/1/random.php`, "Today's Featured Recipes", true);
    }
});