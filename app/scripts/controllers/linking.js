'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:LinkingCtrl
 * @description
 * # LinkingCtrl
 * Controller of the ishaLogisticsApp
 */

angular.module('ishaLogisticsApp').controller('LinkingCtrl', function ($scope, $timeout, $http, $q, $location, Auth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	
	if(!Auth.isLoggedIn()) {
		$location.path('/login');
	}
	
	var httpUrls = {
		linking: 'http://localhost:8080/services/api/entity/cryovial/edtaTubeId/',
		cryovial: 'http://localhost:8080/services/api/entity/cryovial/',
	};
	
	$scope.message = 'Hello';
	
	$scope.currentEdtaTube = {edtaTubeId: null, remarks: null, plasma: [{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'}], buffyCoat: [{cryovialType: 'BuffyCoat'},{cryovialType: 'BuffyCoat'}], rbc: [{cryovialType: 'RBC'}]};
	
	$scope.edtaTubes = [];

	$scope.currentEdtaTubeValidity = {};
	
	$scope.validateCryovial = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, callback) {
		$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = null;
		if(event.keyCode === 13 && formValidationField.$valid) {
			if(!model.cryovialId) {
				$scope.transitionOnEnter(event);
				$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = 'OK';
				if(callback) {
					callback(event);
				}
				return;
			}
			for(var i=0; i<parentModel.length; i++) {
				if(parentModel[i] !== model && parentModel[i].cryovialId === model.cryovialId) {
					$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = 'duplicate';
					model.cryovialId = null;
					formValidationField.$setPristine();
					return;
				}
			}
			
			var httpPromise = $http.get(httpUrls.cryovial + model.cryovialId);
			
			httpPromise.success(function(data) {
				if(model.cryovialId === data.cryovialId) {
					console.error('Found cryovial having ID: ' + data.cryovialId);
					$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = 'duplicate';
					model.cryovialId = null;
				} else {
					console.log('Cannot find cryovial: ' + model.cryovialId);
					$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = 'OK';
					if(callback) {
						callback(event);
					}
					$scope.transitionOnEnter(event);
				}
			});
			
			httpPromise.error(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.validateCryovialAndSubmit = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField) {
		$scope.validateCryovial(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, createLinking);
	};
	
	$scope.validateEdtaId = function(event) {
		$scope.currentEdtaTubeValidity.edtaTubeId = null;
		if(event.keyCode === 13 && $scope.linkingForm.edtaTubeId.$valid) {
			var httpPromise = $http.get(httpUrls.linking + $scope.currentEdtaTube.edtaTubeId);
			
			httpPromise.success(function(data) {
				if(data.length > 0) {
					console.log('edtaTubes: ' + JSON.stringify(data));
					$scope.currentEdtaTube.edtaTubeId = null;
					$scope.currentEdtaTubeValidity.edtaTubeId = 'duplicate';
				} else {
					$scope.currentEdtaTubeValidity.edtaTubeId = 'OK';
					$scope.transitionOnEnter(event);
				}
			});
			httpPromise.error(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.validateRemarks = function(event) {
		if(event.keyCode === 13) {
			if($scope.linkingForm.remarks.$invalid) {
				return false;
			}
			
			if($scope.linkingForm.remarks.$valid) {
				// TODO: Check if remarks is valid.
				
				$scope.transitionOnEnter(event);
				return true;
			} else {
				delete $scope.currentEdtaTube.remarks;
				return false;
			}
		}
	};
	
	var createLinking = function(event) {
		if(event.keyCode === 13 && $scope.linkingForm.$valid && isFormValid()) {
			var newEdtaTube = JSON.parse(JSON.stringify($scope.currentEdtaTube));
			
			// Remove cryovials without cryovialID
			removeCryovialsWithoutCryovialId(newEdtaTube);
			
			console.log('newEdtaTube: ' + JSON.stringify(newEdtaTube));
			
			// TODO: Create a list of promises
			var promises = [];
			for(var i=0; i<newEdtaTube.plasma.length; i++) {
				promises.push($http.post(httpUrls.cryovial, {
					edtaTubeId: newEdtaTube.edtaTubeId,
					cryovialId: newEdtaTube.plasma[i].cryovialId,
					cryovialType: newEdtaTube.plasma[i].cryovialType,
					remarks: newEdtaTube.remarks
				}));
			}
			
			for(i=0; i<newEdtaTube.buffyCoat.length; i++) {
				promises.push($http.post(httpUrls.cryovial, {
					edtaTubeId: newEdtaTube.edtaTubeId,
					cryovialId: newEdtaTube.buffyCoat[i].cryovialId,
					cryovialType: newEdtaTube.buffyCoat[i].cryovialType,
					remarks: newEdtaTube.remarks
				}));
			}
			
			for(i=0; i<newEdtaTube.rbc.length; i++) {
				promises.push($http.post(httpUrls.cryovial, {
					edtaTubeId: newEdtaTube.edtaTubeId,
					cryovialId: newEdtaTube.rbc[i].cryovialId,
					cryovialType: newEdtaTube.rbc[i].cryovialType,
					remarks: newEdtaTube.remarks
				}));
			}
			
			// TODO: 
			$q.all(promises).then(function(results) {
				if(results.length === promises.length) {
					var success = true;
					for(i=0; i<results.length; i++) {
						if(results.status === 200) {
							success = false;
							break;
						}
					}
					
					if(success) {
						$scope.edtaTubes.splice(0,0,$scope.currentEdtaTube);
						$scope.currentEdtaTube = {edtaTubeId: null, remarks: null, plasma: [{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'}], buffyCoat: [{cryovialType: 'BuffyCoat'},{cryovialType: 'BuffyCoat'}], rbc: [{cryovialType: 'RBC'}]};
						

						$scope.linkingForm.$setPristine();
					} else {
						console.error('Problem creating EDTA Tube. status: ' + status);
					}
				}
			});
		}
	};
	
	var removeCryovialsWithoutCryovialId = function(newEdtaTube) {
		var toRemove = [];
		for(var i=0; i<newEdtaTube.plasma.length; i++) {
			if(!newEdtaTube.plasma[newEdtaTube.plasma.length-i-1].cryovialId) {
				toRemove.push(newEdtaTube.plasma.length-i-1);
			}
		}
		
		for(i=0; i<toRemove.length; i++) {
			newEdtaTube.plasma.splice(toRemove[i], 1);
		}
		
		toRemove = [];
		for(i=0; i<newEdtaTube.buffyCoat.length; i++) {
			if(!newEdtaTube.buffyCoat[newEdtaTube.buffyCoat.length-i-1].cryovialId) {
				toRemove.push(newEdtaTube.buffyCoat.length-i-1);
			}
		}
		
		for(i=0; i<toRemove.length; i++) {
			newEdtaTube.buffyCoat.splice(toRemove[i], 1);
		}
		
		toRemove = [];
		for(i=0; i<newEdtaTube.rbc.length; i++) {
			if(!newEdtaTube.rbc[newEdtaTube.rbc.length-i-1].cryovialId) {
				newEdtaTube.rbc.splice(newEdtaTube.rbc.length-i-1, 1);
			}
		}
		
		for(i=0; toRemove.length; i++) {
			newEdtaTube.rbc.splice(toRemove[i],1);
		}
		
		return newEdtaTube;
	};
	
	var isFormValid = function() {
		if($scope.linkingForm.edtaTubeId.$valid && $scope.currentEdtaTubeValidity.edtaTubeId === 'OK' &&
			$scope.linkingForm.plasma1.$valid && $scope.currentEdtaTubeValidity.plasma1 === 'OK' &&
			$scope.linkingForm.plasma2.$valid && (!$scope.currentEdtaTube.plasma[1].cryovialId || $scope.currentEdtaTubeValidity.plasma2 === 'OK') &&
			$scope.linkingForm.plasma3.$valid && (!$scope.currentEdtaTube.plasma[2].cryovialId || $scope.currentEdtaTubeValidity.plasma3 === 'OK') &&
			$scope.linkingForm.plasma4.$valid && (!$scope.currentEdtaTube.plasma[3].cryovialId || $scope.currentEdtaTubeValidity.plasma4 === 'OK') &&
			$scope.linkingForm.buffyCoat1.$valid && (!$scope.currentEdtaTube.buffyCoat[0].cryovialId || $scope.currentEdtaTubeValidity.buffyCoat1 === 'OK') &&
			$scope.linkingForm.buffyCoat2.$valid && (!$scope.currentEdtaTube.buffyCoat[1].cryovialId || $scope.currentEdtaTubeValidity.buffyCoat2 === 'OK') &&
			$scope.linkingForm.rbc.$valid && (!$scope.currentEdtaTube.rbc[0].cryovialId || $scope.currentEdtaTubeValidity.rbc === 'OK') &&
			$scope.linkingForm.remarks.$valid) {
			return true;
		} else {
			return false;
		}
	};
	
	$timeout(function() {
		document.getElementById('edtaTube').focus();
	});
});