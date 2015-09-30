'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:AddBoxCtrl
 * @description
 * # AddBoxCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('AddBoxCtrl', function ($scope, $http, $timeout, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		cryovialBox: 'http://localhost:8080/services/api/entity/cryovialBox/'
	};

	$scope.addBoxInput = {};

	$scope.addBoxValidation = {};

	$scope.created = false;

	$scope.busy = false;
	
	$scope.addCryovialBox = function(event) {
		$scope.addBoxValidation = {};
		if(event.keyCode === 13 && $scope.addBoxForm.cryovialBoxId.$valid) {
			$scope.busy = true;
			
			if($scope.addBoxInput.cryovialBoxId.indexOf('PB') === 0) {
				$scope.addBoxInput.cryovialType = 'Plasma';
			} else if($scope.addBoxInput.cryovialBoxId.indexOf('BB') === 0) {
				$scope.addBoxInput.cryovialType = 'BuffyCoat';
			} else if($scope.addBoxInput.cryovialBoxId.indexOf('RB') === 0) {
				$scope.addBoxInput.cryovialType = 'RBC';
			}
			
			var retrieveCryovialBox = $http.get(httpUrls.cryovialBox + $scope.addBoxInput.cryovialBoxId);
			
			retrieveCryovialBox.success(function(data) {
				if($scope.addBoxInput.cryovialBoxId === data.cryovialBoxId) {
					console.log('duplicate');
					$scope.addBoxValidation.duplicate = true;
					$scope.busy = false;
				} else {
					console.log('Not Duplicate');
					console.log('data: ' + JSON.stringify(data));
					var createBoxPromise = $http.post(httpUrls.cryovialBox,$scope.addBoxInput);
					
					createBoxPromise.success(function() {
						$scope.created = true;
						$scope.busy = false;
					});
					
					createBoxPromise.error(function() {
						console.error('Error creating Cryovial Box');
						$scope.busy = false;
					});
				}
			});
			
			retrieveCryovialBox.error(function() {
				console.error('Problem');
			});
		}
	};
	
	$timeout(function() {
		document.getElementById('cryovialBoxId').focus();
	});
});