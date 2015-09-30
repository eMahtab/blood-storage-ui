'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('LoginCtrl', function ($scope, Auth, $timeout, $location) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	Auth.doLogout();
	
	$scope.loginFormInput = {};
	
	$timeout(function() {
		$('#loginDialog').modal('hide');
		$('#loginDialog').modal({
			backdrop: 'static',
			keyboard: false
		});
	});
	
	$scope.doLogin = function() {
		$scope.dataLoading = true;
		$scope.error = false;
		
		var loginCredentials = {};
		loginCredentials.username = $scope.loginFormInput.username;
		loginCredentials.password = md5($scope.loginFormInput.password);
		console.log('POSTing: ' + JSON.stringify(loginCredentials));
		var successCallback = function() {
			console.log('Auth.isLoggedIn: ' + Auth.isLoggedIn());
			$('#loginDialog').modal('hide');
			$timeout(function() {
				$location.path('/');
			}, 500);
		};
		
		var errorCallback = function() {
			$scope.error = 'Authentication Failed.';
			$scope.dataLoading = false;
		};
		Auth.doLogin(loginCredentials, successCallback, errorCallback);
	};
});