$('body').on('click', '[data-button="configure"]', function(e){
	$('[data-page="configure"]').fadeOut();	
	console.log();

	$.get( "/start/" + $('#url').val() + "/" + $('#virtualusers').val(), function( data ) {
		setInterval(function(){
			$.get( "/details", function( data ) {
				/**
					This needs to be refactored into Handlebars templates...
				**/
				$('[data-page="status"]').empty();
				$('[data-page="status"]').append("<div class='page-header'><h1>Results</h1></div>");
				$('[data-page="status"]').append("I have load tested <strong>" + data.host + "</strong> with <strong>" + data.virtualusers + "</strong> virtual users.<br/>");
				$('[data-page="status"]').append("Out of a total <strong>" + data.requests + "</strong> requests, <strong>" + data.success + "</strong> were successful and <strong>" + data.error + "</strong> failed<br/>");
				$('[data-page="status"]').append("The first response time was <strong>" + data.firstLoadTime + "</strong> and the last <strong>" + data.lastLoadTime + "</strong>, I also calculated the medium page reponse time to be <strong>" + data.mediumLoadTime + "</strong>.<br/>");
				$('[data-page="status"]').append("Have a nice day.<br/><br/>");
				$('[data-page="status"]').append("<button type='button' class='btn btn-danger' data-button='stop'>Stop Test</button>");
			});
		}, 1000);
		$('[data-page="status"]').fadeIn();
	});

	e.preventDefault();
});

$('body').on('click', '[data-button="stop"]', function(e){
	$.get( "/stop", function( data ) {
		$("[data-button='stop']").hide();
		alert("Stopped, no further requests will be made.");
	});

	e.preventDefault();
});