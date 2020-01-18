$(document).ready(function() {

	$('.btn-outline-secondary').click(function() {
		window.location.href = 'chatBot.html';
	});

	$('#searchInput').keypress(function(event) {
		if (event.which == 13) {
			var keyword = $('#searchInput').val();
			if (keyword == '') {
				return false;
			} else {
				event.preventDefault();
				window.location.href = 'searchResult.html?query=' + keyword;
			}
		}
		
	});

	var apigClient = apigClientFactory.newClient();

	var photoalbumBucketName = "bandup-band-photo";
	var photobucketRegion = "us-east-1";
	var photoIdentityPoolId = "us-east-1:7afea877-4cde-4da8-8c0a-bdb792168092";

	AWS.config.update({
	region: photobucketRegion,
	credentials: new AWS.CognitoIdentityCredentials({
		IdentityPoolId: photoIdentityPoolId
	})
	});

	var photos3 = new AWS.S3({
	apiVersion: "2006-03-01",
	params: { Bucket: photoalbumBucketName }
	});

	var musicalbumBucketName = "bandup-band-song";
	var musicbucketRegion = "us-east-1";
	var musicIdentityPoolId = "us-east-1:7afea877-4cde-4da8-8c0a-bdb792168092";

	AWS.config.update({
	region: musicbucketRegion,
	credentials: new AWS.CognitoIdentityCredentials({
		IdentityPoolId: musicIdentityPoolId
	})
	});

	var musics3 = new AWS.S3({
	apiVersion: "2006-03-01",
	params: { Bucket: musicalbumBucketName }
	});
	
	$('#createNew').click(function() {
		var picFile = $('#bandPic').prop('files')[0];
		var musicFile_1 = $('#bandMusic-1').prop('files')[0];
		var musicFile_2 = $('#bandMusic-2').prop('files')[0];
		var genre = $('#bandGenre').val().split(',');
		var instru = $('#bandHelp').val().split(',');
		var bandname = $('#bandName').val();
		// TODO
		// send three files to S3 bucket

		var is_ok = true;

		var f1 = picFile;
		var photoalbumName = "";
		console.log(f1.name);
		console.log(f1.size);
		console.log(f1.type);

		var f2 = musicFile_1;
		var musicalbumName = "";
		console.log(f2.name);
		console.log(f2.size);
		console.log(f2.type);

		var f3 = musicFile_2;
		console.log(f3.name);
		console.log(f3.size);
		console.log(f3.type);

		//photo upload
		var file = f1;
		var fileName = f1.name;
		//var albumPhotosKey = encodeURIComponent(photoalbumName) + "/";
		var albumPhotosKey = "";

		var photoKey = albumPhotosKey + fileName;

		var upload = new AWS.S3.ManagedUpload({
			params: {
			Bucket: photoalbumBucketName,
			Key: photoKey,
			Body: file,
			ACL: "public-read"
			}
		});

		var promise = upload.promise();

		var done = false;

		promise.then(
			function(data) {
				alert("Successfully uploaded photo.");
				done = true;

				//music upload
				file = f2;
				fileName = f2.name;
				//var albumMusicsKey = encodeURIComponent(musicalbumName) + "/";
				var albumMusicsKey = "";

				var musicKey = albumMusicsKey + fileName;

				var upload2 = new AWS.S3.ManagedUpload({
					params: {
					Bucket: musicalbumBucketName,
					Key: musicKey,
					Body: file,
					ACL: "public-read"
					}
				});

				var promise2 = upload2.promise();

				promise2.then(
					function(data) {
						alert("Successfully uploaded music1.");
						done = true;

						//music2 upload
						file = f3;
						fileName = f3.name;
						//albumMusicsKey = encodeURIComponent(musicalbumName) + "/";
						albumMusicsKey = "";

						musicKey = albumMusicsKey + fileName;

						var upload3 = new AWS.S3.ManagedUpload({
							params: {
							Bucket: musicalbumBucketName,
							Key: musicKey,
							Body: file,
							ACL: "public-read"
							}
						});

						var promise3 = upload3.promise();

						promise3.then(
							function(data) {
								alert("Successfully uploaded music2.");
								done = true;

								if(is_ok) {
									alert("Successfully uploaded all files!");
									var params = {};
									var body = {
										"band_name": $('#bandName').val(),
										"contact_info": {
											"email": $('#bandEmail').val(),
											"phone": $('#bandPhone').val()
										},
										"location": $('#bandLoc').val(),
										"description": $('#bandDes').val(),
										"year_formed": new Date().getFullYear(),
										"picture": picFile.name,
										"songs": [
											musicFile_1.name,
											musicFile_2.name
										],
										"genre": genre,
										"instruments": instru
									};
									var additionalParams = {};
									apigClient.createBandPost(params, body, additionalParams).then(
										function (result) {
											console.log(result.data);
											if (result.data.status == 'OK') {
												window.location.href = 'bandPage.html?id=' + result.data.band_ID;
											}
						
										}).catch(function (result) {
										});
								} else {
									alert("File Upload Failed! Please do it again!");
								}


							},
							function(err) {
								console.log("err is :",err.message)
								alert("There was an error uploading your music1: ", err.message);
								is_ok = false;
								done = true;
							}
						);

					},
					function(err) {
						console.log("err is :",err.message);
						alert("There was an error uploading your music1: ", err.message);
						is_ok = false;
						done = true;
					}
				);


			},
			function(err) {
				console.log("err is :",err.message);
				alert("There was an error uploading your photo: ", err.message);
				is_ok = false;
				done = true;
			}
		);

	})

	
});