'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:CreateUserCtrl
 * @description
 * # CreateUserCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('CreateUserCtrl', function ($scope, $http, $location, $routeParams, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	var httpUrls = {
		user: 'http://localhost:8080/services/api/entity/user/'
	};
	
	$scope.createUserFormInput = null;
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	if($routeParams.username) {
		var retrieveUserPromise =$http.get(httpUrls.user + 'username/' + $routeParams.username);
		
		retrieveUserPromise.success(function(userData) {
			$scope.createUserFormInput = userData[0];
			$scope.createUserFormInput.password = null;
		});
		
		retrieveUserPromise.error(function() {
			console.error('Problem');
		});
	}
	
	$scope.username = $routeParams.username;
	
	$scope.busy = false;
	$scope.error = false;
	$scope.created = false;
	
	$scope.doCreateUser = function() {
		if($scope.createUserForm.$valid) {
			$scope.busy = true;
			$scope.error = false;
			$scope.created = false;
			// TODO: Check if user already exists
			var retrieveUserPromise = $http.get(httpUrls.user + 'username/' + $scope.createUserFormInput.username);
			
			retrieveUserPromise.success(function(userData) {
				if(!$scope.username && userData.length > 0 && userData.username === $scope.createUserFormInput.username) {
					console.log('User Exists');
					$scope.busy = false;
					$scope.error = 'Username ' + $scope.createUserFormInput.username + ' already exists';
					return;
				}
				
				var user = JSON.parse(JSON.stringify($scope.createUserFormInput));
				user.password = md5(user.password);
				var createUserPromise = $http.post(httpUrls.user, user);
				
				createUserPromise.success(function() {
					// TODO: Created
					$scope.busy = false;
					$scope.error = false;
					$scope.created = true;
				});
				
				createUserPromise.error(function() {
					console.error('Problem');
				});
			});
			
			retrieveUserPromise.error(function() {
				console.error('Problem');
			});
		}
	};
});