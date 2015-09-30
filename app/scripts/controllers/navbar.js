'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('NavbarCtrl', function ($scope,$location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	$scope.menu = [{
		'title': 'Linking',
		'link': '#/linking'
	}, {
		'title': 'Cryovial Packing',
		'link': '#/packing'
	}, {
		'title': 'Storage',
		'link': '#/storage'
	}];
	
	$scope.reports = [{
		'title': 'Locate Cryovial',
		'link': '#/locate-cryovial'
	}];

	$scope.isCollapsed = true;
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.isAdmin = Auth.isAdmin;
	$scope.getCurrentUser = Auth.getCurrentUser;

	$scope.logout = function() {
		$location.path('#/login');
	};

	$scope.isActive = function(route) {
		return route === '#' + $location.path();
	};
  });
