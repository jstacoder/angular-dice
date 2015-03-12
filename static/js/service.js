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

app.service('storageService',['$window',function($window){
    var self = this,

    storage = $window.localStorage;

    self.add = function(key,value){
        storage.setItem(key,value);    
    };
    self.remove = function(key){
        return storage.removeItem(key);
    };
    self.get = function(key){
        return storage.getItem(key);        
    };
    self.getList = function(key){
        return storage.getItem(key).split(',');
    };
    self.length = function(){
        return storage.length;
    };
    self.clear = function(){
        storage.clear();
    };
    self.keys = function(){
        var res = [];
        angular.forEach(storage,function(itm,key){
            res.push(key);
        });
        return res;
    };
}]);
app.service('navLinks',[function(){
        var self = this;

        self.links = [];
        self.dropdowns = [];

        self.setActive = function(link){
            self.links.map(function(itm){
                itm.active = false;
            });
            self.links[link].active = true;
        };
        self.addLink = function(text,url){
                self.links.push({text:text,href:url,active:false,routeMatch:text,click:function(){}});
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
