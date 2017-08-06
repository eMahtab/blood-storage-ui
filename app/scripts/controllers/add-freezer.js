'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:AddFreezerCtrl
 * @description
 * # AddFreezerCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('AddFreezerCtrl', function ($scope, $http, $q, $timeout, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		freezerUnit: 'http://localhost:8080/services/api/entity/freezerUnit/freezerUnitId/',
		freezerRack: 'http://localhost:8080/services/api/entity/freezerUnit/'
	};
	
	$scope.addFreezerFormInput = {racks: [null, null, null, null]};
	$scope.addFreezerFormInputValidity = {};
	
	$scope.created = false;
	
	$scope.validateFreezerId = function(event) {
		$scope.addFreezerFormInputValidity.freezerId = null;
		if(event.keyCode === 13 && $scope.addFreezerForm.freezerId.$valid) {
			var retrieveFreezerPromise = $http.get(httpUrls.freezerUnit + $scope.addFreezerFormInput.freezerId);
			
			retrieveFreezerPromise.then(function(data) {
				if(data.data.length > 0) {
					$scope.addFreezerFormInputValidity.freezerId = 'duplicate';
					return;
				}
				
				$scope.addFreezerFormInputValidity.freezerId = 'OK';
				$scope.transitionOnEnter(event);
			});
			
			retrieveFreezerPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.validateFreezerRack = function(event, formField, inputModel, errorProperty, successCallback) {
		$scope.addFreezerFormInputValidity[errorProperty] = null;
		
		if(event.keyCode === 13 && formField.$valid) {
			// Check for local duplicates:
			for(var i=0; i<$scope.addFreezerFormInput.racks.length; i++) {
				if(inputModel.freezerRackId && $scope.addFreezerFormInput.racks[i] !== inputModel && $scope.addFreezerFormInput.racks[i] && $scope.addFreezerFormInput.racks[i].freezerRackId === inputModel.freezerRackId) {
					$scope.addFreezerFormInputValidity[errorProperty] = 'duplicate';
					return;
				}
			}
			
			// Check for Duplicate Freezer Rack
			var retrieveFreezerFromRackPromise = $http.get(httpUrls.freezerRack + inputModel.freezerRackId);
			
			retrieveFreezerFromRackPromise.then(function(data) {
				if(inputModel.freezerRackId === data.data.freezerRackId) {
					$scope.addFreezerFormInputValidity[errorProperty] = 'duplicate';
					return;
				}
				
				$scope.addFreezerFormInputValidity[errorProperty] = 'OK';
				
				if(successCallback) {
					successCallback();
				} else {
					$scope.transitionOnEnter(event);
				}
			});
			
			retrieveFreezerFromRackPromise.catch(function() {
				console.log('Problem');
				
			});
		}
	};
	
	$scope.validateFreezerRackAndSubmit = function(event, formField, inputModel, errorProperty) {
		
		var successCallback = function() {
			if($scope.addFreezerForm.$valid && isFormValid()) {
				var promises = [];
				for(var i=0; i<4; i++) {
					$scope.addFreezerFormInput.racks[i].freezerUnitId = $scope.addFreezerFormInput.freezerId;
					$scope.addFreezerFormInput.racks[i].position = i;
					promises.push($http.post(httpUrls.freezerRack, $scope.addFreezerFormInput.racks[i]));
				}
				
				$q.all(promises).then(function() {
					$scope.created = true;
				});
			}
		};
		
		$scope.validateFreezerRack(event, formField, inputModel, errorProperty, successCallback);
	};
	
	var isFormValid = function() {
		if($scope.addFreezerForm.$valid && $scope.addFreezerFormInputValidity.freezerId === 'OK' && 
			$scope.addFreezerFormInputValidity.rack0 === 'OK'&&
			$scope.addFreezerFormInputValidity.rack1 === 'OK' && $scope.addFreezerFormInputValidity.rack2 === 'OK' &&
			$scope.addFreezerFormInputValidity.rack3 === 'OK') {
			return true;
		} else {
			return false;
		}
	};
	
	$timeout(function() {
		document.getElementById('freezerId').focus();
	});
});