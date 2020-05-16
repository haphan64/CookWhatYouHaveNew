// Generate background image
var ingredients;
var url = "https://api.pexels.com/v1/search?query=ingredients&per_page=20";

    apiKey = "563492ad6f91700001000001f7844e1ee34b4bf79ebd70bc8a98a19f"
    // apiKey = "563492ad6f917000010000011fa50223f942403d9e2d4ddbe035b3e7"

var settings = {            
"url": url,
"method": "GET",
"headers": {                
    "Authorization": apiKey
}
}

$.ajax(settings).done(function (response) {

//console.log(response);
//console.log(response.total_results);
           

var p = Math.floor(Math.random() * parseInt(response.photos.length)) + 1;

  //console.log(p);
  
  //console.log(response.photos[p].src.original);

  //console.log(response.photos[p].url);            
  
  $('.hero-section').css('background-image', 'url(' + response.photos[p].src.landscape + ')');

  //console.log(response.photos[p].photographer);
  //console.log(response.photos[p].photographer_url);

  $("#credits").append("<a href=" + response.photos[p].photographer_url + ">" + response.photos[p].photographer + " @ Pexels" + "</a>");


});


// Fetch recipes from ingredients

// var apiId = "6d15138b427645f68ff32030ae3cb1cc"; 
var apiId ="b229212145ae4030923cb4146500d590";
// var apiId ="648937ec746a43f5b57dfa8e5975e983";

// var ingredients = "apples"; 

var recipe ="";
// var RecipeStore= JSON.parse(localStorage.getItem('recipe'));

//  2nd end point; Get Recipe Information: https://api.spoonacular.com/recipes/716429/information?includeNutrition=false

if (!recipe){
    recipe =[]; 
}

$("#search").submit(function(event){   
    event.preventDefault();

    //console.log("ingredients");
    ingredients=$("#ingredients").val();
    searchRecipes(ingredients);

   
})

function searchRecipes (ingredients){  

  var queryURL= "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingredients + "&apiKey=" + apiId;
  //console.log(queryURL)
  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {

    for (i=0; i<response.length; i++){
        //console.log(response[i].title)
    
    createRecipeCard(response[i].image, response[i].title, response[i].id);
    //var recipeCard='<div class="card col-3" style="width: 18rem;"><img src='+ response[i].image +  ' class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' +response[i].title  +'</h5><p class="card-text">.</p><a href="#" class="btn btn-primary viewRecipe" recipe= '+response[i].id + '>View Recipe</a></div></div>'
    
    }
    
  });
}

$('.hero-section').on('click', '.card', function(event) {
    event.preventDefault();
        let id = $(this).attr("data-index");
        console.log("clicked id: " + id);
        //$("#content-blah").empty();
        $('#backbutton').show();
        
        getRecipe(id);
});

//searchRecipes (ingredients);

function getRecipe(id){
    console.log("getrecipe called: " + id);

    var queryURL="https://api.spoonacular.com/recipes/" +id + "/information?includeNutrition=false" + "&apiKey=" + apiId;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        
        $("#content-blah ").append("<h2>" + response.title + "</h2>");
        $("#content-blah").append('<img src='+ response.image + ">");
        var recipeIngredients = $("<div>");
        recipeIngredients.append("<p>" + "Ingredients" + "</p>");
        
        for (i=0; i<response.extendedIngredients.length; i++){
            
            // console.log(response.extendedIngredients[i].original)
            var ingredient = $("<p>");
            ingredient.text(response.extendedIngredients[i].original);
            recipeIngredients.append(ingredient);
        }

        

        //  console.log(response.ingredients)
         // go to a detail page or open a modal with the detail info
        // console.log(response.analyzedInstructions[0].steps[0].ingredients)
        
        /*1-title and image
        1-ingredients
        1-instructions*/

        // console.log(response.instructions)
        var instructions = $("<div>");

        instructions.append("<p>" + "Instructions" + "</p>");
        instructions.append("<p>" + response.instructions + "</p>");

        
        $('#background').hide();
        $("#search").hide();
        $("#content-blah").append(recipeIngredients);
        $('#content-blah').append(instructions);
        $('#show').show();
        


    });   
}

function createRecipeCard (responseImage, title, id) {

    var cell = $('<div>');
    cell.attr('class', 'cell small-6 medium-6 large-3');

    var card = $('<div>');
    card.attr('id','view');
    card.attr('class', 'card card-hover');
    card.attr('data-index',id);

    var img = $('<img>');
    img.attr('src', responseImage);
    

    var cardSection = $('<div>');
    cardSection.attr('class', 'card-section card-hovered');

    var text = $('<p>');
    text.text(title);


    cardSection.append(text);

    card.append(img).append(cardSection);

    cell.append(card);

    $('#cardGrid').append(cell);

}

$('#backbutton').click(function() {

    //alert('back');
    $('#content-blah').empty();
    $('#cardGrid').empty();
    $('#show').hide();
    $('#background').show();
    $('#search').show();
    searchRecipes(ingredients);

    
});



