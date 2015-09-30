'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:LocateCryovialCtrl
 * @description
 * # LocateCryovialCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('LocateCryovialCtrl', function ($scope, $http, $timeout, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		cryovial: 'http://localhost:8080/services/api/entity/cryovial/',
		cryovialBox: 'http://localhost:8080/services/api/entity/cryovialBox/',
		freezerUnit: 'http://localhost:8080/services/api/entity/freezerUnit/'
	};
	
	$scope.locateCryovialFormInput = {cryovialId: null};
	$scope.locateCryovialFormInputValidity = {};
	
	$scope.location = null;
	
	$scope.retrieveCryovial = function(event) {
		$scope.locateCryovialFormInputValidity = {};
		$scope.location = null;
			
		if(event.keyCode !== 13 || $scope.locateCryovialForm.$invalid) {
			return;
		}
		
		$scope.location = {};
		
		// Retrieve Cryovial
		var retrieveCryovialPromise = $http.get(httpUrls.cryovial + $scope.locateCryovialFormInput.cryovialId);
		
		retrieveCryovialPromise.success(function(data) {
			if($scope.locateCryovialFormInput.cryovialId !== data.cryovialId) {
				// TODO: Cryovial Not Found
				$scope.locateCryovialFormInputValidity = {notFound: true};
				return;
			}
			
			$scope.location.edtaTubeId = data.edtaTubeId;
			$scope.location.cryovialId = data.cryovialId;
			$scope.location.cryovialBoxId = data.cryovialBoxId;
			$scope.location.cryovialBoxRow = data.cryovialBoxRow;
			$scope.location.cryovialBoxColumn = data.cryovialBoxColumn;
			$scope.location.cryovialType = data.cryovialType;
			
			if($scope.location.cryovialBoxId !== null) {
				var retrieveCryovialBoxPromise = $http.get(httpUrls.cryovialBox + $scope.location.cryovialBoxId);
				retrieveCryovialBoxPromise.success(function(cryovialBoxData) {
					if($scope.location.cryovialBoxId !== cryovialBoxData.cryovialBoxId) {
						
						return;
					}
					
					$scope.location.freezerRackId = cryovialBoxData.freezerRackId;
					
					var retrieveFreezerUnitPromise = $http.get(httpUrls.freezerUnit + cryovialBoxData.freezerRackId);
					retrieveFreezerUnitPromise.success(function(freezerUnitData) {
						$scope.location.freezerUnitId = freezerUnitData.freezerUnitId;
						$scope.location.freezerRackPosition = freezerUnitData.position;
					});
				});
				retrieveCryovialBoxPromise.error(function() {
					console.error('Problem');
				});
			}
		});
		
		retrieveCryovialPromise.error(function() {
			console.error('Problem');
		});
	};
	
	$scope.getChar = function(ascii) {
		return String.fromCharCode(ascii);
	};
	
	$timeout(function() {
		document.getElementById('cryovialId').focus();
	});
});