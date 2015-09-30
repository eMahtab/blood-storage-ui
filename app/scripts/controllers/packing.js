'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:PackingCtrl
 * @description
 * # PackingCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('PackingCtrl', function ($scope, $http, $timeout, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		cryovialBox: 'http://localhost:8080/services/api/entity/cryovialBox/',
		cryovial: 'http://localhost:8080/services/api/entity/cryovial/'
	};
	
	$scope.Math = Math;
	
	$scope.openCryovialBoxFormInput = {};
	$scope.openCryovialBoxFormInputValidity = null;
		
	$scope.currentCryovialBox = null;
	$scope.currentCryovialBoxItemMap = null;
	$scope.currentCryovialBoxItems = [];
	$scope.currentCryovialBoxEdtaTubes = [];
		
	$scope.placeCryovialFormInput = {};
	$scope.placeCryovialFormValidity = null;
	
	$scope.openCryovialBox = function(event) {
		$scope.currentCryovialBoxEdtaTubes = [];
		$scope.openCryovialBoxFormInputValidity = null;
		if(event.keyCode === 13 && $scope.openCryovialBoxForm.$valid) {
			var openCryovialBoxPromise = $http.get(httpUrls.cryovialBox + $scope.openCryovialBoxFormInput.cryovialBoxId);
			
			openCryovialBoxPromise.success(function(data) {
				if(data.cryovialBoxId !== $scope.openCryovialBoxFormInput.cryovialBoxId) {
					$scope.openCryovialBoxFormInputValidity = {notFound: true };
					console.error('notFound: ' + $scope.openCryovialBoxFormInput.cryovialBoxId);
				} else {
					$scope.currentCryovialBox = data;
					
					// Retrieve All Cryovials stored in box
					var retrieveItemMapPromise = $http.get(httpUrls.cryovial + 'cryovialBoxId/' + $scope.openCryovialBoxFormInput.cryovialBoxId);
					
					retrieveItemMapPromise.success(function(data) {
						$scope.currentCryovialBoxItemMap = [];
						$scope.currentCryovialBoxItems = data;
						for(var i=0; i<10; i++) {
							var row = [];
							for(var j=0; j<10; j++) {
								row.push(null);
							}
							$scope.currentCryovialBoxItemMap.push(row);
						}
						
						if(data) {
							for(i=0; i<data.length; i++) {
								var row1 = $scope.currentCryovialBoxItemMap[data[i].cryovialBoxRow];
								row1.splice(data[i].cryovialBoxColumn,1,data[i].cryovialId);
								$scope.currentCryovialBoxEdtaTubes.push(data[i].edtaTubeId);
							}
							console.log('$scope.currentCryovialBoxEdtaTubes: ' + $scope.currentCryovialBoxEdtaTubes);
						}
						
						$timeout(function() {
							document.getElementById('cryovialId').focus();
						});
					});
					
					retrieveItemMapPromise.error(function() {
						console.error('Problem');
					});
				}
			});
			
			openCryovialBoxPromise.error(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.getChar = function(ascii) {
		return String.fromCharCode(ascii);
	};
	
	$scope.placeCryovial = function(event) {
		$scope.placeCryovialFormValidity = null;
		
		if(event.keyCode === 13) {
			if($scope.placeCryovialForm.$invalid) {
				$scope.placeCryovialFormValidity = {formInvalid: true};
			}
			if(($scope.currentCryovialBox.cryovialType === 'Plasma' && $scope.placeCryovialFormInput.cryovialId.indexOf('PC') !== 0) ||
				($scope.currentCryovialBox.cryovialType === 'BuffyCoat' && $scope.placeCryovialFormInput.cryovialId.indexOf('BC') !== 0) ||
				($scope.currentCryovialBox.cryovialType === 'RBC' && $scope.placeCryovialFormInput.cryovialId.indexOf('RC') !== 0)) {
				$scope.placeCryovialFormValidity = {type: true};
				return;
			}
			
			var retrieveBoxPromise = $http.get(httpUrls.cryovial + $scope.placeCryovialFormInput.cryovialId);
			
			retrieveBoxPromise.success(function(data) {
				if(data.cryovialId !== $scope.placeCryovialFormInput.cryovialId) {
					// Cryovial not linked
					$scope.placeCryovialFormValidity = {notLinked: true};
					return;
				}
					
				// Check if Already Packed:
				if(data.cryovialBoxId !== null && data.cryovialBoxRow !== null && data.cryovialBoxColumn !== null) {
					$scope.placeCryovialFormValidity = {packed: true};
					return;
				}
				
				// Check if same EDTA is already placed in the current box
				console.log('$scope.currentCryovialBoxEdtaTubes: ' + $scope.currentCryovialBoxEdtaTubes);
				if($scope.currentCryovialBoxEdtaTubes.indexOf(data.edtaTubeId) >= 0) {
					$scope.placeCryovialFormValidity = {duplicateEdta: true};
					return;
				}
				
				// Find empty location in box.
				for(var row=0; row<10; row++) {
					for(var column=0; column < 10; column++) {
						if(!$scope.currentCryovialBoxItemMap[row][column]) {
							data.cryovialBoxRow = row;
							data.cryovialBoxColumn = column;
							console.log('Cryovial Empty Location: [' + row + ',' + column + ']');
							break;
						}
					}
					
					if(typeof data.cryovialBoxRow !== 'undefined' && typeof data.cryovialBoxColumn !== 'undefined') {
						break;
					}
				}
				
				// check if box is full
				if(typeof data.cryovialBoxRow === 'undefined' && typeof data.cryovialBoxColumn === 'undefined') {
					$scope.placeCryovialFormValidity = {boxFull: true};
					return;
				}
				
				// Place cryovial
				data.cryovialBoxId = $scope.currentCryovialBox.cryovialBoxId;
				console.log('Updated Cryovial Data: ' + JSON.stringify(data));
				var placePromise = $http.post(httpUrls.cryovial, data);
				
				placePromise.success(function() {
					$scope.currentCryovialBoxItemMap[data.cryovialBoxRow].splice(data.cryovialBoxColumn, 1, data.cryovialId);
					$scope.currentCryovialBox = data;
					$scope.currentCryovialBoxEdtaTubes.push(data.edtaTubeId);
					$scope.placeCryovialFormInput.cryovialId = null;
					$scope.currentCryovialBoxItems.push(data);
					console.log('items: ' + JSON.stringify($scope.currentCryovialBoxItemMap));
				});
				
				placePromise.error(function() {
					console.error('Problem');
				});
			});
		}
	};
	
	$scope.closeCryovialBox = function() {
		$scope.currentCryovialBoxItemMap=null;
		$scope.currentCryovialBox=null;
		$scope.currentCryovialBoxEdtaTubes = [];
		$scope.openCryovialBoxFormInput = {};
		$scope.placeCryovialFormInput.cryovialId = null;
		$scope.placeCryovialFormValidity = null;
		$timeout(function() {
			document.getElementById('cryovialBoxId').focus();
		});
	};
	
	$timeout(function() {
		document.getElementById('cryovialBoxId').focus();
	});
});