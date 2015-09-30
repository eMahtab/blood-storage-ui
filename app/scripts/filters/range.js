'use strict';

/**
 * @ngdoc filter
 * @name ishaLogisticsApp.filter:range
 * @function
 * @description
 * # range
 * Filter in the ishaLogisticsApp.
 */
angular.module('ishaLogisticsApp').filter('range', function () {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<total; i++) { input.push(i); }
		return input;
	};
});