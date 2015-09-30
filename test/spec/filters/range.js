'use strict';

describe('Filter: range', function () {
	// load the filter's module
	beforeEach(module('ishaLogisticsApp'));

	// initialize a new instance of the filter before each test
	var range;
	beforeEach(inject(function ($filter) {
		range = $filter('range');
	}));

	it('should return [0,1,2,3,4,5,6,7,8,9]:"', function () {
		var input = 10;
		expect(range([],input)).toEqual([0,1,2,3,4,5,6,7,8,9]);
	});
	
	it('should return [0,1,2,3,4,5,6,7,8,9]:"', function () {
		var input = 4;
		expect(range([],input)).toEqual([0,1,2,3]);
	});

});