'use strict';

var app = angular.module('dice.pick.controller',[]);

app.controller('PickCtrl',
        [
            'User','$route','navLinks',
            'turn','comp','$scope',
            '$rootScope','users','$q',
            'storageService',
            
            function PickCtrl(
                User,$route,navLinks,
                turn,comp,$scope,
                $rootScope,users,$q,
                storage
            ){
            navLinks.setActive(0);

            var self = this;


            self.getAllUsers = function(){
                return $q.when(users).then(function(res){
                    self.allplayers = res;
                    if(storage.length){
                        for(var key in storage.keys()){
                            var playername = storage.get(storage.keys()[key]),
                            score = storage.get(key+'score') || 0;

                            self.players.push({
                                name : playername,
                                score: score
                            });
                        }
                    }
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
                var user = new User(),
		    score = 0;
                user.name = name;
                user.selected = true;		
                user.$save();
                return users.push({
                    name:name,
                    score:score,
                    selected:true
                });
            };
            self.getAllUsers();
            self.newPlayer = '';

            self.open = function(){
                $scope.showModal = true;
            };
            self.close = function(){
                $scope.showModal = false;
            };
            self.ok = function(){
                self.close();
            };
            $scope.$on('modal.need.open',function(){
                $scope.showModal = true;
                $scope.$apply();
            });
            $scope.showModal = false;

            self["new"] = {
                name: ""
            };
            self.resetScopePlayer = function(){
                $rootScope.new_player = {
                    name:"",
                    score:0
                };
            };
            self.resetScopePlayer();

            self.launchModal = function(){
                self.open();
            };
            self.compPlayers = comp._get();
            self.updateComp = function(){
                self.compPlayers = comp._get();                
            };
            self.addCompPlayer = function(){
                comp.add();
                var player = comp.getLast();
                self.addPlayer(player.name,true);
                return self.updateComp();
            };
            self.addPlayer = function(name,comp){
                turn.addPlayer(name,!comp);
                if(!comp){
                    if(!self.allplayers.filter(function(player){ return player.name == name;}).length){
                        self.addToUsers(name);
                    }
                } 
                storage.add('key:'+name,name);
                return self["new"].name = "";
            };
            $rootScope.addPlayer = function(name){
                self.addPlayer(name,false);
                $scope.showModal = false;
                self.newplayer.name = "";
                name = "";
            };
            self.switchPlayer = function(){
                turn.changeTurn();
                return self.updateCurrent();
            };
            self.getCurrent = function(){
                return self.current.player;
            };  
            self.updateCurrent = function(){
                return self.current = {
                    player: turn.getCurrent()
                };  
            };
            self.updateCurrent();
            self.makeCurr = function(player){
                self.curr.player = player.name;
                return self.curr.score = player.score;
            };
            self.players = turn.players;
            return self;
}]);


        


