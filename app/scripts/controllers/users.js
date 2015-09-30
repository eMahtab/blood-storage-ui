'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('UsersCtrl', function ($scope,$http, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	
	var httpUrls = {
		user: 'http://localhost:8080/services/api/entity/user/'
	};
	
	$scope.usersList = null;
	
	var retrieveUsers = function() {
		var retrieveUsersPromise = $http.get(httpUrls.user);
		
		retrieveUsersPromise.success(function(usersData) {
			$scope.usersList = usersData;
		});
		
		retrieveUsersPromise.error(function() {
			console.error('Problem');
		});
	};
	
	retrieveUsers();
	
	$scope.removeUser = function(username) {
		if(username) {
			console.log('Removing user');
			var deleteUserPromise = $http.delete(httpUrls.user + username);
			
			deleteUserPromise.success(function() {
				retrieveUsers();
			});
			
			deleteUserPromise.error(function() {
				console.error('Problem');
			});
		}
	};
});