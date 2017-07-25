'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:BlurCtrl
 * @description
 * # BlurCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('CombinationCtrl', function ($window,$scope) {
	/*this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	$scope.nextId = 1;
	
	$scope.transitionOnEnter = function(event) {
		if(event.keyCode === 13) {
			var elem = document.getElementById($scope.nextId);
			if(elem) {
				elem.select();
			}
		}
	};
	
	$scope.setNextId = function(nextId) {
		$scope.nextId = nextId;
	};*/
    var store = $window.localStorage; 
    console.log("Current combination "+store.getItem('defaultCryovialCombination'));
    $scope.selectCombination = function(cryovials){
    	console.log("Awesome "+cryovials);
    	var combinations = JSON.parse(store.getItem('combinations'));

    	store.setItem('defaultCryovialCombination',cryovials);
        store.setItem('currentCombination',JSON.stringify(combinations[cryovials]));
        console.log("After Change "+store.getItem('defaultCryovialCombination'));
    };


});