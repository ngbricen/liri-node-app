// grab API Keys
var appKeys = require("./keys.js");

// fs is a core Node package for reading and writing files
var fs = require("fs");

// Here we include the various API required for our app
var requestPackage = require("request");
var twitterPackage = require("twitter");
var spotifyPackage = require("spotify");
var movieName = "";

//Assigning Keys
var twitter = new twitterPackage(appKeys.twitterKeys);
var twitterParams = {
	q:'news',
	count: 20
}

// Take two arguments.
// The first will be the action (i.e. "deposit", "withdraw", etc.)
// The second will be the amount that will be added, withdrawn, etc.
var action = process.argv[2];
var values = process.argv;

runCommand(action,values);

function runCommand(action,values){
	switch (action) {
	  case "my-tweets":
	    myTwitter();
	    break;

	  case "spotify-this-song":
	    mySpotify(values);
	    break;

	  case "movie-this":
	    myMovie(values);
	    break;

	  case "do-what-it-says":
	    myCommand();
	    break;
	}
}

function myTwitter(){

	twitter.get('search/tweets', twitterParams,searchedData); // get is the 

	function searchedData(err, data, response) {
		//console.log("created on " + data.created_at + ": " + data.text);
		for (i=0; i < data.statuses.length; i++){
			console.log(i + 1 + ": Created on " + data.statuses[i].created_at + ": " + data.statuses[i].text);
		}
	} // searchedData function is a callback function which 
}

//TODO
function mySpotify(values){

}

function myMovie(values){
	// Loop through all the words in the node argument
	// And do a little for-loop magic to handle the inclusion of "+"s
	//If it comes from the command line, loop to get the movie values, otherwise
	//Grab it from the text file
	if (values[0] === "node"){
		for (var i = 0; i < values.length; i++) {
			if (i > 3  && i < values.length) {
				movieName = movieName + "+" + values[i];
			}
			else {
				movieName += values[i];
	  		}
		}
	}
	else{
		movieName = values;
	}

	if (movieName !== ""){
		// Then run a request to the OMDB API with the movie specified
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	}
	else{
		//query for mr Nobody
		var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece";
	}

	requestPackage(queryUrl, function(error, response, body) {

	  // If the request is successful
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year) ;
	    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value) ;
	    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Countries where produced: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);
	  }
	});
}

function myCommand(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");
		runCommand(dataArr[0],dataArr[1]);
	});
}