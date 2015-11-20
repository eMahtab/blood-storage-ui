'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:SynchronizeCtrl
 * @description
 * # SynchronizeCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('SynchronizeCtrl', function ($scope, $location, $http, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		auth: 'http://localhost:8080/services/api/security/auth',
		sync: 'http://localhost:8080/services/api/sync/dataSync/manager'
	};
	
	$scope.busy = false;
	$scope.completed = false;
	$scope.error = false;
	
	$scope.doSynchronize = function() {
		$scope.busy = true;
		
		// TODO: Authenticate First
		var authenticatePromise = $http.post(httpUrls.auth, { username: Auth.getCurrentUser().username, password: Auth.getCurrentUser().password });
		
		authenticatePromise.success(function(authObjectData) {
			if(authObjectData.username === Auth.getCurrentUser().username && authObjectData.password === Auth.getCurrentUser().password) {
				var synchronizePromise = $http.get(httpUrls.sync);
				
				synchronizePromise.success(function() {
					$scope.busy = false;
					$scope.completed = true;
				});
				
				synchronizePromise.error(function() {
					console.log('Problem');
					$scope.busy = false;
					$scope.error = 'Problem with Synchronization. Are you connected to the internet?';
				});
			}
		});
		
		authenticatePromise.error(function() {
			$scope.busy = false;
			$scope.error = 'Authentication Failed. Are you connected to the Internet?';
			console.error('Problem');
		});
	};
});