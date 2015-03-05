'use strict';
var get_mod = function(name){
    return require('/root/.node/lib/node_modules/'+name);
};
var get_benv = function(){
    return get_mod('benv') || require('benv');
};
var use_angular = function(callback){
    get_benv().setup(function(){
        get_benv().expose({        
            angular:get_benv().require('./angular.js','angular'),
            ng_mod_cache:[],
            cache_mods:function(mods){
                angular.forEach(mods,function(itm){
                    ng_mod_cache.push(itm);
                });
            },
            ng_load:function(name,extraModules){
                var mods = (ng_mod_cache && ng_mod_cache.length) ? ng_mod_cache : ['ng'];
                if(extraModules && extraModules.length){
                    angular.forEach(extraModules,function(itm){
                        mods.indexOf(itm) === -1 ? mods.push(itm) : false;
                    });
                }
                cache_mods(mods);
                return angular.injector(mods).get(name);
            }
        });
        return callback();
    });
};
use_angular(function(){
        require('./'+process.argv[2])();
});
