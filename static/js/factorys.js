(function() {
  'use strict';

  var forEach = angular.forEach;

  var app = angular.module('dice.factory.app',[]);
  app.factory('roll', function() {
    return function() {
      return parseInt(Math.random() * 6) + 1;
    };
  });
  app.factory('endTurn',function(){
    return function(roll){
        if(roll.length == 2){
            if(roll[0] == roll[1]){
                return false;
            }   
        }else{
            
        }
    }
  });
  app.factory('Die', [
    'roll', function(roll) {
      return function(n) {
        return {
          dienum: n,
          index: n - 1,
          held: false,
          value: roll()
        };
      };
    }
  ]);

  app.factory('userFactory',['User','users',function userFactory(User,users){
    return function(name,computer){
        var o = {};
        o.isHuman = function(){
            return computer ? false : true;
        };
        var inUsers = false;
        forEach(users,function(itm){
            if(name == itm.name){
                inUsers = true;
            }
        });
        if(!inUsers){
            o.name = name;
            o.score = 0;
            users.push(o);
            return o;
        }
        return false;
    };
  }]);

  app.factory('User',['$resource',function($resource){
    return $resource('/api/users/:id',{id:"@id"},
            {
                query : {
                    isArray:true
                }
            });
  }]);

  app.factory('users',['User',function(User){
      return User.query();
  }]);

  //app.constant('URL_BASE', 'http://174.140.227.137:3333/');
  app.factory('URL_BASE',['$location',function($location){
        return function(){
            return $location.$$protocol+'://'+$location.$$host+':'+$location.$$port+'/';
        };
  }]);

  app.factory('SCORE_URL', [
    'URL_BASE', function(URL_BASE) {
      return "" + URL_BASE() + "score";
    }
  ]);

  app.factory('CHOICE_URL', [
    'URL_BASE', function(URL_BASE) {
      return "" + URL_BASE() + "dice_choice";
    }
  ]);

  app.factory('choice', [
    '$http', 'CHOICE_URL', '$rootScope', 'currentChoice',function($http, CHOICE_URL, $rootScope,cc) {
      return function(dice) {
        return $http.get(CHOICE_URL, {
          params: {
            roll: dice.join('')
          }
        }).then(function(result) {
          console.log(result.data);
          $rootScope.currentChoice = result.data;
          console.log('emmitting choice');
          $rootScope.$emit('choice.made',result.data);
          $rootScope.$broadcast('choice.made',result.data);
          cc.setChoice(result.data,true);
        });
      };
      }
  ]);
  app.factory('currentChoice',[function(){
        var choice = [];

        var setChoice = function(itms,reset){
            if(reset){
                choice = [];
            }
            angular.extend(itms,choice);
            return true;
        };
        var getChoice = function(){
            return choice
        };

        return {
            getChoice:getChoice,
            setChoice:setChoice
        };
  }]);
  app.factory('comp', function(){
    var self = this;

    self.players = [];
    self.playerNum = 0;
    self.lastIdx = null;
    self.updateLastIdx = function(){
        self.lastIdx = self.playerNum-1;
    };
    var add = function(){
        self.playerNum += 1;
        self.updateLastIdx()
        return self.players.push({name:"Comp:"+self.players.length,score:0});
    };
    var remove = function(){
        self.playerNum -= 1;
        self.updateLastIdx()
        self.players.splice(self.players.length-1,1);
    };

    var _get = function(){
        return self.players;
    };
    var getLast = function(){
        return self.players[self.lastIdx];
    };

    return {
        _get:_get,
        add:add,
        remove:remove,
        getLast:getLast
    };
  });
  app.factory('turn',['comp','$rootScope',function(comp,$rootScope) {
    var self;
    self = this;
    self.players = [
    ];

    self.getNextPlayer = function(){
        return self.players.length >= 2 ? self.players[1] : self.players[0];
    };

    self._in_players = function(compPlayer){
        var check = function(ele,idx,arr){
            return !angular.equals(ele,compPlayer);
        };
        if(self.players.length){
            return self.players.every(check);
        }else{
            return false;
        }
    };

    self.addCompPlayers = function(){
        angular.forEach(comp._get(),function(itm){
            if(!self._in_players(itm)){
                self.players.push(itm);
            }
        });
    };

    self.changeTurn = function() {
      return self.players.push(self.players.shift());
    };
    self.getByName = function(name) {
      return angular.forEach(self.players, function(itm) {
        if (itm.name === name) return itm;
        return false;
      });
    };
    self.addPlayer = function(name,is_human) {
      var ih = is_human;
      if (self.name === '') self.name = name;
      return self.players.push({
        name: name,
        score: 0,
        tempscore: 0,
        realscore: 0,
        showFullScore: function() {
          this.updateFullScore();
          return this.score;
        },
        updateFullScore: function() {
          this.score += this.tempscore;
          return this.tempscore = 0;
        },
        human:function(){
            return ih ? false : true;
        }
      });
    };
    self.getCurrent = function(score) {
        self.addCompPlayers();
        if(!score){
          return self.players[0];
        }
        return self.players[0].realscore;

    };
    self.updateName = function(name) {
      if (name) {
        self.name = name;
      } else {
          if(self.players.length){
            self.name = self.players[0].name;
        }
      }
      return self.name;
    };
    self.updateScore = function(score) {
      if (score) {
        self.score = score;
      } else {
          if(self.players.length){
            self.score = self.players[0].score;
          }

      }
      return self.score;
    };
    self.clearAll = function(){
        self.players = [];
    };
    self.updateName();
    self.updateScore();
    self.addCompPlayers();
    self.switchData = function(name) {
      var player;
      player = self.getByName(name);
      $rootScope.$broadcast('player.change',player);
      $rootScope.$emit('player.change',player);
      self.updateName(player.name);
      return self.updateScore(player.score);
    };
    return self;
  }]);

  app.factory('score', [
    '$http', 'SCORE_URL', '$rootScope', function($http, SCORE_URL, $rootScope) {
      return function(dice, player, type) {
        return $http.get(SCORE_URL, {
          params: {
            held: dice.join('')
          }
        }).then(function(result) {
          console.log(result.data);
          if (type === 'roll') {
            player.tempscore = parseInt(result.data.score);
            player.score += player.tempscore;
            $rootScope.score = player.score;
            return player.tempscore = 0;
          } else {
            player.tempscore = parseInt(result.data.score);
            $rootScope.score = player.tempscore;
          }
          $rootScope.currentplayer = player;
        });
      };
    }
  ]);

  app.factory('disabler', function() {
    return function(itm, held) {
      if (itm >= 1000) {
        return false;
      } else {
        return true;
      }
    };
  });
}).call(this);
