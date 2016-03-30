//constants
var APIKEY = 'MDE1NDI3MjA4MDE0MDY2NTA1ODEwMWJjZA001';
var URL = 'http://api.npr.org/query?output=JSON';

//event handlers
$('audio').on('ended',function(){
	playing = false;
	play(pickRandomEpisode());
});
$('#next').click(function(){
	play(pickRandomEpisode());
});

//global variables
var episodes = {}; //to be filled with episodes when user selects a show
var playing = false; //toggle when an episode starts playing

//this shuffle function does NOT modify the original array.
function shuffle(arr){
	var copy = arr.slice();
	var build = [];
	while (copy.length) {
		var randomIndex = Math.floor(Math.random()*copy.length);
		build.push(copy[randomIndex]);
		copy.splice(randomIndex,1);
	}
	return build;
};

//picks episode from one of the active shows
function pickRandomEpisode(){
	var episodesArr = []; //will fill this with possible episodes
	for (var key in episodes){
		episodesArr = episodesArr.concat(episodes[key]);
	}
	var randomIndex = Math.floor(Math.random()*episodesArr.length);
	return episodesArr[randomIndex];
}

//starts the audio player
function play(episode){
	if (episode) {
		if (episode.audio[0].format.mp4){
			var episodeUrl = episode.audio[0].format.mp4.$text;
		}
		$('audio').attr('src',episodeUrl);
		$('#now').html(episode.title.$text);
		$('#nowShow').html(episode.showTitle);
		playing = true;
	}
}

//setting up Angular module and controller
var app = angular.module('radioApp',[]);
app.controller('radioController', ['$scope', '$http', function($scope,$http) {
	//scope variables and methods:
	$scope.selected = [];				//array of user-selected shows
	$scope.unselected = shuffle(shows);	//array of shows not yet selected
	$scope.enableNext = enableNext; 	//enable Next button
	$scope.enableClear = enableClear; 	//enable Clear button
	$scope.enableAdd = enableAdd;		//enable Add button
	$scope.toggleSelect = toggleSelect; //toggles shows to/from selected and unselected
	$scope.getEpisodes = getEpisodes; 	//requests episodes for a certain show from NPR's API
	$scope.pick = pick; 				//called when user clicks "Add for me" button
	$scope.removeAll = removeAll; 		//moves everything in selected to unselected array, called when user clicks "clear".

	//initialize view
	setView('radio'); //should be 'login' at first, but ng-show is not working...

	//event handler for switching view when user logs in
	$('#loginSubmit').click(function(){
		console.log('logging in');
		setView('radio');
	});

	function setView(view){
		console.log('setting view to ',view);
		$scope.view = view;
	}

	function enableNext(){
		return ($scope.selected.length);
	}

	function enableClear(){
		return ($scope.selected.length);
	}

	function enableAdd(){
		return ($scope.unselected.length);
	}

	function toggleSelect(show){
		var indexS = $scope.selected.indexOf(show);
		var indexU = $scope.unselected.indexOf(show);
		if (indexS === -1){ //moving to selected
			$scope.selected.push($scope.unselected.splice(indexU,1)[0]);
			$scope.getEpisodes(show);
		}
		else { //moving to unselected
			$scope.unselected.unshift($scope.selected.splice(indexS,1)[0]);
			delete episodes[show.title];
		}

	}

	function getEpisodes(show){
		console.log('show',show);
		if (show.orgId) {
			reqUrl = URL+'&orgId='+show.orgId+'&apiKey='+APIKEY+'&callback=JSON_CALLBACK'
		}
		else {
			reqUrl = URL+'&id='+show.id+'&apiKey='+APIKEY+'&callback=JSON_CALLBACK'
		}
		$http({
			method: 'JSONP',
			url: reqUrl
		}).success(function(data,status){
			var stories = data.list.story;
			stories = stories.filter(function(story){
				return (story.audio);
			});

			stories.forEach(function(story){
				story.imageUrl = show.imageUrl;
				story.showTitle = show.title;
			});
			
			episodes[show.title] = stories;
			if (!playing) {
				play(pickRandomEpisode());
			}
		})
		.error(function(data,status){
			console.log('error fetching stories');	
		});
	}

	function pick(){
		var randomIndex = Math.floor(Math.random()*$scope.unselected.length);
		$scope.toggleSelect($scope.unselected[randomIndex]);
	}

	function removeAll(){
		while ($scope.selected.length) {
			$scope.toggleSelect($scope.selected[0]);
		}
	}

	console.log($scope.selected.length);
}]);

























