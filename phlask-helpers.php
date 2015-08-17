<?php

class Request {

}

class Session {

}

class G {

}

function url_for($name) {

}

function flash($cat=null,$msg=null){
    if(is_null($msg) && !is_null($cat)){
        $msg = $cat;
        $cat = null;
    }
    print !is_null($cat) ? 'cat '.$cat . PHP_EOL :  '';
    print !is_null($msg) ? 'msg '. $msg . PHP_EOL :  '';
}

flash('xxxx');
