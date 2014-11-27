<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyCore{
	private $config;
	static $core;
	public $lib;
	public $helper;
	private $filter;
	private $core_lib;
	function __construct($core,$page,$view,$lib){
		self::$core = &$this;
		$this->config = array();
		$this->lib = array();
		$this->helper = array();
		$this->core_lib = array();
		$this->web_check = false;
		$this->init_param($core,$page,$view,$lib);
		$this->load_helper('system');
	}
	public function load_config($file){
		if(is_file(WEB_PATH.$file.".php")){
			require(WEB_PATH.$file.".php");
			if(is_array($$file)){
				$this->config = array_merge($this->config,$$file);
			}	
		}
	}
	public function get_config(){
		$r = '';
		$args = func_get_args();
		foreach($args as $v){
			$r .= "['$v']";
		}
		if($r){
			$rt = NULL;
			eval('if(isset($this->config'.$r.'))$rt = $this->config'.$r.';else $rt=false;');
			return $rt;
		}else{
			return $this->config;
		}
	}
	public function get_os(){
		return substr(PHP_OS,0,3)!='WIN'?"Linux":"Win";
	}
	public function default_load(){
		$this->load_core('LyTime','LyUrl','LySafe','LyRequest','LyPost','LyGet','LyCookie','LyFile');
		if(!$this->filter->LIB()){
			$this->core_error('Filter LIB 库加载失败');
		}
		if(!$this->web_open()){
			$args = func_get_args();
			call_user_func_array(array($this,'load'),$args);
		}
	}
	public function load(){
		$list = func_get_args();
		$path = PAGE_PATH;
		$i = 0;
		foreach($list as $id => $v){
			if(is_file($path.$v.'.php')){
				require_once($path.$v.'.php');					
				$page = new $list[$i];
				$methods = get_class_methods($page);
				if(isset($list[$i+1])){
					unset($list[$id]);
					$agr = array_values($list);
					unset($agr[0]);
					if(in_array($list[$i+1],array('__construct', '__destory', '__get', '__set', '__call', '__toString', '__clone')) || !in_array($list[$i+1],$methods)){
						$this->view_404();
						return false;
					}
					if(!empty($agr)){
						call_user_func_array(array($page, $list[$i+1]), $agr);
					}else{
						$page->$list[$i+1]();
					}
				}else{
					if(!in_array('main',$methods)){
						$this->view_404();
						return false;
					}
					$page->main();
				}
				return true;
			}elseif(is_dir($path.$v)){
				$path = $path.$v."/";
			}else{
				$this->view_404();
				return false;
			}
			unset($list[$id]);
			$i++;
		}
	}
	public function load_helper(){
		$list = func_get_args();
		foreach($list as $name){
			if(!isset($this->helper[$name]))
			{
				if(isset($name) && is_file(CORE_PATH."helper/".$name.'.php')){
					require_once(CORE_PATH."helper/".$name.'.php');
					$this->helper[$name] = $name;
				}else{
					$this->core_error("$name 功能文件加载失败");
				}
			}
		}		
	}
	public function load_c_lib(){	
		$list = func_get_args();
		foreach($list as $name){
			if(!isset($this->core_lib[$name]))
			{
				if(isset($name) && is_file(CORE_PATH."library/".$name.'.php')){
					require_once(CORE_PATH."library/".$name.'.php');
					if(class_exists($name)){
						$this->core_lib[$name] = new $name();
					}else{
						$this->core_lib[$name] = '';
					}	
				}else{
					$this->core_error("$name 系统类文件加载失败");
				}
			}
		}
		if(count($list)==1 && isset($this->core_lib[$list[0]])){
			return $this->core_lib[$list[0]];
		}else{
			return '';
		}
	}
	public function load_core(){
		$list = func_get_args();
		foreach($list as $name){
			if(!isset($this->$name))
			{
				if(isset($name) && is_file(CORE_PATH.$name.'.php')){
					require_once(CORE_PATH.$name.'.php');
					if(class_exists($name)){
						$this->$name = new $name();
					}
				}else{
					$this->core_error("$name 核心文件加载失败");
				}
			}
		}
	}
	private function init_param($core,$page,$view,$lib){
		define('WEB_PATH',dirname($_SERVER['SCRIPT_FILENAME'])."/");
		if(!is_dir($core) || $core=='/' || !is_dir($page) || $page=='/')$this->core_error("初始化页面目录不正常");
		define('CORE_PATH',WEB_PATH.$core.((substr($core,-1)!='/')?"/":""));
		define('PAGE_PATH',WEB_PATH.$page.((substr($page,-1)!='/')?"/":""));
		define('VIEW_PATH',WEB_PATH.$view.((substr($view,-1)!='/')?"/":""));
		define('LIB_PATH',WEB_PATH.$lib.((substr($lib,-1)!='/')?"/":""));
	}
	private function web_open(){
		$list = $this->LyUrl->get_req_list();
		if(!$this->filter->URL())return true;
		if(!empty($list)){
			call_user_func_array(array($this, 'load'), $list);
			return true;
		}else{
			return false;
		}
	}
	public function load_filter($name){
		$this->filter = $this->load_lib($name);
	}
	public function load_lib(){
		$list = func_get_args();
		$_class = array();
		foreach($list as $name){
			if(!isset($this->lib[$name]) && is_file(LIB_PATH.$name.'.php')){
				require_once(LIB_PATH.$name.'.php');
				if(class_exists($name)){
					$_class[$name] = new $name();
					if(isset($this->lib[$name])){
						unset($this->lib[$name]);
					}
					$this->lib[$name] = &$_class[$name];
				}
			}
		}
		if(count($list)==1)return $_class[$name];
		else return $_class;
	}
	private function view_404(){
		if($this->get_config('system','404_page')){
			$this->view($this->config['system']['404_page']);
		}else{
			$this->core_view('404');
		}
	}
	private function core_view($__CORE_name,$__CORE_param = array()){
		foreach($__CORE_param as $__CORE_id => $__CORE_value){
			$$__CORE_id = $__CORE_value;
		}
		include(CORE_PATH."page/$__CORE_name.php");
	}
	public function view($__CORE_file,$__CORE_param=array(),$__CORE_once=false){
		//加载默认变量
		$_CORE = &$this;
		foreach($this->lib as $__CORE_name => $__CORE_value){
			$__CORE_TMP = '_'.$__CORE_name;
			$$__CORE_TMP = $__CORE_value;
		}
		$_CONFIG = &$this->config;
		unset($__CORE_name,$__CORE_value,$__CORE_TMP);

		//加载文件
		if(is_file(VIEW_PATH.$__CORE_file.".php")){
			foreach($__CORE_param as $__CORE_name => $__CORE_v){
				$$__CORE_name = $__CORE_v;
			}
			unset($__CORE_param,$__CORE_name,$__CORE_v);
			if($__CORE_once){
				unset($__CORE_once);
				include_once(VIEW_PATH.$__CORE_file.".php");
			}else{
				unset($__CORE_once);
				include(VIEW_PATH.$__CORE_file.".php");
			}
			return true;
		}else{
			return false;
		}
	}
	private function core_error($error){
		$this->core_view('error',array('message'=>$error));
		exit(-1);
	}
}
?>