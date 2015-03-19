<?php
require_once "ham.php";

class Phlask extends Ham
{
    private $_twig_env;
    public $extensions;    
    public $url_map = array();
    public $routes = array();
    public $layout = null;
    public $_request;
    public $session = null;
    public $qs;
    public $query_keys = array();
    private $session_id = null;
    public $registry = null;
    public $_security;
    public $_session;
    public $view;

    public function __construct($name,$cache=false,$log=true,$use_twig=true)
    {
	if($use_twig){
                require_once 'load_twig.php';
	        $this->_twig_env = new Twig_Env($this);            
	}else{
		$this->_twig_env = null;
	}
        if(isset($_REQUEST)){
            $this->_request = $_SERVER;
        };
        $this->create_qs();
        parent::__construct($name,$cache,$log);
    }

    public function parse_query_string()
    {
        $rtn = array();
        if(strstr($_SERVER['REQUEST_URI'],'?') != -1){
            $rtn = array_map(function( $idx ){
                return explode('=',$idx);
            },explode('&',explode('?',
            $_SERVER['REQUEST_URI']
                    )[1]
                )
            );
        }
        return $rtn;
    }

    private function create_qs()
    {
        $this->qs = new stdClass();
        $tmp = $this->parse_query_string();
        foreach($tmp as $arr){
            $this->query_keys[] = $arr[0];
            if(count($arr) > 1){
                $this->qs->$arr[0] = $arr[1];
            }
                
        }
    }

    public function set_layout($layout)
    {
        if(!file_exists($layout)) {
            return $this->abort("404");
        }
        $this->layout = $layout;
    }

    public function load_layout()
    {
        return $this->layout;
    }

    public function render($view,$data=array(),$layout=null)
    {
        $content = $this->_twig_env->render($view,$data);
        return $content;
    }
    
    public function add_url_rule($url,$endpoint,$methods=null)
    {
        $this->routes[$url] = $endpoint;
        $this->url_map[$endpoint] = $url;
    }

    public function url_for($endpoint,$args=array())
    {
        if(array_key_exists($endpoint,$this->url_map)) { 
            return $this->url_map[$endpoint];
        }

    }
    public function register_template_global($k,$v)
    {
        $this->_twig_env->register_global($k,$v);
    }

    public function register_template_filter($func,$name) 
    {
        $this->_twig_env->register_filter($func,$name);
    }



    public function get_request(array $vars=array())
    {
        if(!empty($vars)){
            $rtn = array();
            foreach($vars as $v){
                if(isset($this->_request,$v)){
                    $rtn[] = $this->_request[$v];
                }
            }
        } else {
            $rtn = $this->_request;
        }
        return $rtn;
    }
    public function get_class_of_type($type,$class)
    {
        if(in_array($type,scandir(getcwd()))) {
            $path = $type . DIRECTORY_SEPARATOR . $class . ".php";
            require $path;
            $tmp = new $class();
            return $tmp;
        }
    }

}


