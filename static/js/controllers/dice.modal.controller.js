'use strict';

var app = angular.module('dice.modal.controller',[]);

app.controller('ModalCtrl',['$scope','$rootScope','turn',function ModalCtrl($scope,$rootScope,turn){
    var self = this;

    self.new_player = {};
    self.new_player.name = '';

    self.addPlayer = function(){
        console.log('Adding: ',self.new_player.name);
        turn.addPlayer(self.new_player.name);
    };
}]);
