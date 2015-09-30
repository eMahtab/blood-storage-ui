'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:SynchronizeCtrl
 * @description
 * # SynchronizeCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('SynchronizeCtrl', function ($scope, $http) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	var httpUrls = {
		sync: 'http://localhost:8080/services/api/sync'
	};
	
	$scope.busy = false;
	$scope.completed = false;
	$scope.error = false;
	
	$scope.doSynchronize = function() {
		$('#synchronizeDialog').modal({
			backdrop: 'static',
			keyboard: false
		});
		$scope.busy = true;
		var synchronizePromise = $http.get(httpUrls.sync);
		
		synchronizePromise.success(function() {
			$scope.busy = false;
			$scope.success = true;
		});
		
		synchronizePromise.error(function() {
			$scope.error = true;
			$scope.busy = false;
			console.error('Problem');
		});
	};
});