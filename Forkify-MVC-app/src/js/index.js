// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesViews from './views/likesViews';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shooping list object
 * - Liked recipes
*/
const state = {};

/* SEARCH CONTROLER */
const controlSearch = async () => {
    //1. Get query from the view
    const query = searchView.getInput();

    if(query){
        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults(); 
        renderLoader(elements.searchRes);

        try{
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();  
            searchView.renderResults(state.search.result);

        } catch(err){
            alert('Something went wrong with the search...');
            console.log(err);
            clearLoader();  
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //da se ne refresuje svaki put kada kliknemo
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //targetuje najblizi html tag
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10); //vuce data atribut iz html-a i isisuje br. stranice
        //parseInt(btn.dataset.goto, 10) - konv. string u int i stavljamo da je base 10, znaci da nam idu brojevi od 0 do 9. Da smo stavili 2 onda bi islo od 0 do 1 (binarbni sitem).
        searchView.clearResults();         
        searchView.renderResults(state.search.result, goToPage);
    }
});

/* RECIPE CONTROLER */

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', ''); //uzima hashtag i tamo gde je 

    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if(state.search) searchView.highlightSelected(id);

        //Create new recipe object 
        state.recipe = new Recipe(id);

        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

        } catch(err){
            alert("Error processing recipe");
            console.log(err);
        }
    }
};

// window.addEventListener('hashchange', controlRecipe); //event koji se trigeruje sa promenom hashtaga u url-u
// window.addEventListener('load', controlRecipe); 
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe)); //isto sto i ovo gore samo krace


/* LIST CONTROLER */

const controlList = () => {
    //Create a new list IF there in none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; //uzimamo id od najbilzeg elem.

    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }
    //Handle the count update  
    else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/* LIKE CONTROLER */

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the liked button
        likesViews.toggleLikeBtn(true);

        //Add like to UI list
        likesViews.renderLike(newLike);
        
    }
    
    //user HAS liked current recipe
    else {
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //Toggle the liked button
        likesViews.toggleLikeBtn(false);

        //Remove like from UI list
        likesViews.deleteLike(currentID);

    }
    likesViews.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesViews.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesViews.renderLike(like));
});


//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){ //ako event targetuje tu klasu onda radi sledece
        // Decrease buttons is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } 
    else if(e.target.matches('.btn-increase, .btn-increase *')){ //ako event targetuje tu klasu onda radi sledece
        // Increase buttons is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);        
    } 
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredient to shopping list
        controlList();
    }
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
});
