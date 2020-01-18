$(document).ready(function() {
	var apigClient = apigClientFactory.newClient();
	var params = {};
	var body = {
		"operation": "get recommendations"
	};
	var additionalParams = {};
	apigClient.getRecommendationPost(params, body, additionalParams).then(
		function (result) {
			console.log(result.data);
			var recommendations = result.data.recommendations;
			var recommendation;

			// recommendations = [
			// 	{
			// 	  "band_ID": "123",
			// 	  "band_name": "string",
			// 	  "picture": "string",
			// 	  "songs": [
			// 		"string"
			// 	  ]
			// 	}
			// ]

			var headlines = $('.headline');
			for (var i = 0; i < headlines.length; i++) {
				var headline = headlines[i];

				if (recommendations.length < i) {
					recommendation = recommendations[0];
				} else {
					recommendation = recommendations[i];
				}

				$(headline).find('a').attr("href", "https://bandup.s3.amazonaws.com/bandPage.html?id=" + recommendation['band_ID']);
				$(headline).find('img').attr("src", "https://bandup-band-photo.s3.amazonaws.com/" + recommendation['picture']);
			}

			var cards = $('.card');
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				if (recommendations.length < i + headlines.length) {
					recommendation = recommendations[0];
				} else {
					recommendation = recommendations[i + headlines.length];
				}

				$(card).find('a').attr("href", "https://bandup.s3.amazonaws.com/bandPage.html?id=" + recommendation['band_ID']);
				$(card).find('img').attr("src", "https://bandup-band-photo.s3.amazonaws.com/" + recommendation['picture']);
				$(card).find('h5').text(recommendation['band_name']);
				$(card).find('source').attr("src", "https://bandup-band-song.s3.amazonaws.com/" + recommendation['songs'][0]);
			}

		}).catch(function (result) {
		});

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

	$('#login').modal(focus);
});