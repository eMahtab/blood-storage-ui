'use strict';

/**
 * @ngdoc service
 * @name ishaLogisticsApp.Auth
 * @description
 * # Auth
 * Factory in the ishaLogisticsApp.
 */
angular.module('ishaLogisticsApp').factory('Auth', function ($http) {
	var currentUser = null;
	
	var httpUrls = {
		user: 'http://localhost:8080/services/api/entity/user/username/'
	};
	
	var isLoggedIn = function() {
		if(currentUser !== null) {
			return true;
		} else {
			return false;
		}
	};
	
	var isAdmin = function() {
		if(currentUser && currentUser.role==='manager') {
			return true;
		} else {
			return false;
		}
	};
	
	var doLogin = function(credentials, successCallback, errorCallback) {
		currentUser = null;
		var loginPromise = $http.get(httpUrls.user + credentials.username);
		
		loginPromise.success(function(userObjectData, status) {
			if(status===200  && userObjectData.length>0 && userObjectData[0].password === credentials.password) {
				currentUser = userObjectData[0];
				if(successCallback) {
					successCallback();
				}
			} else {
				if(errorCallback) {
					errorCallback();
				}
			}
		});
		
		loginPromise.error(function() {
			console.error('Problem');
			if(errorCallback) {
				errorCallback();
			}
		});
	};
	
	var getCurrentUser = function() {
		return currentUser;
	};
	
	var doLogout = function() {
		currentUser = null;
	};
	
	var serviceInstance = {
		isLoggedIn: isLoggedIn,
		isAdmin: isAdmin,
		doLogin: doLogin,
		getCurrentUser: getCurrentUser,
		doLogout: doLogout
	};

	return serviceInstance;
});