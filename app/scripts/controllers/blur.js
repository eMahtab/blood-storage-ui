'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:BlurCtrl
 * @description
 * # BlurCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('BlurCtrl', function ($scope) {
	this.awesomeThings = [
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
	};
});