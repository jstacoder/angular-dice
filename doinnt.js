
module.exports = function(){
        var intt = $interval(function(){
            console.log(parseInt((Math.random()*6)+1));
        },20);

        $timeout(function(){
            $timeout(function(){
                $interval.cancel(intt);
            },25);
        },2500);
};
