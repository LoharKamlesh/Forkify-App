import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeViews from './views/addRecipeViews.js';
import { MODAL_CLOSE_SEC } from './config.js';

//import icons from '../img/icons.svg' parcel1
//import icons from 'url:../img/icons.svg'; //parcel2
import 'core-js/stable'; //polyfiling everything else
import 'regenerator-runtime/runtime'; //polyfiling async await

// if (module.hot) {
//   module.hot.accept();
// } //coming from parcel to save the state of webpage else it will reload everytime we switch the window

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // console.log(window.location);....entire url
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    bookmarksView.update(model.state.bookmarks);
    //loading recipe

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipe(id);
    //const { recipe } = model.state;

    recipeView.render(model.state.recipe);
    //const recipeView=new RecipeView(model.state.recipe); ...if whole RecipeView class is exported
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const controlSeachResults = async function () {
  try {
    resultsView.renderSpinner();
    //console.log(resultsView);
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    //console.log(model.state.search.results);
    //searchView.cleanInput(); OR

    //resultsView.render(model.state.search.results); ..calling All results
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //console.log(goToPage);
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipeView
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or remove the  bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render the bookmark

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeViews.renderSpinner(model.state.recipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    model.addBookmark(model.state.recipe);
    // render new recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeViews.renderMessage();

    //Render Bookark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in the url
    window.history.pushState(null, '', `${model.state.recipe.id}`); //(state,title,url) history.pushState allows us to change the url without loading the page.

    //close form
    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //console.log(err);
    addRecipeViews.renderError(err.message);
  }

  //upload new recipe data
};

//controlSeachResults();
////publisher-subscriber
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSeachResults);
  paginationView.addHandlerPage(controlPagination);
  recipeView.addhandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  addRecipeViews.addHandleUpload(controlAddRecipe);
};

init();
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
