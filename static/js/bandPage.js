$(document).ready(function() {
	var id = getUrlVars()["id"];
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
		"band_ID": id
	};
	var additionalParams = {};
	var bandContact;
	apigClient.getBandInfoPost(params, body, additionalParams).then(
		function (result) {
			console.log(result.data);
			// var info = JSON.parse(result.data);
			var info = result.data;

			$('.band-name').text(info['band_name']);

			$('.band-loc').text(info['location']);

			var genre = info['genre'][0];

			for (var j = 1; j < info['genre'].length; j++) {
				genre = genre + ', ' + info['genre'][j];
			}

			var instru = info['instruments'][0];
			for (var j = 1; j < info['instruments'].length; j++) {
				instru = instru + ', ' + info['instruments'][j];
			}
			$('.band-genre').text(genre);
			$('.band-instru').text(instru);
			$('.band-year').text(info['year_formed']);
			var imgUrl = "https://bandup-band-photo.s3.amazonaws.com/" + info['picture'];
			$('.band-img').attr('src', imgUrl);
			var musicUrl_1 = "https://bandup-band-song.s3.amazonaws.com/" + info['songs'][0];
			$('#music-1').attr('src', musicUrl_1);
			var musicUrl_2 = "https://bandup-band-song.s3.amazonaws.com/" + info['songs'][1];
			$('#music-2').attr('src', musicUrl_2);
			$('.band-des').text(info['description']);
			
			bandContact = info['contact_info'];
		}).catch(function (result) {
		});

	$('#requestToJoin').click(function() {
		$('#request').modal(focus);
	});

	$('#btn-request').click(function() {
		var params = {};
		var body = {
			"name": $('#requestName').val(),
			"contact_info": $('#requestContact').val(),
			"introduction": $('#requestIntro').val(),
			"band_contact": bandContact
		};
		var additionalParams = {};
		apigClient.sendRequestPost(params, body, additionalParams).then(
			function (result) {
				console.log(result.data);
				alert(result.data.status);
			}).catch(function (result) {
			});
		$('#request').modal('hide');
	});

});