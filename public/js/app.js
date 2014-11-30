var socket = io();

$.get( "/details", function( data ) {
	if(data.status != undefined || data.status == false){
		$('[data-page="configure"]').fadeIn();
	}else{
		displayData();		
		$('[data-page="status"]').fadeIn();
		$('[data-page="actions"]').fadeIn();
	}
});

$('body').on('click', '[data-button="configure"]', function(e){
	$('[data-page="configure"]').fadeOut();	
	$('[data-page="status"]').fadeIn();
	$('[data-page="actions"]').fadeIn();


	$.get( "/start/" + $('#url').val() + "/" + $('#virtualusers').val(), function( data ) {
		displayData();
	});

	e.preventDefault();
});

$('body').on('click', '[data-button="stop"]', function(e){
	$.get( "/stop", function( data ) {
		$("[data-button='stop']").hide();
		alert("No further requests will be made, however we will wait for exsisting requests to respond..");
	});

	e.preventDefault();
});

$('body').on('click', '[data-button="reset"]', function(e){
	$.get( "/reset", function( data ) {
		$("[data-button='stop']").hide();
		$("[data-button='reset']").hide();
		$('[data-page="configure"]').fadeIn();
		$('[data-page="status"]').fadeOut();
		$('[data-page="actions"]').fadeOut();
	});

	e.preventDefault();
});

function displayData(){
	socket.on('message', function (data) {
		$('[data-page="status"]').append(data.message);
	});

	socket.on('data', function (data) {
	    $('[data-page="status"]').empty();
		$('[data-page="status"]').append("<div class='page-header'><h1>Results</h1></div>");
		$('[data-page="status"]').append("I have load tested <strong>" + data.host + "</strong> with <strong>" + data.virtualusers + "</strong> virtual users.<br/>");
		$('[data-page="status"]').append("Out of a total <strong>" + data.requests + "</strong> requests, <strong>" + data.success + "</strong> were successful and <strong>" + data.error + "</strong> failed<br/>");
		$('[data-page="status"]').append("The first response time was <strong>" + data.firstLoadTime + "</strong> and the last <strong>" + data.lastLoadTime + "</strong>.<br/>");
		$('[data-page="status"]').append("I calculated the medium page reponse time to be <strong>" + data.mediumLoadTime + "</strong>.<br/><br/>");
		$('[data-page="status"]').append("<strong>Have a nice day.</strong><br/><br/>");
	});

	$('[data-page="actions"]').append("<button type='button' class='btn btn-danger' data-button='stop'>Stop Test</button> <button type='button' class='btn btn-success' data-button='reset'>New Test</button><br/><br/>");
}

