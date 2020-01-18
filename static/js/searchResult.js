$(document).ready(function() {

	var keyword = getUrlVars()["query"];
	function getUrlVars() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
	        vars[key] = value;
	    });
	    return vars;
	}

	$('.btn-outline-secondary').click(function() {
		window.location.href = 'https://bandup.s3.amazonaws.com/chatBot.html';
	});

	$('#searchInput').keypress(function(event) {
		if (event.which == 13) {
			var keyword = $('#searchInput').val();
			if (keyword == '') {
				return false;
			} else {
				event.preventDefault();
				window.location.href = 'https://bandup.s3.amazonaws.com/searchResult.html?query=' + keyword;
			}
		}
		
	});

	var apigClient = apigClientFactory.newClient();
	var params = {};
	var body = {
		"query": keyword
	};
	var additionalParams = {};
	apigClient.getBandsPost(params, body, additionalParams).then(
		function (result) {
			console.log(result.data);
			var bands = result.data.bands;

			if (bands.length < 3) {
				$('.footer').addClass("fixed-bottom");
			}

			for (var i = 0; i < bands.length; i++) {
				var band = bands[i];

				var pageUrl = "https://bandup.s3.amazonaws.com/bandPage.html?id=" + band['band_ID'];
				var imgUrl = "https://bandup-band-photo.s3.amazonaws.com/" + band['picture'];
				var genre = band['genre'][0];
				for (var j = 1; j < band['genre'].length; j++) {
					genre = genre + ', ' + band['genre'][j];
				}
				var instru = band['instruments'][0];
				for (var j = 1; j < band['instruments'].length; j++) {
					instru = instru + ', ' + band['instruments'][j];
				}

				var item = " \
				<div class='row'> \
					<div class='col-5'> \
						<a href=" + pageUrl + "><img src=" + imgUrl + " width='370px'></a> \
					</div> \
					<div class='col-7'> \
						<div class='band-name'><a class='page' href=" + pageUrl + ">" + band['band_name'] + "</a></div> \
						<div class='band-loc'>" + band['location'] + "</div> \
						<div class='band-genre'>" + genre + "</div> \
						<br> \
						<div class='band-help'>We're Looking for muscians who can play:</div> \
						<div class='band-instru'>" + instru + "</div> \
					</div> \
				</div> \
				";

				$('.section-1').append(item);
			}
			
		}).catch(function (result) {
		});
});