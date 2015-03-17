(function() {
  'use strict';
    var app = angular.module('dice.controllers.app',['dice.factory.app','service.app','ui.bootstrap.modal']);

    app.controller('ModalCtrl',['$scope','$rootScope','turn',function($scope,$rootScope,turn){
        var self = this;
        self.new_player = {};
        self.new_player.name = '';
        self.addPlayer = function() {
            console.log('adding ', self.new_player.name);
            turn.addPlayer(self.new_player.name);

      };
    }]);
    app.controller('NavCtrl',['navLinks',function(navLinks){
      var self = this;
        navLinks.addLink('Home','/');
        navLinks.addLink('Play','/play');
        navLinks.addLink('Scores','/scores');
        navLinks.addLink('Help','/help');
        navLinks.addDropDown('Testdd',[
          {text:'link1',href:'ccx'},
          {text:'link2',href:'cccom'},
          {text:'link3',href:'ccm'},
          {text:'link4',href:'cicom'},
      ]);
      navLinks.addDropDown('Account Info',[
          {text:'Profile',href:'ccxom'},
          {text:'Settings',href:'ccccom'},
          {text:'Management',href:'cccom'},
          {text:'Logout',href:'cicom'},
      ]);
      navLinks.setActive(0);
      self.navLinks = navLinks.getLinks(true);
      self.dropdowns = navLinks.getLinks()
    }]);

    app.controller('PickCtrl', [
    'User','$route','navLinks','turn','comp','$scope','$rootScope','users','$q','storageService',
    function(User,$route,navLinks,turn,comp,$scope,$rootScope,users,$q,storage) {
      navLinks.setActive(0);
      var self = this;
      self.getAllUsers = function(){
            return $q.when(users).then(function(res){
                    self.allplayers = res;
                    if(storage.length){
                        for(var key in storage.keys()){
                            var playerdata = storage.get(storage.keys()[key]);
                            if(playerdata.split('>><<').length == 2){
                                var score = playerdata.split('>><<')[1],
                                name = playerdata.split('>><<')[0];
                            }else{
                                var score = 0,
                                    name = playerdata;
                            }
                            self.players.push({name :name,score:score});
                        }
                    };
            });
      };
      self.clearStorage = function(){
            storage.clear();
            turn.clearAll();
            self.players = turn.players;
      };
      self.removeFromUsers = function(name){
        var found = false,
        itmIdx = -1;
        angular.forEach(self.players,function(itm,idx){
           if(angular.equals(name,itm.name)){
                found = true;
                itmIdx = idx;
           }
        });
        if(found){
            self.players.splice(itmIdx,1);
            storage.remove('key:'+name);
        }
      };
      self.addToUsers = function(name){
          var user = new User();
          user.name = name;
          user.selected = true;
          user.$save();
          return users.push({name:name,score:0,selected:true});
      };
      self.getAllUsers();
      self.newplayer = '';
      self.addPlayer = function(){
            console.log('adding ',self.newplayer);
    };
    self.open = function() {
            $scope.showModal = true;
    };
        self.ok = function() {
            $scope.showModal = false;
        };
        self.cancel = function() {
            $scope.showModal = false;
        };
        $scope.$on('modal.need.open',function(){
            $scope.showModal = true;
            $scope.$apply();
        });
        $scope.showModal = false;
      self["new"] = {
        name: ''
      };
      self.resetScopePlayer = function(){
              $rootScope.new_player = {
                    name:'',
                    score:0
                };              
      };
      self.resetScopePlayer();

      self.launchModal = function(){
            //$modal(self.modals[0]);
            $scope.showModal = true;
      };

      self.compPlayers = comp._get();
      self.updateComp = function(){
        self.compPlayers = comp._get();
      };

      self.addCompPlayer = function(){

        comp.add();
        var player = comp.getLast();
        self.addPlayer(player.name);
        return self.updateComp();
      };
      self.addPlayer = function(name) {
        turn.addPlayer(name);
        if(!self.allplayers.filter(function(player){ return player.name == name; }).length){
            self.addToUsers(name);   
        }
        storage.add('key:'+name,name);
        return self["new"].name = '';
      };
      $rootScope.addPlayer = function(name){
          console.log('adding ',name);
          self.addPlayer(name);
          $scope.showModal = false;
          self.newplayer.name = '';
          name = '';
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


  app.controller('DiceCtrl', [
                '$q','navLinks',
                '$location','$log',
                '$timeout','$rootScope',
                'disabler', 'Die', 
                'roll', 'turn', 
                'choice', 'score', 
                '$scope','currentChoice',
                '$interval','$modal',
                'historyService','alertService',
    function DiceCtrl( $q,navLinks,
                        $location,$log,
                        $timeout,$rootScope, 
                        dis, Die, 
                        roll, turn, 
                        choice, score, 
                        $scope,cc,
                        $interval,$modal,
                        historyService,alertService
    ){
      navLinks.setActive(1);
      var self;
      self = this;
      $scope.modals = [];
      $scope.modals.push({});
      $scope.modals[0].content = 'Som,e modal text Batch <h2>honkey</h2>';
      $scope.modals[0].title = 'My title!!';

      

      $rootScope.$on('player.change',function(evt,player){
            if(!player.human()){
                return self.compTurn(player);
            }
      });
      $scope.modals.push(
        {
            content:'A newewisj to,e ',
            title:'msdlvkjnsdnkvs'
        }
      );
      $scope.modals.push(
        {
            content:'python',
            title:'flask'
        }
      );
      $scope.modals.push(
        {
            content:'a ffffff',
            title:'sugfactcvatysa'
        }
      );
      self.makeModal = function(content,title){
        var modal = {};
        modal.content = content; //#'Som,e modal text Batch <h2>honkey</h2>';
        modal.title = title;
        $scope.modals.push(modal);
      };
      self.getModal = function(cfg){
            if(angular.isNumber(parseInt(cfg))){
                return $scope.modals[cfg];
            }else{
                return cfg;
            }
      };
        $scope.$on('choice.made',function(e,c){
                console.log('Logging choice: ',c);
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
      $scope.dice = self.dice;
      $scope.$watch(function(){return self.dice;},function(o,n,x){
            console.log('watch xx: ',arguments);

      });
      $scope.$watch(function(){return self.current.player.score+self.current.player.tempScore+self.current.player.realScore;},function(){
        console.log('watch2: ',arguments);
      });
      self.savedNums = [];
      self.saved = [];
      self["new"] = {
        name: ''
      };
      self.holdByNum = function(num,rtn){
            self.hold(self.dice[num]);
            if(rtn){
                return self.dice[num].value;
            }
      };
      $rootScope.currentplayer = {};
      $rootScope.currentChoice = {};
      $rootScope.closeable = true;
      self.closeAlert = function(alertItm){
        //return true;
        return alertService.closeAlert(alertItm);
      };
      $scope.closeAlert = function(Alert){
        return self.close(Alert);
      };
      self.curr = {};
      self.canKeep = true;
      self.held = false;
      self.updateChoice = function(){
        self.choice = $rootScope.currentChoice;
        $scope.dice = self.dice;
      };
      self.updateChoice();
      self.toggleCK = function() {
        self.canKeep = !self.canKeep;
        return self.canKeep;
      };
      self.updateCurrent = function() {
        return self.current = {
            player: turn.getCurrent() || {name:'temp',score:0}
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
        self.curr.score = player.score;
      };
      self.getCurrent = function() {
        self.updateCurrent();
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
        $scope.dice = self.dice;
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
          var addScore = parseInt(self.current.player.score) + parseInt(self.current.player.tempscore);
          self.current.player.realscore += addScore;
          //self.current.player.realscore += parseInt(self.current.player.tempscore);
          var title = 'Keeping points';
          $scope.test = function(){
            return 'this is a test';
          };
          var txt = self.current.player.name + ',<br/>This turm you kept '+addScore+' points,<br/>a total of:<br/><p class=lead>'+self.current.player.realscore+' points</p>';
          $modal({scope:$scope,title:title,content:txt,show:true,html:true});
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
      self.alerts = $rootScope.alerts;//[{type:'success',msg:'just testing'}];

      self.addAlert = function(type,msg,nonAuto){
            self.alerts.push(
                {
                    type:type,
                    msg:msg
                }
            );
            if (!nonAuto) {
              $timeout(function(){ self.alerts.splice(self.alerts.length-1,1);},2500);
            }            
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
      self.rolling = function(continuing){
        var thisTurn = false;
        $timeout(function(){
            $q.when(self.roll()).then(function(res){
                if(!thisTurn){
                    thisTurn = true;
                    console.log('choice ',res);
                    if(res){
                    }
                    angular.forEach($rootScope.currentChoice.clean_choice,function(itm,idx){
                        if(itm!=0){
                            $timeout(function(){
                                self.holdByNum(idx);
                                $scope.$apply();
                            },1600);
                        }
                        });
                }
                return res;
            }).then(function(res){
                    if(res){
                        var modal = $modal({title:'Holding',content:res.join(' '),show:true});
                        modal.$promise.then(function(){
                            
                            $timeout(function(){
                                console.log(modal);
                                $timeout(function(){
                                  self.rolling(true);
                                },1000);
                                modal.hide();
                             },1500)
                        });
                    }    
            });
        },2200);
    };    
          self.compTurn = function(player){
              var def = $q.defer();
              $scope.current = {};
              $scope.current.player = player.name;
              $scope.current.score = player.score;
              var thisTurn = false;
              self.rolling();
      };
      self.roll = function() {

        var tmp,
        def = $q.defer();
        //self.choice = $rootScope.currentChoice;
        self.held = false;
        self.updateSavedNums();
        score(self.holding, self.current.player, 'roll');
        self.holding = [];
        self.savedNums = [];
        self.currentRoll = [];
        tmp = [];
        var sentinal = false;
        angular.forEach(self.dice, function(itm) {
          if (!itm.held) {
            sentinal = true;
            itm.value = roll();
            self.currentRoll.push(itm.value);
            self.fastRoll(itm,itm.value);
          } else {
            tmp.push(itm);
            return self.saveItem(itm);
          }
        });
        if (!self.dice.length || self.dice.length === 0 || !sentinal) self.makeRoll();
        if (tmp.length && tmp.length > 0) {
          self.results.push(tmp);
          angular.forEach(tmp, function(item) {
            return self.removeItem(item);
          });
        }
        //self.choice = $rootScope.currentChoice;
        choice(self.currentRoll).then(function(res){
            self.checkTurnEnd(self.currentRoll,$rootScope.currentChoice.result);
            def.resolve($rootScope.currentChoice.result);
        });
        self.updateChoice();
        score(self.holding, self.current.player, 'hold');
        return def.promise;
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
                   $timeout(function(){self.compTurn();},2000);
               }
        };
      var counter = 0;
      /*$interval(function(){
          counter += 1;
          console.log('polling, counter :'+counter);
          
      },5000);*/
      return self.reset();
    }]);
}).call(this);
