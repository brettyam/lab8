/* controller.js
    Controller for Shopping Cart page
*/

$(function(){
	var formatLabels = {
    	dvd: 'DVD',
    	bluray: 'Blu-Ray'
	}; //var formatLabels
	
	var cartModel = createCartModel();
	
	var cartView = createCartView({
	    model: cartModel,
	    template: $('.cart-item-template'),
	    container: $('.cart-items-container'),
	    totalPrice: $('.total-price')
	}); //var cartView

	var cartJSON = localStorage.getItem('cart');
	if (cartJSON && cartJSON.length > 0) {
	    cartModel.setItems(JSON.parse(cartJSON));
	} //var cartJSON

	var moviesModel = createMoviesModel({
    	url: 'https://courses.washington.edu/info343/ajax/movies/'
	}); //var moviesModel

	var moviesView = createMoviesView({
	    model: moviesModel,
	    template: $('.movie-template'),
	    container: $('.movies-container')
	}); //var moviesView

	moviesModel.refresh();	//refresh to get movies from server

	//when the movies view triggers 'addToCart'
	//add a new item to the cart, using the supplied
	//movieID and format
	moviesView.on('addToCart', function(data){
    	var movie = moviesModel.getItem(data.movieID);
    	if (!movie)
        throw 'Invalid movie ID "' + movieID + '"!'; 

    	cartModel.addItem({
        	id: movie.id,
        	title: movie.title,
        	format: data.format,
        	formatLabel: formatLabels[data.format],
        	price: movie.prices[data.format]
    	});
	}); //addToCart event

	//place-order button handler
	$('.place-order').click(function(){
		$.ajax({
		    url: 'https://courses.washington.edu/info343/ajax/movies/orders/',
		    type: 'POST',
		    data: cartModel.toJSON(),
		    contentType: 'application/json',
		    success: function(responseData) {
		    	alert(responseData.message);
		    	cartModel.setItems([]);
		    },
		    error: function(jqXHR, status, errorThrown) {
		        //error with post--alert user
		        alert(errorThrown || status);
		    }
		}); //ajax()
	}); //place-order button handler

	//save cart to local storage
	cartModel.on('change', function(){
    	localStorage.setItem('cart', cartModel.toJSON());
	});      
}); //doc ready()

