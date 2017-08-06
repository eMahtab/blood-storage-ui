'use strict';


angular.module('ishaLogisticsApp').controller('LinkingCtrl', function ($window,$scope, $timeout, $http, $q, $location, Auth) {
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
	$scope.cryovialCombination=null;
	//$scope.linkingForm = {};
	

	function constructEDTATube(){
         //var tube = {};
         console.log(">>>>>>>>  Constructig EDTA Tube <<<<<<<<<<<<<");
         var plasma=[];
         var buffy = [];
         var buffyRBC = [];
         var rbc = [];
         var i = 0;
         var store = $window.localStorage;
         var currentCombination = JSON.parse(store.getItem('currentCombination'));

         $scope.cryovialCombination = store.getItem('defaultCryovialCombination');

         console.log("Plasma "+currentCombination.plasma);
         for(i=0;i<currentCombination.plasma;i++){
         	plasma.push({cryovialType: 'Plasma'});
         }
         for(i=0;i<currentCombination.buffycoat;i++){
         	buffy.push({cryovialType: 'BuffyCoat'});
         }
         for(i=0;i<currentCombination.buffycoatRBC;i++){
         	buffyRBC.push({cryovialType: 'BuffyCoatRBC'});
         }
         for(i=0;i<currentCombination.rbc;i++){
         	rbc.push({cryovialType: 'RBC'});
         }
         console.log("P array "+plasma);
         return {
         	   edtaTubeId: null, remarks: null,
         	   plasma: plasma, buffyCoat: buffy,
         	   buffyCoatRBC: buffyRBC, rbc: rbc
         };
	}

	$scope.combo=7;
	//constructEDTATube();
	
	/*$scope.currentEdtaTube = {edtaTubeId: null, remarks: null, 
		                      plasma: [{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},
		                               {cryovialType: 'Plasma'},{cryovialType: 'Plasma'}],
		                      buffyCoat: [{cryovialType: 'BuffyCoat'},{cryovialType: 'BuffyCoat'}],
		                      rbc: [{cryovialType: 'RBC'}]};*/

	$scope.currentEdtaTube = constructEDTATube();	                      
	
	$scope.edtaTubes = [];	

	$scope.currentEdtaTubeValidity = {};
	
	$scope.validateCryovial = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, callback) {
		console.log("Validating Cryovial"+JSON.stringify(model)+" > "+formValidationField.$valid); 
		$scope.currentEdtaTubeValidity[currentEdtaTubeValidityField] = null;


		if(event.keyCode === 13 && typeof(model.cryovialId) !== 'undefined' && model.cryovialId !== null){
			console.log("looks good "+model.cryovialId);
			if( checkCryovial(model.cryovialType,model.cryovialId) ){

			  var httpPromise = $http.get(httpUrls.cryovial + model.cryovialId);
			
			  httpPromise.then(function(response) {
				console.log("Validating Cryovial "+JSON.stringify(response));
				if(model.cryovialId === response.data.cryovialId) {
					console.error('Found cryovial having ID: ' + response.data.cryovialId);
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
			
			httpPromise.catch(function() {
				console.error('Problem');
			});
			}
			
		}

		//console.log("Form "+formValidationField);
		//console.log("Field "+currentEdtaTubeValidityField);
		//console.log("Form field JSON "+JSON.stringify(formValidationField));
		/*if(event.keyCode === 13 && formValidationField.$valid) {
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
			
			httpPromise.then(function(response) {
				console.log("Validating Cryovial "+JSON.stringify(response));
				if(model.cryovialId === response.data.cryovialId) {
					console.error('Found cryovial having ID: ' + response.data.cryovialId);
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
			
			httpPromise.catch(function() {
				console.error('Problem');
			});
		}*/
	};
	
	$scope.validateCryovialAndSubmit = function(event, model, parentModel, formValidationField, currentEdtaTubeValidityField) {
		$scope.validateCryovial(event, model, parentModel, formValidationField, currentEdtaTubeValidityField, createLinking);
	};

	function checkEDTA(edta){
		if (typeof(edta) !== 'undefined' && edta !== null)
           {
              console.log("Checking EDTA "+edta);
            if( edta !== null && edta.length === 8 && edta.startsWith("ET") && /^\d+$/.test(edta.substring(2)) ){
               console.log("EDTA is valid "+edta);	
               return true;
             }else{
            	console.log("EDTA is not valid "+edta);	
            	return false;
             }  
           }              
	}

	function checkCryovial(type, cryovial){
       if(type === 'Plasma' && cryovial.startsWith("PC") && /^\d+$/.test(cryovial.substring(2)) ){
       	  return true;
       }else if( type === 'BuffyCoat' && cryovial.startsWith("BC") && /^\d+$/.test(cryovial.substring(2))){
       	  return true;
       }else if( type === 'BuffyCoatRBC' && cryovial.startsWith("BR") && /^\d+$/.test(cryovial.substring(2)) ){
       	  return true;
       }else if( type === 'RBC' && cryovial.startsWith("RC") && /^\d+$/.test(cryovial.substring(2)) ){
       	  return true;
       }else{
       	return false;
       }
	}
	
	$scope.validateEdtaId = function(event) {		
		console.log("Validating EDTA Tube "+$scope.currentEdtaTube.edtaTubeId); 
		//$scope.currentEdtaTubeValidity.edtaTubeId = null;
		if(event.keyCode === 13 && checkEDTA($scope.currentEdtaTube.edtaTubeId)) {
			console.log("Pressed Enter and EDTA is valid");
			var httpPromise = $http.get(httpUrls.linking + $scope.currentEdtaTube.edtaTubeId);
			
			httpPromise.then(function(response) {
				console.log('Response: ' + JSON.stringify(response));
				if(response.data.length > 0) {
					console.log("Already used "+response.data);					
					$scope.currentEdtaTube.edtaTubeId = null;
					$scope.currentEdtaTubeValidity.edtaTubeId = 'duplicate';
				} else {
					console.log("Inside else "+response.data);
					$scope.currentEdtaTubeValidity.edtaTubeId = 'OK';
					$scope.transitionOnEnter(event);
				}
				
			});
			httpPromise.catch(function() {
				console.error('Problem');
			});
		}
	};
	
	$scope.validateRemarks = function(event) {
		console.log("Remarks "+$scope.currentEdtaTube.remarks);
		if(event.keyCode === 13 && typeof($scope.currentEdtaTube.remarks) !== 'undefined' &&
			 $scope.currentEdtaTube.remarks !== null) {
			if($scope.currentEdtaTube.remarks.length >= 5) {
				$scope.transitionOnEnter(event);
				return true;
			}else{
				return false;
			}			
		}
	};
	
	var createLinking = function(event) {

		if(event.keyCode === 13  && isFormValid()) {
			var newEdtaTube = JSON.parse(JSON.stringify($scope.currentEdtaTube));
			
			// Remove cryovials without cryovialID
			//removeCryovialsWithoutCryovialId(newEdtaTube);
			
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

			for(i=0; i<newEdtaTube.buffyCoatRBC.length; i++) {
				promises.push($http.post(httpUrls.cryovial, {
					edtaTubeId: newEdtaTube.edtaTubeId,
					cryovialId: newEdtaTube.buffyCoatRBC[i].cryovialId,
					cryovialType: newEdtaTube.buffyCoatRBC[i].cryovialType,
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
				console.log("All Promises "+JSON.stringify($scope.currentEdtaTube));
				//$scope.edtaTubes.splice(0,0,$scope.currentEdtaTube);

				if(results.length === promises.length) {
					var success = true;
					for(i=0; i<results.length; i++) {
						if(results.status === 200) {
							success = false;
							break;
						}
					}
					
					if(success) {
						//$scope.edtaTubes.splice(0,0,$scope.currentEdtaTube);
						//$scope.edtaTubes.push($scope.currentEdtaTube);
						$scope.edtaTubes.push(addEDTATube($scope.currentEdtaTube));
						//$scope.currentEdtaTube = {edtaTubeId: null, remarks: null, plasma: [{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'},{cryovialType: 'Plasma'}], buffyCoat: [{cryovialType: 'BuffyCoat'},{cryovialType: 'BuffyCoat'}], rbc: [{cryovialType: 'RBC'}]};
						$scope.currentEdtaTube = constructEDTATube();

						//$scope.linkingForm.$setPristine();
					} else {
						console.error('Problem creating EDTA Tube. status: ' + status);
					}
				}
			});
		}
	};
	
	/*var removeCryovialsWithoutCryovialId = function(newEdtaTube) {
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
	};*/

	function addEDTATube(edtaTube){
       console.log("Adding EDTA "+JSON.stringify(edtaTube));
       var tube = {};
       tube.edtaTubeId = edtaTube.edtaTubeId;
       tube.remarks = edtaTube.remarks;
       tube.plasma = ["-", "-", "-", "-"];
       tube.buffy = "-";
       tube.buffyRBC = "-";
       tube.rbc = "-";

       var i;
       for(i=0;i<edtaTube.plasma.length;i++){
          tube.plasma[i] = edtaTube.plasma[i].cryovialId;
       }
       tube.buffy = edtaTube.buffyCoat[0].cryovialId;
       if(edtaTube.buffyCoatRBC.length > 0){
       	   tube.buffyRBC = edtaTube.buffyCoatRBC[0].cryovialId;
       }
       if(edtaTube.rbc.length > 0){
       	   tube.rbc = edtaTube.rbc[0].cryovialId;
       }       
       
       return tube;
	}
	
	var isFormValid = function() {
		/*if($scope.linkingForm.edtaTubeId.$valid && $scope.currentEdtaTubeValidity.edtaTubeId === 'OK' &&
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
		}*/
        var currentCombination = JSON.parse($window.localStorage.getItem('currentCombination'));
        var totalCryovials=0;
        var x;
        for (x in currentCombination) {
            totalCryovials += currentCombination[x];
        }
        console.log("Total cryovials to be scanned "+totalCryovials);  

		var y;
		var validCryovials = 0;
        for(y in $scope.currentEdtaTubeValidity){
        	console.log("Validity "+y+" "+$scope.currentEdtaTubeValidity[y]);
        	if($scope.currentEdtaTubeValidity[y] !== null && $scope.currentEdtaTubeValidity[y] === "OK"){
              validCryovials +=1;
        	}
        }

        if(validCryovials === totalCryovials+1){
        	return true;
        }else{
        	return false;
        }


	};
	
	$timeout(function() {
		document.getElementById('edtaTube').focus();
	});
        
});