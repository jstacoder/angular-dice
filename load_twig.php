<?php
require_once "vendor/autoload.php";
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
        $this->twig_env->registerUndefinedFunctionCallback(function($name){
            if($name == 'icon'){
                return new Twig_Function_Function(function($x,$y='glyphicon'){ 
                        return '<span class="'.$y.' '.$y.'-'.$x.'"></span>';
                });
            } else {
                return false;
            }
        });
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
