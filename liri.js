
// ********************GLOBAL VARIABLES******************** //

	// Loading the keys.js and relevant packages
	var keys = require('./keys.js');

	var Twitter = require('twitter');
	 
	var spotify = require('spotify');

	var Spotify = require('node-spotify-api');

	var request = require('request');

	var fs = require("fs");


	// Capture user entries 
	var userCommand = process.argv[2];

	var allEntry = process.argv;
	var userSearch = '';
	for (var i = 3; i < allEntry.length; i++) {
		if (i > 3 && i < allEntry.length) {
			userSearch = userSearch + " " + allEntry[i];
		}
		else {
			userSearch += allEntry[i];
		}
	} 



// ********************FUNCTIONS******************** //

	function doTheThing() {
		if (userCommand === 'my-tweets') {
			grabTweets();
		} else if (userCommand === 'spotify-this-song') {
			grabSpotify(userSearch);
		} else if (userCommand === 'movie-this') {
			grabOMDB(userSearch);
		} else if (userCommand === 'do-what-it-says') {
			randomAction();
		} 
		else {
			console.log('\nSorry, "'+userCommand+
				'" is not a valid command.  Please try again.\n');
		}
	}


	function grabTweets() {

		var client = new Twitter(keys.twitterKeys);

		var params = {screen_name: 'Tyler_WX'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
	    	console.log("\nTyler_WX's tweets:");

		    for (var i = 0; i < tweets.length; i++) {
		    	console.log('--------------------\n\n'+(i+1)+'\n'+tweets[i].created_at);
		    	console.log(tweets[i].text+'\n\n');
		    }
		  }
		});
	}


	function grabSpotify(userSearch) {

		var spotify = new Spotify(keys.spotifyKeys);
		 
		spotify.search({ type: 'track', query: userSearch }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
		 
			var songData = data.tracks.items;
			
			for (var i = 0; i < songData.length; i++) {
				console.log(i);
				console.log('Artist: '+songData[i].artists[0].name);
				console.log('Song Title: '+songData[i].name);
				console.log('Check the song out here: '+songData[i].preview_url);
				console.log('Album: '+songData[i].album.name);
				console.log('--------------------\n');
			}

		});
	}


	function grabOMDB(userSearch) {
		request('http://www.omdbapi.com/?apikey='+keys.omdbKey.provided_key+
			'&t='+userSearch+'&plot=full',
		function (error, response, body) {
			if (error) {

				console.log('error:', error); 

			} else if (!error && response.statusCode === 200) {	

				console.log('-------------------------------------------'+
	    			"\n\nTitle of the movie: " + JSON.parse(body).Title +
	    			"\n\nYear the movie came out: " + JSON.parse(body).Year +
	    			"\n\nIMDB Rating of the movie: " + JSON.parse(body).imdbRating);
				if ( JSON.parse(body).Ratings[1]) {
					console.log(
					"\nRotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
				} else {
					console.log(
					"\nRotten Tomatoes Rating of the movie: N/A");
				}
				console.log(
	    			"\nCountry where the movie was produced: " + JSON.parse(body).Country +
	    			"\n\nLanguage of the movie: " + JSON.parse(body).Language +
	    			"\n\nPlot of the movie: " + JSON.parse(body).Plot +
	    			"\n\nActors in the movie: " + JSON.parse(body).Actors +
	    			'\n\n-------------------------------------------');

			}
		});
	}


	function randomAction() {
		fs.readFile("random.txt", "utf8", function(error, data) {

		  if (error) {
		    return console.log(error);
		  }

		  var dataArr = data.split(",");

		  userCommand = dataArr[0];
		  userSearch = dataArr[1];

		  doTheThing();
		});
	}



// ********************EXECUTION******************** //

	doTheThing();



