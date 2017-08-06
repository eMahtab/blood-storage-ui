'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:StorageCtrl
 * @description
 * # StorageCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('StorageCtrl', function ($scope, $timeout, $http,$location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		freezerRack: 'http://localhost:8080/services/api/entity/freezerUnit/',
		freezerUnit: 'http://localhost:8080/services/api/entity/freezerUnit/freezerUnitId/',
		cryovialBox: 'http://localhost:8080/services/api/entity/cryovialBox/'
	};
	
	$scope.openFreezerRackFormInput = {};
	$scope.openFreezerRackFormInputValidity = null;
		
	$scope.placeCryovialBoxFormInput = {};
	$scope.placeCryovialBoxFormInput = null;
	
	$scope.currentFreezerUnit = null;
	
	$scope.cryovialBoxesPlaced = [];
		
	$scope.openFreezerRack = function(event) {
		$scope.openFreezerRackFormInputValidity = null;
		if(event.keyCode === 13 && $scope.openFreezerRackForm.$valid) {
			var retrieveFreezerFromRackPromise = $http.get(httpUrls.freezerRack + $scope.openFreezerRackFormInput.freezerRackId);
			
			retrieveFreezerFromRackPromise.then(function(data) {
				if($scope.openFreezerRackFormInput.freezerRackId !== data.data.freezerRackId) {
					$scope.openFreezerRackFormInputValidity = 'notFound';
					$scope.openFreezerRackFormInput.freezerRackId = null;
					return;
				}
				
				var retrieveFreezerPromise = $http.get(httpUrls.freezerUnit + data.data.freezerUnitId);
				
				retrieveFreezerPromise.then(function(data1) {
					var currentFreezerUnit = {};
					currentFreezerUnit.freezerId = data.data.freezerUnitId;
					currentFreezerUnit.racks  = [null,null,null,null];
					for(var i=0; i<data1.data.length; i++) {
						currentFreezerUnit.racks[data1.data[i].position] = {freezerRackId: data1.data[i].freezerRackId};
					}
					
					$scope.currentFreezerUnit = currentFreezerUnit;
					
					$timeout(function() {
						document.getElementById('cryovialBoxId').focus();
					});
				});
				
				retrieveFreezerPromise.catch(function() {
					console.error('Problem');
				});
			});
			
			retrieveFreezerFromRackPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.placeCryovialBoxInFreezerRack = function(event) {
		$scope.placeCryovialBoxFormInputValidity = null;
		if(event.keyCode === 13 && $scope.placeCryovialBoxForm.$valid) {
			console.log('Attempting to place');
			var cryovialBoxId = $scope.placeCryovialBoxFormInput.cryovialBoxId;
			var retrieveBoxPromise = $http.get(httpUrls.cryovialBox + $scope.placeCryovialBoxFormInput.cryovialBoxId);
			
			retrieveBoxPromise.then(function(data) {
				if($scope.placeCryovialBoxFormInput.cryovialBoxId !== data.data.cryovialBoxId) {
					$scope.placeCryovialBoxFormInputValidity = 'notFound';
					return;
				}
				
				data.data.freezerRackId = $scope.openFreezerRackFormInput.freezerRackId;
				
				var placeBoxPromise = $http.post(httpUrls.cryovialBox, data.data);
				
				placeBoxPromise.then(function(data, status) {
					console.log('success: ' + status);
					$scope.placeCryovialBoxFormInput.cryovialBoxId = null;
					$scope.placeCryovialBoxForm.cryovialBoxId.$setPristine();
					console.log('placed index: ' + $scope.cryovialBoxesPlaced.indexOf($scope.placeCryovialBoxFormInput.cryovialBoxId));
					if($scope.cryovialBoxesPlaced.indexOf(cryovialBoxId) < 0) {
						$scope.cryovialBoxesPlaced.push(cryovialBoxId);
					}
				});
			});
			
			retrieveBoxPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.closeFreezer = function() {
		$scope.currentFreezerUnit = null;
		$scope.openFreezerRackFormInput.freezerRackId = null;
		$scope.openFreezerRackForm.$setPristine();
		$scope.cryovialBoxesPlaced = [];
		$timeout(function() {
			document.getElementById('freezerRackId').focus();
		});
	};
	
	$timeout(function() {
		document.getElementById('freezerRackId').focus();
	});
});