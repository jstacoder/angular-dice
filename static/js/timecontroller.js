'use strict';

var app = angular.module('time.controllers.app',[]);

app.controller('TimeCtrl',['timeData','$rootScope',function(timeData,$rootScope){
    var self = this;

    self.birth_date = '';
    self.date_data = '';

    self.start = function(){
        var date = self.birth_date,
        promise = timeData(date);
        promise.then(function(res){
            self.date_data = res.data;
        });
    };
}]);
