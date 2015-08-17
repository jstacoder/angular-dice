'use strict';

var app = angular.module('dice.nav.controller',[]);

app.controller('NavCtrl',['navLinks',function NavCtrl(navLinks){
    var self = this;

    self.links = [
        {
            text:'Home',
            href:'/'
        },
        {
            text:'Play',
            href:'/play'
        },
        {
            text:'Scores',
            href:'/scores'
        },
        {
            text:'Help',
            href:'/help'
        }
    ];
    self.drops = [
        {
            title:"Account Info",
            links:[
                {
                    text:"Profile",
                    href:"/profile"
                },
                {
                    text:"Settings",
                    href:"/settings"
                },
                {
                    text:"Management",
                    href:"/manage"
                },
                {
                    text:"Logout",
                    href:"/logout"
                }
            ]
        },
        {
            title:"Test Drop Down",
            links:[
                {
                    text:"test1",
                    href:"/tst1"
                },
                {
                    text:"test2",
                    href:"/tst2"
                },
                {
                    text:"test3",
                    href:"/tst3"
                }
            ]
        }
    ];
    angular.forEach(self.links,function(itm){
        navLinks.addLink(itm.text,itm.href);
    });

    angular.forEach(self.drops,function(itm){
        navLinks.addDropDown(itm.title,itm.links);
    });
    navLinks.setActive(0);
    self.navLinks = navLinks.getLinks(true);
    self.dropdowns = navLinks.getLinks();
}]);
