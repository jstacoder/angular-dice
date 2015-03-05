'use strict';

var app = angular.module('dice.app',[]);

var controllers = angular.module('dice.controller.app',['die.service.app']);
controllers.controller('DiceCtrl',['$scope','savedList','dieList','Die',function($scope,sLst,dLst,die){
    var self = this;

    self.dice = [];

    self.resetRoll = [];

    self.rollDice = function(){
        var roll = dLst.getRoll();
        self.dice = roll;
    };

    self.hold = function(die){
        die.hold();
    };
    self.reset = function(){
        dLst.getRoll();
        sLst.reset();
    };

}]);

var services = angular.module('dice.service.app',[]);

services.value('dice',[]);
services.value('saved',[]);

services.factory('savedList',['saved','$rootScope',function(saved,$rootScope){
    var savedList = saved;

    function add(die){
        savedList.push(die);
        $rootScope.$broadcast('die.saved',die);
        $rootScope.$broadcast('dice.saved.changed',savedList);
    };
    function reset(){
        savedList.splice(0,savedList.length);
    };
    function getAll(){
        return savedList.map(function(itm){
            return itm.showValue();
        });
    };
    return {
        add:add,
        reset:reset,
        getAll:getAll
    };
}]);

services.factory('dieList',['dice','$rootScope',function(dice,$rootScope){
    var dieList = dice;

    function addDie(die){
        dieList.push(die);
        $rootScope.$broadcast('die.added',die);
        $rootScope.$broadcast('dice.changed',dieList);
    };
    function removeDie(die){
        var idx = dieList.indexOf(die);
        if(idx > -1){
            dieList.splice(idx,1);
            $rootScope.$broadcast('die.removed',die);
            $rootScope.$broadcast('dice.changed',dieList);
        }
    };
    function getDice(){
        return dieList;
    };
    function getHeld(){
        return dieList.filter(function(itm){
            return itm.isHeld();
        });
    };

    function needNewDice(){
        while(dieList.length != 6){
            $rootScope.$broadcast('need.new.die',dieList);
        }
    };
    function getRoll(){
        $rootScope.$broadcast('dice.rolling.start');
        if(!dieList.length || dieList.length === 0){
            this.needNewDice();
        }
        var locked = dieList.filter(function(itm){
            return itm.isHeld();
        });
        angular.forEach(locked,function(itm){
            itm.remove();
            itm.save();
        });
        var roll = dieList.filter(function(itm){
                return !itm.isHeld();
        });
        roll.map(function(itm){
            itm.roll();
        });
        $rootScope.$broadcast('dice.rolling.end');
        return roll;
    };
    return {
        getDice:getDice,
        addDie:addDie,
        removeDie:removeDie,
        getHeld:getHeld,
        getRoll:getRoll,
        needNewDice:needNewDice
    };
}]);

services.factory('Die',['$rootScope','dieList','savedList',function($rootScope,dieList,savedList){
    return function(){
        var die = {};
        var self = die;


        self._hiddenVal = '';

        $rootScope.$on('dice.rolling.start',function(e){
            self.roll();
            self._hiddenVal = self.info.value;
        });
        
        $rootScope.$on('dice.rolling.end',function(e){
            self.info.value = self._hiddenVal;
        });
        $rootScope.$on('need.new.die',function(e,l){
           return dieList.addDie(self);
        });
        self.getIndex = function(){
            return dieList.getDice().length;
        };
    
        self.roll = function(){
            self.info.value = parseInt(Math.random()*6)+1;
            $rootScope.$broadcast('die.value.changed',self);
        };

        self.hold = function(){
            self.info.held = !self.info.held;
            $rootScope.$broadcast('die.held.changed',self);
            self.isHeld() ? $rootScope.$broadcast('die.held.added',self) :
                $rootScope.$broadcast('die.held.removed',self);
        };
        self.remove = function(){
            dieList.removeDie(self);
        };
        self.isHeld = function(){
            return self.info.held;
        };
        self.save = function(){
            savedList.add(self);
        };
        self.showValue = function(){
            return self.info.value;
        }

        self.info = {};
        self.info.index = self.getIndex();
        self.info.dienum = self.info.index+1;
        self.info.value = 0;
        self.info.held = false;
        self.roll();
        dieList.addDie(self);
        return die;
    };
}]);


var factories = angular.module('dice.factory.app',[]);

var filters = angular.module('dice.filter.app',[]);


