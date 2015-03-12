(function() {
  'use strict';

  var intt = undefined;
  var app;

  app = angular.module('testApp', 
          [
               'ngCookies','mgcrea.ngStrap','ngAnimate', 
               'ngRoute','dice.factory.app','dice.controllers.app',
               'ui.bootstrap.modal','ngSanitize','ngResource'
          ]
  );

  app.config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider.when('/', {
        templateUrl: '/templates/pick_players.html'
      }).when('/play', {
        templateUrl: '/templates/dice.html'
      }).otherwise({
        redirectTo: '/404'
      });
      return $locationProvider.html5Mode(true);
    }
  ]);
}).call(this);
