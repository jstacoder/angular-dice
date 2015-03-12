<?php
require_once 'phlask.php';

$app = new Phlask('dieApp',false,false);


$check_for_doubles = function($roll){
    if(sizeof($roll) < 6){
        return false;
    }
    $count = array_count_values(array_count_values($roll));
    return @$count[2] == 3;
};

$check_for_strait = function($roll){
    if(sizeof($roll) < 6){
        return false;
    }
    $count = array_count_values(array_count_values($roll));
    return @$count[1] == 6;
};

$check_for_three_or_more = function($roll){
    if(sizeof($roll) < 3){
        return false;
    }
    $tmp = array();
    foreach($roll as $k=>$v){
        if(!isset($tmp[$v])){
            $tmp[$v] = array($v);
        }else{
            $tmp[$v][] = $v;
        }
    }
    $rtn = array();
    foreach($tmp as $arr){
        if(sizeof($arr) >=3){
            $rtn[] = $arr;
        }
    }
    return $rtn;
};

$check_for_fives = function($roll){
    $count = array_count_values($roll);
    if(@$count[5] < 3 && @$count[5] > 0){
        if($count[5] == 1){
            return 1;
        } elseif($count[5] == 2 ){
            return 2;
        }
    }
    return false;
};

$check_for_ones = function($roll){
    $count = array_count_values($roll);
    if(@$count[1] < 3 && @$count[1] > 0){
        if($count[1] == 1){
            return 1;
        } elseif($count[1] == 2 ){
            return 2;
        }
    }
    return false;
};

$score_doubles = function($roll) use ($check_for_doubles){
    return $check_for_doubles($roll) ? 1000 : 0;
};

$score_strait = function($roll) use ($check_for_strait){
    return $check_for_strait($roll) ? 1000 : 0;
};

$score_three_or_more = function($roll) use ($check_for_three_or_more) {
    $rtn = 0;
    $results = $check_for_three_or_more($roll);
    if($results){
        foreach($results as $arr){
            $base = $arr[0] == 1 ? 1000 : 100;
            switch (sizeof($arr)){
                case 3:
                    $tmp = $base * $arr[0];
                    break;
                case 4:
                    $tmp = ($base*$arr[0]) * 2;
                    break;
                case 5:
                    $tmp = (($base * $arr[0]) * 2) * 2;
                    break;
                case 6:
                    $tmp = ((($base * $arr[0]) * 2) * 2) * 2;
                    break;
            }
            $rtn += $tmp;
        }
    }
    return $rtn;
};

$score_fives = function($roll) use($check_for_fives) {
    return $check_for_fives($roll) * 50;
};

$score_ones = function($roll) use($check_for_ones) {
    return $check_for_ones($roll) * 100;
};

$scoreRoll = function($roll) use ($score_doubles,$score_strait,$score_three_or_more,$score_fives,$score_ones){
    if($score = $score_doubles($roll)){
        return $score;
    }elseif($score = $score_strait($roll)){
        return $score;
    }else{
        return $score_three_or_more($roll) +
                            $score_fives($roll) +
                            $score_ones($roll);
    }
};

function processRtn($res){
    $rtn = [];
    foreach($res as $k=>$v){
        if(!is_array($v)){
            $rtn[] = $v;
        } else {
            foreach($v as $x=>$z){
                if(!is_array($z)){
                    $rtn[] =  $z;
                }
            }

        }
    }
    return $rtn;
}

$choose_roll = function($roll) use
    ($check_for_doubles,$check_for_strait,
     $check_for_three_or_more,$check_for_fives,
     $check_for_ones){
        if($res = $check_for_doubles($roll) || $res = $check_for_strait($roll)){
            return $roll;
        }
        $res = $check_for_three_or_more($roll);
            if(!$res){
            $res = array();
        }
        if($check_for_fives($roll) != 0){
            if($check_for_fives($roll) == 1){
                $res[] = [5];
            }else{
                $res[] = [5,5];
            }
        }
        if($check_for_ones($roll) != 0){
            if($check_for_ones($roll) == 1){
                $res[] = [1];
            }else{
                $res[] = [1,1];
            }
        }
        return processRtn($res);
        #return @array_map(function($arg){return (int)$arg;},@array_merge(...$res));
};

class BaseAIChooser {

    public $clean_choice;

    public $get_choice;

    public function __construct($func){
        $this->get_choice = $func;
    }
}

$clean_ai_choice = function($roll,$choice){
        $rtn = $roll;
        foreach($rtn as $idx=>$num) {
            if(!in_array($num,$choice)){
                $rtn[$idx] = 0;
            }
        }
        return $rtn;
};
$n = new BaseAIChooser($choose_roll);
$get_ai_choice = $n->get_choice;
$ai_choice = function($app) use ($get_ai_choice,$scoreRoll,$clean_ai_choice){
    if(strrpos($app->qs->roll,'+')){
        $roll = explode('+',$app->qs->roll);
    }else{
        $roll = str_split($app->qs->roll);
    }
    array_splice($roll,6,1);
    $res = $get_ai_choice($roll);
    $result = array_map(function($arg){
            return (int)$arg;
    } ,$res);
    $clean_choice = $clean_ai_choice($roll,$result);
    if(empty($result)){
        $result = false;
    }
    return $app->json(array(
        'score'=>$scoreRoll($roll),
        'result'=>$result,
        'roll'=>$roll,
        'clean_choice'=>$clean_choice
    ));

};
$get_score = function($app) use ($scoreRoll){
    $n_array = array();
    $nums = $app->qs->held;
    if(isset($app->qs->update)){
        $update = $app->qs->update;
    }else{
        $update = false;
    }
    foreach(str_split($nums) as $n){
        $n_array[] = $n;
    }
    $score = $scoreRoll($n_array);
    $result = $score > 0 ? 'success' : 'error';
    return $app->json(
                        array(
                            'score'=>$score,
                            'dice'=>$n_array,
                            'update'=>$update,
                            'result'=>$result
                        )
    );
};
$app->route('/dice_choice',$ai_choice);
$app->route('/score',$get_score);
$index = function($app){
    return $app->render('index.html');
};
$app->route('/<string>',$index);
$app->route('/',$index);
echo $app->run();
