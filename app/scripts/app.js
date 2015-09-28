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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
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
      .otherwise({
        redirectTo: '/'
      });
  });
