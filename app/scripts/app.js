'use strict';

/**
 * @ngdoc overview
 * @name ishaLogisticsApp
 * @description
 * # ishaLogisticsApp
 *
 * Main module of the application.
 */
var app=angular
  .module('ishaLogisticsApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute'
  ]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/linking', {
        templateUrl: 'views/linking.html',
        controller: 'LinkingCtrl',
        controllerAs: 'linking'
      })
      .when('/edit-linking', {
        templateUrl: 'views/edit-linking.html',
        controller: 'EditLinkingCtrl',
        controllerAs: 'editLinking'
      })
      .when('/add-box', {
        templateUrl: 'views/add-box.html',
        controller: 'AddBoxCtrl',
        controllerAs: 'addBox'
      })
      .when('/packing', {
        templateUrl: 'views/packing.html',
        controller: 'PackingCtrl',
        controllerAs: 'packing'
      })      
      .when('/add-freezer', {
        templateUrl: 'views/add-freezer.html',
        controller: 'AddFreezerCtrl',
        controllerAs: 'addFreezer'
      })
      .when('/storage', {
        templateUrl: 'views/storage.html',
        controller: 'StorageCtrl',
        controllerAs: 'storage'
      })
      .when('/locate-cryovial', {
        templateUrl: 'views/locate-cryovial.html',
        controller: 'LocateCryovialCtrl',
        controllerAs: 'locateCryovial'
      })
      .when('/create-user/', {
        templateUrl: 'views/create-user.html',
        controller: 'CreateUserCtrl',
        controllerAs: 'createUser'
      })
      .when('/create-user/:username', {
        templateUrl: 'views/create-user.html',
        controller: 'CreateUserCtrl',
        controllerAs: 'createUser'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'users'
      })
      .when('/synchronize', {
        templateUrl: 'views/synchronize.html',
        controller: 'SynchronizeCtrl',
        controllerAs: 'synchronize'
      })
      .when('/combination',{
        templateUrl: 'views/change-combination.html',
        controller: 'CombinationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.config(['$locationProvider', function($locationProvider) {
       $locationProvider.hashPrefix('');
}]);

app.run(function($window){
    console.log("ON Run block");
    var store = $window.localStorage;
    var combinations = {
      "seven" : { "plasma": 4, "buffycoat": 1, "buffycoatRBC": 1, "rbc": 1,},
      "six" :   { "plasma": 4, "buffycoat": 1, "buffycoatRBC": 1, "rbc": 0 },
      "five" :  { "plasma": 3, "buffycoat": 1, "buffycoatRBC": 1, "rbc": 0 },
      "four" :  { "plasma": 2, "buffycoat": 1, "buffycoatRBC": 1, "rbc": 0 },
      "three" : { "plasma": 1, "buffycoat": 1, "buffycoatRBC": 1, "rbc": 0 },
      "two" :   { "plasma": 1, "buffycoat": 1, "buffycoatRBC": 0, "rbc": 0 }
    };
    store.setItem('combinations',JSON.stringify(combinations));
    store.setItem('defaultCryovialCombination',"seven");
    store.setItem('currentCombination',JSON.stringify(combinations[ store.getItem('defaultCryovialCombination') ]));

});

app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            console.log(attrs); 
            el.replaceWith(el.children());
        }
    };
});

app.directive('sevenForm', function () {
    return {        
        restrict: 'EA', /* optional */
        templateUrl: 'views/form7.html',
        replace:'true'
    };
});