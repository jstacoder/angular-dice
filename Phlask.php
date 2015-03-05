<?php
require_once "ham/ham.php";
require_once __DIR__ . '.' . '/' . "../autoload.php";
Twig_Autoloader::register();

class Twig_Env
{
    public $loader;
    public $app = null;
    public $twig_env = null;

    public function __construct($app)
    {
        $this->app = $app;
        $this->_set_loader();
    }

    private function _set_loader()
    {
        $this->loader = new Twig_Loader_Filesystem(
            $this->app
                 ->template_paths
        );
        $this->twig_env = new Twig_Environment(
            $this->loader,array(
                    'cache'=>'./cache',
                    'auto_reload'=>true,
            )
        );
    }
    public function render($template_name,$context=array())
    {
        return $this->twig_env
                    ->render($template_name,$context);
    }
    public function _print($template,$context)
    {
        echo $this->render($template,$context);
    }
    public function register_global($key,$val)
    {
        $this->twig_env->addGlobal($key,$val);
    }
    public function register_filter($func,$name) 
    {
        $filter = new Twig_Simple_Filter($name,$func);
        $this->twig_env->addFilter($filter);
    }
}

   
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

    public function __construct($name,$cache=false,$log=true)
    {
        $this->_twig_env = new Twig_Env($this);            
        $this->session = $this->_start_session();
        if(isset($_REQUEST)){
            $this->_request = $_SERVER;
        };
        $this->create_qs();
        parent::__construct($name,$cache,$log);
    }

    private function _start_session()
    {
        if(is_null($this->session)){
            $session = new \Phalcon\Session\Adapter\Files();
        } else {
            $session = $this->session;
        }
        return $session;
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

    public function render($view,$data=array())
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


