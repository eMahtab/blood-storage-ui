'use strict';

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
	
	$scope.addBoxValidation = {valid:true};

	$scope.created = false;

	$scope.busy = false;
	
	$scope.addCryovialBox = function(event) {
		$scope.addBoxValidation = {};
		if(checkCryovialBoxId() && event.keyCode === 13) {
			$scope.busy = true;
						
			var retrieveCryovialBox = $http.get(httpUrls.cryovialBox + $scope.addBoxInput.cryovialBoxId);
			
			retrieveCryovialBox.then(function(response) {
				if($scope.addBoxInput.cryovialBoxId === response.data.cryovialBoxId) {
					console.log('duplicate');
					$scope.addBoxValidation.duplicate = true;
					$scope.busy = false;
				} else {
					console.log('Not Duplicate');
					console.log('data: ' + JSON.stringify(response));
					var createBoxPromise = $http.post(httpUrls.cryovialBox,$scope.addBoxInput);
					
					createBoxPromise.then(function() {
						$scope.created = true;
						$scope.busy = false;
					});
					
					createBoxPromise.catch(function() {
						console.error('Error creating Cryovial Box');
						$scope.busy = false;
					});
				}
			});
			
			retrieveCryovialBox.catch(function() {
				console.error('Problem');
			});
		}
	};

	function checkCryovialBoxId(){
        console.log("Inside checkCryovialBoxId "+ $scope.addBoxInput.cryovialBoxId); 
        if(typeof($scope.addBoxInput.cryovialBoxId) !== 'undefined' &&
            $scope.addBoxInput.cryovialBoxId !== null &&
            ($scope.addBoxInput.cryovialBoxId.length ===8 || $scope.addBoxInput.cryovialBoxId.length ===9)           
           ){

        	if($scope.addBoxInput.cryovialBoxId.indexOf('PB') === 0 && 
        		/^\d+$/.test($scope.addBoxInput.cryovialBoxId.substring(2))) {
				$scope.addBoxInput.cryovialType = 'Plasma';
			    $scope.addBoxValidation.valid=true;
			    return true;
		     } else if($scope.addBoxInput.cryovialBoxId.indexOf('BB') === 0 &&
		     	/^\d+$/.test($scope.addBoxInput.cryovialBoxId.substring(2))) {
				$scope.addBoxInput.cryovialType = 'BuffyCoat';
				$scope.addBoxValidation.valid=true;
				return true;
		     } else if($scope.addBoxInput.cryovialBoxId.indexOf('BRB') === 0 &&
		     	/^\d+$/.test($scope.addBoxInput.cryovialBoxId.substring(3))) {
		    	$scope.addBoxInput.cryovialType = 'BuffyCoatRBC';
		    	$scope.addBoxValidation.valid=true;
		    	return true;
		     } else if($scope.addBoxInput.cryovialBoxId.indexOf('RB') === 0 &&
		     	/^\d+$/.test($scope.addBoxInput.cryovialBoxId.substring(2))) {
				$scope.addBoxInput.cryovialType = 'RBC';
				$scope.addBoxValidation.valid=true;
				return true;
		     }else{
		     	$scope.addBoxValidation.valid=false;
		     	return false;
		     }
           
        }else{
        	$scope.addBoxValidation.valid=false;
        	return false;
        }		
	}
	
	$timeout(function() {
		document.getElementById('cryovialBoxId').focus();
	});
});