'use strict';

var app = angular.module('time.services.app',[]);

app.factory('timeData',['$http',function($http){
    return function(date){
        var req = {
            method:'GET',
            url:'/time',
            params:{date:date}
        };
        return $http(req);
    };  
}]);


