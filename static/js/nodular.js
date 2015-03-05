/* nodular.js
 *  examples of getting data from angular environment:
 *
 *      get $timeout service:
 *        var $timeout = ng_load('$timeout');
 *      get $interval service:
 *        var $interval = ng_load('$interval');
 *      get custom service:
 *        var serv = ng_load('testService',['testApp']); <---additional modules refrenced are cached for later use
 *      get more custom services without refrenceing the app 
 *      like above, all ng_load calls are cached so any 
 *      modules only need to be loaded once.
 *        var fact = ng_load('testFactory');
 *      get the $controller service to load controllers
 *        var $c = ng_load('$controller');
 */
module.exports = function(){
    console.log(angular.version);
    /* load your modules by name here */
    var app = angular.module('testApp',['service.app','dice.factory.app','controllers-ng.app']);

    /* require module files here */
    require('./service.js');
    require('./factorys.js');
    require('./controllers-ng.js');
    require('./newdice.js');

    var Die = ng_load('Die',['dice.service.app']);
    var dieList = ng_load('dieList');
    var saved = ng_load('savedList');
    var rootScope = ng_load('$rootScope');
    //var i = angular.injector(['ng','dice.factory.app']);
    //console.log(require('./factorys.js'));
    var x  = Die();
    var y = Die();
    var z = Die();
    z.hold();
    y.save();
    z.save();
    rootScope.$watch(z.info.value,function(value){
        console.log('z changed to ',value);
    });

    var t = Die();
    saved.reset();
    console.log(dieList.getDice());
    //console.log(i.instantiate(Die) == x);
    console.log(y);
    //console.log(dieList.getRoll());
    console.log('one: ',saved.getAll());
    y.save();
    z.save();
    z.info.value = 3;
    z.info.value = 4;
    /*
    console.log('two: ',saved.getAll());
    //dieList.needNewDice();
    //console.log(dieList.getRoll().length);

    var roll = function(num){
        if(!num || num == 0){
            return [Die(),Die(),Die(),Die(),Die(),Die()];
        }else{
            var rtn = [];
            for(var i = 0; i < num; i++){
                rtn.push(Die());
            }
            return rtn;
        }
    };
    var $interval = ng_load('$interval',['ng']);
    var $timeout = ng_load('$timeout');
    var stopped = false;
    var holding = false;
    var i = $interval(function(){
        if(!stopped){

            if(!holding){
                var newRoll = roll();
            }else{
                console.log('held ',holding);
                var newRoll = roll(holding.length - 6);
            }
        
        //console.log(newRoll);
        console.log(newRoll.map(function(itm){return itm.showValue();}));
        var good = newRoll.filter(function(itm){return itm.showValue() == 1 || itm.showValue() == 5;});
        var holding = good.map(function(itm){return itm.showValue();});
        console.log('holding ',holding);
        if(!good.length){
            $interval.cancel(i);
            stopped = true;
        }
    }
    },2500);
    */
};

