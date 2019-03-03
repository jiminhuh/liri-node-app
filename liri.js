require("dotenv").config();

var keys = require('./keys.js');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

// Grab user input 

var command = process.argv[2];
var input = process.argv.splice(3).join(" ");

// concert-this
if(command === "concert-this") {
    var URL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    concert(input);
    } // spotify-this-song
     else if (command === "spotify-this-song") {
        spotifyIt(input);
    } else if (command === "movie-this") {
        movie(input);
    } else if (command === "do-what-it-says") {
        doIt(input);
    }

    function concert (input) {
        axios.get(URL).then(function(response) {
            console.log("Results: ");
            for(var i = 0; i < response.data.length; i++) {
                console.log(
                    "\nDates: " + moment(response.data[i].datetime).format("MMM, DD, YYYY"),
                    "\nLocation: " + response.data[i].venue.name + ", " + response.data[i].venue.city + ", " + response.data[i].venue.country,
                    "\nURL: " + response.data[i].url
    
                );
            }
          }
        )
    }

    function spotifyIt (input) {
        if(!input) {
            input = "This Love";
        }
        spotify.search({
            type: "track",
            query: input
        }, function (err,data) {
            if(err) {
                console.log(err);
            }
            var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
        })
    }

    function movie (input) {
        if (!input){
            input = 'Mr Nobody';
        }
        var omdb = "http://www.omdbapi.com/?t=" + input +  "&y=&plot=short&apikey=9a04e1c2"
        axios.get(omdb).then(
            function(response) {
                console.log(
                    "Title: " + response.data.Title,
                    "\nRelease Year: " + response.data.Year,
                    "\nIMDB Rating: " + response.data.imdbRating,
                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value,
                    "\nCountry: " + response.data.Country,
                    "\nLanguage: " + response.data.Language,
                    "\nPlot: " + response.data.Plot,
                    "\nActors: " + response.data.Actors
                );
            }); 
    }

    function doIt (input) {
        fs.readFile('random.txt', "utf8", function(err, data){
            if (err) {
                return console.log(err);
              }

            var splitString = data.split(",");
    
        
            if (splitString[0] === "spotify-this-song") {
                var songcheck = splitString[1].slice(1, -1);
                spotifyIt(songcheck);
            } else if (splitString[0] === "concert-this") {
                var artist_name = splitString[1].slice(1, -1);
                concert(artist_name);
            } else if(splitString[0] === "movie-this") {
                var movie_name = splitString[1].slice(1, -1);
                movie(movie_name);
            } 
            
          });
    }