(function() {
  'use strict';
    var app = angular.module('dice.controllers.app',['dice.factory.app','service.app']);

    app.controller('NavCtrl',['navLinks',function(navLinks){
      var self = this;
        navLinks.addLink('Home','/');
        navLinks.addLink('Play','/play');
        navLinks.addLink('Scores','/scores');
        navLinks.addLink('Help','/help');
        navLinks.addDropDown('Testdd',[
          {text:'link1',url:'ccx'},
          {text:'link2',url:'cccom'},
          {text:'link3',url:'ccm'},
          {text:'link4',url:'cicom'},
      ]);
      navLinks.addDropDown('Account Info',[
          {text:'Profile',url:'ccxom'},
          {text:'Settings',url:'ccccom'},
          {text:'Management',url:'cccom'},
          {text:'Logout',url:'cicom'},
      ]);
      navLinks.setActive(0);
      self.navLinks = navLinks.getLinks(true);
      self.dropdowns = navLinks.getLinks()
    }]);

    app.controller('PickCtrl', [
    'navLinks','turn','comp', '$scope',function(navLinks,turn,comp,$scope) {
      var self;
      self = this;
      self["new"] = {
        name: ''
      };

      self.compPlayers = comp._get();
      self.updateComp = function(){
        self.compPlayers = comp._get();
      };

      self.addCompPlayer = function(){
        comp.add();
        return self.updateComp();
      };
      self.addPlayer = function(name) {
        turn.addPlayer(name);
        return self["new"].name = '';
      };
      self.switchPlayer = function() {
        turn.changeTurn();
        return self.updateCurrent();
      };
      self.getCurrent = function() {
        return self.current.player;
      };
      self.updateCurrent = function() {
        return self.current = {
          player: turn.getCurrent()
        };
      };
      self.updateCurrent();
      self.makeCurr = function(player) {
        self.curr.player = player.name;
        return self.curr.score = player.score;
      };
      self.getCurrent = function() {
        return self.current.player;
      };
      self.players = turn.players;
      return self;
    }
  ]);


app.controller('ModalDemoCtrl', function ($rootScope,$scope, $modal, $log,turn) {

      var scope = {};
      scope.items = ['item1', 'item2', 'item3',turn.getCurrent()];

        $scope.open = function (size) {
            
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                //windowTemplateUrl: 'myasidewindow.html',
                controller: 'ModalInstanceCtrl',
                backdrop:true,
                scope: scope,
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// // // It is not the same as the $modal service used above.
// //
app.controller('ModalInstanceCtrl', function ($scope,turn) {
     var items = $scope.items || [];
     $scope.selected = {
         item: items.length ? items[0] : ''
      };

      $scope.ok = function () {
          $scope.close($scope.selected.item);
      };
      $scope.cancel = function () {
          $scope.dismiss('cancel');
      };
});


  app.controller('DiceCtrl', [
    'navLinks','$location','$modal','$log','$timeout','$rootScope', 'disabler', 'Die', 'roll', 'turn', 'choice', 'score', '$scope','currentChoice','$interval', function(navLinks,$location,$modal,$log,$timeout,$rootScope, dis, Die, roll, turn, choice, score, $scope,cc,$interval) {
      var self;
      self = this;
      console.log($modal);
      console.dir($modal);
      $modal.open({
        templateUrl: 'myModalContent.html',
        //windowTemplateUrl: 'myasidewindow.html'

      });

        $scope.$on('choice.made',function(e,c){
                console.log(c);
        });

      $rootScope.$on('choice_made',function(e,data){
        $log.log('logging data ',data.result);
        console.log(e,data);

        if(data.result.length){
            $scope.modal = {};
            console.log('setting modal text');
            $scope.modal.text = 'holding ' + data.result.join(' ');
            self.modal = $scope.modal;
        }
      });
      self.dice = [];
      $scope.$watch(self.dice,function(o,n,x){
            console.log('watch xx: ',o,n,x);

      });
      self.savedNums = [];
      self.saved = [];
      self["new"] = {
        name: ''
      };
      self.holdByNum = function(num){
            self.hold(self.dice[num]);
      };
      $rootScope.currentplayer = {};
      $rootScope.currentChoice = {};
      $rootScope.closeable = true;
      self.close = function(){
        self.alerts = [];
      };
      self.curr = {};
      self.canKeep = true;
      self.held = false;
      self.updateChoice = function(){
        self.choice = $rootScope.currentChoice;
      };
      self.updateChoice();
      self.toggleCK = function() {
        self.canKeep = !self.canKeep;
        return self.canKeep;
      };
      self.updateCurrent = function() {
        return self.current = {
          player: turn.getCurrent()
        };
      };
      self.updateCurrent();
      self.disableClass = function(itm) {
        return dis(itm, self.held);
      };
      self.players = turn.players;
      self.addPlayer = function(name) {
        turn.addPlayer(name);
        return self["new"].name = '';
      };
      self.switchPlayer = function() {
        turn.changeTurn();
        return self.updateCurrent();
      };
      self.addItem = function(item) {
        return self.dice.push(item);
      };
      self.makeRoll = function() {
        var x, _results;
        _results = [];
        for (x = 1; x <= 6; x++) {
          var die = Die(x);
          _results.push(self.addItem(die));
          self.currentRoll.push(die.value);
        }
        choice(self.currentRoll);
        return _results;
      };
      self.makeCurr = function(player) {
        self.curr.player = player.name;
        return self.curr.score = player.score;
      };
      self.getCurrent = function() {
        return self.current.player;
      };
      self.hold = function(die) {
        die.held = !die.held;
        if (!die.held) {
          self.holding.splice(self.holding.indexOf(die.value),1);
        } else {
          self.holding.push(die.value);
          self.held = true;
        }
        self.updateSavedNums();
        score(self.holding, self.current.player, 'hold');
        choice(self.currentRoll);
        self.updateChoice();
      };
      self.toggleCK = function() {
          return this.canKeep = !this.canKeep;
        //return self.choice = $rootScope.currentChoice;
      };
      self.endTurn = function(dice){
            if(dice.length == 0){
                return false;
            }
            return true;
      }

      self.reset = function(keep) {
        if (keep) {
          self.current.player.realscore += parseInt(self.current.player.score);
          self.current.player.realscore += parseInt(self.current.player.tempscore);
          $rootScope.currentplayer = self.current.player
        }
        self.current.player.score = 0;
        self.current.player.tempscore = 0;
        self.dice = [];
        self.holding = [];
        self.savedNums = [];
        self.saved = [];
        self.results = [];
        self.currentRoll = [];
        self.makeRoll();
        return self.switchPlayer();
      };
      self.removeItem = function(item) {
        return self.dice.splice(self.dice.indexOf(item), 1);
      };
      self.saveItem = function(item) {
        return self.saved.push(item);
      };
      self.getSavedNums = function() {
        var rtn;
        rtn = [];
        if (self.results.length === 0) return rtn;
        self.results[self.results.length - 1].map(function(itm) {
          return rtn.push(itm.value);
        });
        return rtn;
      };
      self.updateSavedNums = function() {
        return self.savedNums = self.getSavedNums();
      };
      self.alerts = [];

      self.addAlert = function(type,msg){
            self.alerts.push(
                {
                    type:type,
                    msg:msg
                }
            );
            $timeout(function(){ self.alerts = [];},2500);
      };
      self.addFailure = function(msg){
          $timeout(function(){
            self.addAlert('danger',msg);
            $timeout(function(){
                self.reset();
            },1000);

          },3000);
      };
      self.addSuccess = function(msg){
            self.addAlert('success',msg);
      };
      self.fastRoll = function(die,num){
            var intt = $interval(function(){
                die.value = roll();
            },45);
            return $timeout(function(){
                $interval.cancel(intt);
                die.value = num;
            }, 1500);
      };
      self.compTurn = function(player){
          $scope.current = {};
          $scope.current.player = player.name;
          $scope.current.score = player.score;
          var thisTurn = false;
          self.roll();
          $rootScope.$on('choice.made',function(e,data){
            if(!thisTurn){
                thisTurn = true;
                console.log('choice ',data);
                angular.forEach(data.clean_choice,function(itm,idx){
                    if(itm!=0){
                        $timeout(function(){
                            self.holdByNum(idx);
                        },1800);
                    }
                });
            }
          });
          $scope.$apply();
      };
      self.roll = function() {
          console.log($location);
          console.dir($location);
        var tmp;
        console.dir(self);
        //self.choice = $rootScope.currentChoice;
        self.held = false;
        self.updateSavedNums();
        score(self.holding, self.current.player, 'roll');
        self.holding = [];
        self.savedNums = [];
        self.currentRoll = [];
        if (!self.dice.length || self.dice.length === 0) self.makeRoll();
        tmp = [];
        angular.forEach(self.dice, function(itm) {
          if (!itm.held) {
            itm.value = roll();
            self.currentRoll.push(itm.value);
            self.fastRoll(itm,itm.value);
          } else {
            tmp.push(itm);
            return self.saveItem(itm);
          }
        });
        if (tmp.length && tmp.length > 0) {
          self.results.push(tmp);
          angular.forEach(tmp, function(item) {
            return self.removeItem(item);
          });
        }
        //self.choice = $rootScope.currentChoice;
        choice(self.currentRoll).then(function(res){
            self.checkTurnEnd(self.currentRoll,$rootScope.currentChoice.result);
        });
        self.updateChoice();
        score(self.holding, self.current.player, 'hold');
      };
      self.checkTurnEnd = function(current,serverChoice){
          $log.log('checking for end');
          $log.log(serverChoice);
          $log.log(current);
            if(serverChoice || !current.length){
                $log.log('still going');
                return false;
            }else if(current.length == 2 && current[0] == current[1]){
                        self.addSuccess('Doubles!! roll again');
               }else if(!current){                
                   return false;
                }else{
                   if(angular.isDefined(intt)){
                        $interval.cancel(intt);
                        intt = undefined;
                   };
                   self.addFailure('Turn over');
               }
        };
      return self.reset();
    }]);
}).call(this);
