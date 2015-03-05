'use strict';
var app = angular.module('factory.app',[]);

app.factory('testFactory',function(){
        var factory = {
            data : [1,2,3,4,5],

            addData : function(itm){
                this.data.push(itm);
                return this.data;
            },
            getData : function(){
                return this.data;
            },
            remove : function(itm){
                var idx = this.data.indexOf(itm);
                    if(idx > -1){
                        this.data.splice(idx,1);
                        return true;
                    }else{
                        return false;
                    }
            }
        };
        return factory;
});

//module.exports = app;
