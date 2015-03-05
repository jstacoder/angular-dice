(function() {
  'use strict';

  var intt = undefined;
  var app;

  app = angular.module('testApp', ['ngAnimate', 'ngRoute','ui.bootstrap','dice.factory.app','dice.controllers.app']);

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
