'use strict';

var app = angular.module('service.app',[]);

app.service('testService',function(){
        var self = this;
        self.data = ['x','5','4'];

        self.getData = function(){
            return self.data;
        };

        self.addData = function(itm){
            self.data.push(itm);            
            return self.data;
        };
        self.remove = function(itm){
            var idx = self.data.indexOf(itm);
            if(idx > -1){
                self.data.splice(idx,1);
                return true;
            }else{
                return false;
            }
        };
});

app.service('navLinks',[function(){
        var self = this;

        self.links = [];
        self.dropdowns = [];

        self.setActive = function(link){
          self.links[link].active = true;
        };
        self.addLink = function(text,url){
                self.links.push({text:text,url:url,active:false,routeMatch:text});
        };
        self.addDropDown = function(text,links){
                self.dropdowns.push({text:text,links:links});
        };
        self.getLinks = function(links){
                if(links){
                        return self.links;
                }else{
                        return self.dropdowns;
                }
        };
}]);
