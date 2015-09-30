'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp')
  .controller('MainCtrl', function ($location, Auth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
	  
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
  });
