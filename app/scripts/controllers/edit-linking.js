'use strict';

/**
 * @ngdoc function
 * @name ishaLogisticsApp.controller:EditLinkingCtrl
 * @description
 * # EditLinkingCtrl
 * Controller of the ishaLogisticsApp
 */
angular.module('ishaLogisticsApp').controller('EditLinkingCtrl', function ($scope, $timeout, $http, $q, $location, Auth) {
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
	
		
	$scope.currentEdtaTube = {edtaTubeId: null, remarks: null, plasma: [],
	                          buffyCoat: [], buffyCoatRBC: [], rbc: []};

	$scope.currentEdtaTubeValidity = {};

	$scope.retrievedEdtaTube = {edtaTubeId: null, remarks: null, cryovials: [],
		                        plasma: [], buffyCoat: [], buffyCoatRBC: [], rbc: []};
		
	$scope.busy = false;
	
	$scope.validateCryovial = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, callback) {
        $scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = null;

        console.log("Model "+JSON.stringify(model));

		if(event.keyCode === 13 && typeof(model.cryovialId) !== 'undefined' && model.cryovialId !== null){	
			console.log("Done "+currentEdtaTubeValidityField);
		}	
  
		/*if(event.keyCode === 13) {
			if(formValidationField.$invalid) {
				delete $scope.currentEdtaTubeValidity[currentEdtaTubeValidityField];
				if(model) {
					model.cryovialId = null;
				}
				return false;
			}
			
			if(!model.cryovialId) {
				$scope.transitionOnEnter(event);
				delete $scope.currentEdtaTubeValidity[currentEdtaTubeValidityField];
				if(callback) {
					callback(event);
				}
				return;
			}
			
			for(var i=0; i<parentModel.length; i++) {
				if(parentModel[i] !== model && parentModel[i].cryovialId === model.cryovialId) {
					$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = {duplicate: true};
					model.cryovialId = null;
					formValidationField.$setPristine();
					return false;
				}
			}
			
			var httpPromise = $http.get(httpUrls.cryovial + '/' + model.cryovialId);
			
			var validCallback = function() {
				delete $scope.currentEdtaTubeValidity[currentEdtaTubeValidityField];
				if(callback) {
					callback(event);
				}
				$scope.transitionOnEnter(event);
			};
			
			var invalidCallback = function() {
				$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = {duplicate: true};
				model.cryovialId = null;
			};
			
			httpPromise.success(function(data) {
				if(model.cryovialId !== data.cryovialId || data.edtaTubeId === $scope.currentEdtaTube.edtaTubeId) {
					validCallback();
				} else {
					invalidCallback();
				}
			});
			
			httpPromise.error(function() {
				console.error('Problem');
			});
		} else {
			delete $scope.currentEdtaTubeValidity[currentEdtaTubeValidityField];
		}*/
	};
	
	/*$scope.validateCryovialAndSubmit = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField) {
		$scope.validateCryovial(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, $scope.updateLinking);
	};*/
	
	$scope.retrieveEdtaTube = function(event) {		
		
		$scope.currentEdtaTube = {edtaTubeId: $scope.currentEdtaTube.edtaTubeId};

		if(event.keyCode === 13 && $scope.editLinkingForm.edtaTubeId.$valid) {
			console.log("Retrieving EDTA Tube");
			var httpPromise = $http.get(httpUrls.linking+ $scope.currentEdtaTube.edtaTubeId);
			
			httpPromise.then(function(response) {
				console.log("Response "+JSON.stringify(response.data));
				if(response.data.length === 0) {
					console.log('not found');
					$scope.currentEdtaTube.edtaTubeId = null;
					$scope.editLinkingForm.$setPristine();
					$scope.currentEdtaTubeValidity.edtaTubeId = {};
					$scope.currentEdtaTubeValidity.edtaTubeId.notFound = true;
					return;
				}else{
					$scope.currentEdtaTube = {edtaTubeId: response.data[0].edtaTubeId, 
						                      remarks: response.data[0].remarks};
					$scope.retrievedEdtaTube = {edtaTubeId: response.data[0].edtaTubeId, 
						                        remarks: response.data[0].remarks,
					                            cryovials: [], plasma: [], buffyCoat: [], 
					                            buffyCoatRBC: [], rbc: []};	                      
				    $scope.currentEdtaTube.plasma = [];
				    $scope.currentEdtaTube.buffyCoat = [];
				    $scope.currentEdtaTube.buffyCoatRBC = [];
				    $scope.currentEdtaTube.rbc = [];

				    for(var i=0; i<response.data.length;i++){

				     $scope.retrievedEdtaTube.cryovials.push(response.data[i].cryovialId);

				    	if(response.data[i].cryovialType === 'Plasma') {
						//$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.retrievedEdtaTube.plasma.push({cryovialId: response.data[i].cryovialId,
							                                  cryovialType: response.data[i].cryovialType});
						$scope.currentEdtaTube.plasma.push({cryovialId: response.data[i].cryovialId, 
							                                cryovialType: response.data[i].cryovialType});
					   } else if(response.data[i].cryovialType === 'BuffyCoat') {
						//$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.retrievedEdtaTube.buffyCoat.push({cryovialId: response.data[i].cryovialId,
							                                  cryovialType: response.data[i].cryovialType});
						$scope.currentEdtaTube.buffyCoat.push({cryovialId: response.data[i].cryovialId, 
							                                   cryovialType: response.data[i].cryovialType});
					   } else if(response.data[i].cryovialType === 'BuffyCoatRBC') {
						//$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.retrievedEdtaTube.buffyCoatRBC.push({cryovialId: response.data[i].cryovialId,
							                                  cryovialType: response.data[i].cryovialType});
						$scope.currentEdtaTube.buffyCoatRBC.push({cryovialId: response.data[i].cryovialId, 
							                                      cryovialType: response.data[i].cryovialType});
					   } else if(response.data[i].cryovialType === 'RBC') {
						//$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.retrievedEdtaTube.rbc.push({cryovialId: response.data[i].cryovialId,
							                                  cryovialType: response.data[i].cryovialType});
						$scope.currentEdtaTube.rbc.push({cryovialId: response.data[i].cryovialId, 
							                             cryovialType: response.data[i].cryovialType});
					   } 
				    }
				}
				/*$scope.retrievedEdtaTube = {edtaTubeId: data[0].edtaTubeId, remarks: data[0].remarks};
				$scope.retrievedEdtaTube.cryovials = [];
				
				// Create custom EdtaTube.
				$scope.currentEdtaTube = {edtaTubeId: data[0].edtaTubeId, remarks: data[0].remarks};
				$scope.currentEdtaTube.plasma = [];
				$scope.currentEdtaTube.buffyCoat = [];
				$scope.currentEdtaTube.rbc = [];
				
				for(var i=0; i<data.length; i++) {
					if(data[i].cryovialType === 'Plasma') {
						$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.currentEdtaTube.plasma.push({cryovialId: data[i].cryovialId, cryovialType: data[i].cryovialType});
					} else if(data[i].cryovialType === 'BuffyCoat') {
						$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.currentEdtaTube.buffyCoat.push({cryovialId: data[i].cryovialId, cryovialType: data[i].cryovialType});
					} else if(data[i].cryovialType === 'RBC') {
						$scope.retrievedEdtaTube.cryovials.push(data[i].cryovialId);
						$scope.currentEdtaTube.rbc.push({cryovialId: data[i].cryovialId, cryovialType: data[i].cryovialType});
					}
				}
				
				while($scope.currentEdtaTube.plasma.length < 4) {
					$scope.currentEdtaTube.plasma.push({cryovialType: 'Plasma'});
				}
				
				while($scope.currentEdtaTube.buffyCoat.length < 4) {
					$scope.currentEdtaTube.buffyCoat.push({cryovialType: 'BuffyCoat'});
				}
				
				while($scope.currentEdtaTube.rbc.length < 4) {
					$scope.currentEdtaTube.rbc.push({cryovialType: 'RBC'});
				}
				
				$scope.transitionOnEnter(event);*/
			});
			
			httpPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.validateRemarks = function(event) {
		if(event.keyCode === 13) {
			if($scope.editLinkingForm.remarks.$invalid) {
				return false;
			}
			
			if($scope.editLinkingForm.remarks.$valid) {
				// TODO: Check if remarks is valid.
				
				$scope.transitionOnEnter(event);
				return true;
			} else {
				delete $scope.currentEdtaTube.remarks;
				return false;
			}
		}
	};
	
	$scope.updateLinking = function() {
		//Check all input fields are valid
		console.log("EDTATube "+$scope.editLinkingForm.edtaTubeId.$valid)
		console.log("Remarks "+$scope.editLinkingForm.remarks.$valid)
		if($scope.editLinkingForm.edtaTubeId.$valid && 
		   $scope.retrievedEdtaTube.edtaTubeId !== null &&	
		   $scope.currentEdtaTube.plasma.length > 0 &&  checkAllFields()) {
			console.log('Ready to update');
			/*$scope.busy = true;
			
			//var httpPromise = $http.put(httpUrls.linking + $scope.currentEdtaTube.edtaTubeId, $scope.currentEdtaTube);
			var editedEdtaTube = { edtaTubeId: $scope.currentEdtaTube.edtaTubeId, 
				                   remarks: $scope.currentEdtaTube.remarks};
			
			//editedEdtaTube.cryovials = [];

			
			console.log('editedEdtaTube: ' + JSON.stringify(editedEdtaTube));

            var i;
			var deletePromises = [];
			for(i=0; i<$scope.retrievedEdtaTube.cryovials.length; i++) {
				console.log("Delete Cryovial "+$scope.retrievedEdtaTube.cryovials[i]);
				deletePromises.push($http.delete(httpUrls.cryovial + $scope.retrievedEdtaTube.cryovials[i]));				
			}*/
			
			// TODO: Update current model
			/*for(var i=0; i<$scope.currentEdtaTube.plasma.length; i++) {
				if($scope.currentEdtaTube.plasma[i].cryovialId) {
					editedEdtaTube.cryovials.push($scope.currentEdtaTube.plasma[i].cryovialId);
				}
			}
			
			for(i=0; i<$scope.currentEdtaTube.buffyCoat.length; i++) {
				if($scope.currentEdtaTube.buffyCoat[i].cryovialId) {
					editedEdtaTube.cryovials.push($scope.currentEdtaTube.buffyCoat[i].cryovialId);
				}
			}
			
			for(i=0; i<$scope.currentEdtaTube.rbc.length; i++) {
				if($scope.currentEdtaTube.rbc[i].cryovialId) {
					editedEdtaTube.cryovials.push($scope.currentEdtaTube.rbc[i].cryovialId);
				}
			}
			
			console.log('editedEdtaTube: ' + JSON.stringify(editedEdtaTube));
			
			// TODO: Remove Stale Cryovial IDs
			var promises = [];
			for(i=0; i<$scope.retrievedEdtaTube.cryovials.length; i++) {
				if(editedEdtaTube.cryovials.indexOf($scope.retrievedEdtaTube.cryovials[i])<0) {
					console.log('editedEdtaTube.cryovials: ' + editedEdtaTube.cryovials);
					console.log('$scope.retrievedEdtaTube.cryovials[' + i + ']: ' + $scope.retrievedEdtaTube.cryovials[i]);
					promises.push($http.delete(httpUrls.cryovial + $scope.retrievedEdtaTube.cryovials[i]));
				}
			}*/
			
			/*for(i=0; i<editedEdtaTube.cryovials.length; i++) {
				if(editedEdtaTube.cryovials.length > 0) {
					var cryovial = {};
					cryovial.edtaTubeId = editedEdtaTube.edtaTubeId;
					cryovial.remarks = editedEdtaTube.remarks;
					cryovial.cryovialId = editedEdtaTube.cryovials[i];
					cryovial.cryovialType = (cryovial.cryovialId.indexOf('PC')===0 ? 'Plasma' : (cryovial.cryovialId.indexOf('BC')===0 ? 'BuffyCoat': 'RBC'));
					promises.push($http.post(httpUrls.cryovial, cryovial));
				}
			}
			
			$q.all(promises).then(function() {
				$scope.busy = false;
				$scope.saved = true;
			});*/
		}
	};

	function checkAllFields(){
		console.log("Checking all fields");
        var i; 
		for(i=0;i<$scope.retrievedEdtaTube.plasma.length;i++){			
           if( typeof($scope.currentEdtaTube.plasma[i].cryovialId) !== 'undefined' &&
           	   $scope.currentEdtaTube.plasma[i].cryovialId !== null && 
           	   $scope.currentEdtaTube.plasma[i].cryovialId.length === 8 &&
           	   $scope.currentEdtaTube.plasma[i].cryovialId.startsWith('PC') &&
           	   /^\d+$/.test($scope.currentEdtaTube.plasma[i].cryovialId.substring(2))){
                console.log("Passed "+$scope.currentEdtaTube.plasma[i].cryovialId);
           }else{
           	return false;
           }
		}

		for(i=0;i<$scope.retrievedEdtaTube.buffyCoat.length;i++){
           if( typeof($scope.currentEdtaTube.buffyCoat[i].cryovialId) !== 'undefined' &&
           	   $scope.currentEdtaTube.buffyCoat[i].cryovialId !== null && 
           	   $scope.currentEdtaTube.buffyCoat[i].cryovialId.length === 8 &&
           	   $scope.currentEdtaTube.buffyCoat[i].cryovialId.startsWith('BC') &&
           	   /^\d+$/.test($scope.currentEdtaTube.buffyCoat[i].cryovialId.substring(2))){
                console.log("Passed "+$scope.currentEdtaTube.buffyCoat[i].cryovialId);
           }else{
           	return false;
           }
		}

		for(i=0;i<$scope.retrievedEdtaTube.buffyCoatRBC.length;i++){
           if( typeof($scope.currentEdtaTube.buffyCoatRBC[i].cryovialId) !== 'undefined' &&
           	   $scope.currentEdtaTube.buffyCoatRBC[i].cryovialId !== null && 
           	   $scope.currentEdtaTube.buffyCoatRBC[i].cryovialId.length === 8 &&
           	   $scope.currentEdtaTube.buffyCoatRBC[i].cryovialId.startsWith('BR') &&
           	   /^\d+$/.test($scope.currentEdtaTube.buffyCoatRBC[i].cryovialId.substring(2))){
                console.log("Passed "+$scope.currentEdtaTube.buffyCoatRBC[i].cryovialId);
           }else{
           	return false;
           }
		}

		for(i=0;i<$scope.retrievedEdtaTube.rbc.length;i++){
           if( typeof($scope.currentEdtaTube.rbc[i].cryovialId) !== 'undefined' &&
           	   $scope.currentEdtaTube.rbc[i].cryovialId !== null && 
           	   $scope.currentEdtaTube.rbc[i].cryovialId.length === 8 &&
           	   $scope.currentEdtaTube.rbc[i].cryovialId.startsWith('RC') &&
           	   /^\d+$/.test($scope.currentEdtaTube.rbc[i].cryovialId.substring(2))){
                console.log("Passed "+$scope.currentEdtaTube.rbc[i].cryovialId);
           }else{
           	return false;
           }
		}
		if($scope.editLinkingForm.edtaTubeId.$valid){
			console.log("Passed "+$scope.currentEdtaTube.edtaTubeId);
		}else{
			return false;
		}
		if($scope.editLinkingForm.remarks.$valid){
			console.log("Passed "+$scope.currentEdtaTube.remarks);
		}else{
			return false;
		}
	   	return true;
	}
	
	$timeout(function() {
		document.getElementById('edtaTube').focus();
	});
});