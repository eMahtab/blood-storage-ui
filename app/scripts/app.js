'use strict';

/**
 * @ngdoc overview
 * @name ishaLogisticsApp
 * @description
 * # ishaLogisticsApp
 *
 * Main module of the application.
 */
angular
  .module('ishaLogisticsApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  });
