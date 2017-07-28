'use strict';


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
			console.log("Fetching the box "+$scope.openCryovialBoxFormInput.cryovialBoxId);
			var openCryovialBoxPromise = $http.get(httpUrls.cryovialBox + $scope.openCryovialBoxFormInput.cryovialBoxId);
			
			openCryovialBoxPromise.then(function(data) {
				console.log("Response "+JSON.stringify(data.data));
				if(data.data.cryovialBoxId !== $scope.openCryovialBoxFormInput.cryovialBoxId) {
					$scope.openCryovialBoxFormInputValidity = {notFound: true };
					console.error('notFound: ' + $scope.openCryovialBoxFormInput.cryovialBoxId);
				} else {
					$scope.currentCryovialBox = data.data;
					setCryovialBoxType();
					
					// Retrieve All Cryovials stored in box
					var retrieveItemMapPromise = $http.get(httpUrls.cryovial + 'cryovialBoxId/' + $scope.openCryovialBoxFormInput.cryovialBoxId);
					
					retrieveItemMapPromise.then(function(data) {
						$scope.currentCryovialBoxItemMap = [];
						$scope.currentCryovialBoxItems = data.data;
						for(var i=0; i<10; i++) {
							var row = [];
							for(var j=0; j<10; j++) {
								row.push(null);
							}
							$scope.currentCryovialBoxItemMap.push(row);
						}
						
						if(data.data.length > 0) {
							for(i=0; i<data.data.length; i++) {
								var row1 = $scope.currentCryovialBoxItemMap[data.data[i].cryovialBoxRow];
								row1.splice(data.data[i].cryovialBoxColumn,1,data.data[i].cryovialId);
								$scope.currentCryovialBoxEdtaTubes.push(data.data[i].edtaTubeId);
							}
							console.log('$scope.currentCryovialBoxEdtaTubes: ' + $scope.currentCryovialBoxEdtaTubes);
						}
						
						$timeout(function() {
							document.getElementById('cryovialId').focus();
						});
					});
					
					retrieveItemMapPromise.catch(function() {
						console.error('Problem');
					});
				}
			});
			
			openCryovialBoxPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.getChar = function(ascii) {
		return String.fromCharCode(ascii);
	};
	
	$scope.placeCryovial = function(event) {
		$scope.placeCryovialFormValidity = null;
		console.log("Inside place cryovial");
		
		if(event.keyCode === 13) {
			if($scope.placeCryovialForm.$invalid) {
				$scope.placeCryovialFormValidity = {formInvalid: true};
				console.log(">>> Place cryovial form Invallid <<<");
			}
			if(($scope.currentCryovialBox.cryovialType === 'Plasma' && $scope.placeCryovialFormInput.cryovialId.indexOf('PC') !== 0) ||
				($scope.currentCryovialBox.cryovialType === 'BuffyCoat' && $scope.placeCryovialFormInput.cryovialId.indexOf('BC') !== 0) ||
				($scope.currentCryovialBox.cryovialType === 'RBC' && $scope.placeCryovialFormInput.cryovialId.indexOf('RC') !== 0)) {
				$scope.placeCryovialFormValidity = {type: true};
			    console.log(">>>> Returning <<<<<");
				return;
			}
			
			var retrieveBoxPromise = $http.get(httpUrls.cryovial + $scope.placeCryovialFormInput.cryovialId);
			
			retrieveBoxPromise.then(function(data) {
				console.log("Place Cryovial response "+JSON.stringify(data.data));
				if(data.data.cryovialId !== $scope.placeCryovialFormInput.cryovialId) {
					// Cryovial not linked
					$scope.placeCryovialFormValidity = {notLinked: true};
					return;
				}
					
				// Check if Already Packed:
				if(data.data.cryovialBoxId !== null && data.data.cryovialBoxRow !== null && data.data.cryovialBoxColumn !== null) {
					$scope.placeCryovialFormValidity = {packed: true};
					return;
				}
				
				// Check if same EDTA is already placed in the current box
				console.log('$scope.currentCryovialBoxEdtaTubes: ' + $scope.currentCryovialBoxEdtaTubes);
				if($scope.currentCryovialBoxEdtaTubes.indexOf(data.data.edtaTubeId) >= 0) {
					$scope.placeCryovialFormValidity = {duplicateEdta: true};
					return;
				}

				console.log('currentCryovialBoxItemMap: ' + $scope.currentCryovialBoxItemMap);
				
				// Find empty location in box.
				for(var row=0; row<10; row++) {
					for(var column=0; column < 10; column++) {
						console.log('row: ' + row + ' column: ' + column);
						if(!$scope.currentCryovialBoxItemMap[row][column]) {
							console.log('Is Empty');
							data.data.cryovialBoxRow = row;
							data.data.cryovialBoxColumn = column;
							console.log('Cryovial Empty Location: [' + row + ',' + column + ']');
							break;
						} else {
							console.log('Is Not Empty');
						}
					}
					
					if(data.data.cryovialBoxRow !== null && data.data.cryovialBoxColumn !== null) {
						console.log('Breaking');
						console.log('Row: ' + data.data.cryovialBoxRow);
						console.log('Column: ' + data.data.cryovialBoxColumn);
						break;
					}
				}
				
				// check if box is full
				if(typeof data.data.cryovialBoxRow === 'undefined' || typeof data.data.cryovialBoxColumn === 'undefined') {
					$scope.placeCryovialFormValidity = {boxFull: true};
					return;
				}
				
				// Place cryovial
				data.data.cryovialBoxId = $scope.currentCryovialBox.cryovialBoxId;
				console.log('Updated Cryovial Data: ' + JSON.stringify(data.data));
				//var update_cryovial={}
				var placePromise = $http.post(httpUrls.cryovial, JSON.stringify(data.data));
				
				placePromise.then(function() {
					$scope.currentCryovialBoxItemMap[data.cryovialBoxRow].splice(data.cryovialBoxColumn, 1, data.cryovialId);
					$scope.currentCryovialBox = data;
					$scope.currentCryovialBoxEdtaTubes.push(data.edtaTubeId);
					$scope.placeCryovialFormInput.cryovialId = null;
					$scope.currentCryovialBoxItems.push(data);
					console.log('items: ' + JSON.stringify($scope.currentCryovialBoxItemMap));
				});
				
				placePromise.catch(function() {
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

	function setCryovialBoxType(){
		if($scope.openCryovialBoxFormInput.cryovialBoxId.startsWith('PB')){
			$scope.currentCryovialBox.cryovialType = 'Plasma';
			console.log("Cryovial Box Type "+$scope.currentCryovialBox.cryovialType);
		}else if($scope.openCryovialBoxFormInput.cryovialBoxId.startsWith('BB')){
			$scope.currentCryovialBox.cryovialType = 'BuffyCoat';
			console.log("Cryovial Box Type "+$scope.currentCryovialBox.cryovialType);
		}else if($scope.openCryovialBoxFormInput.cryovialBoxId.startsWith('BRB')){
			$scope.currentCryovialBox.cryovialType = 'BuffyCoatRBC';
			console.log("Cryovial Box Type "+$scope.currentCryovialBox.cryovialType);
		}else if($scope.openCryovialBoxFormInput.cryovialBoxId.startsWith('RB')){
			$scope.currentCryovialBox.cryovialType = 'RBC';
			console.log("Cryovial Box Type "+$scope.currentCryovialBox.cryovialType);
		}
		
	}
	
	$timeout(function() {
		document.getElementById('cryovialBoxId').focus();
	});
});