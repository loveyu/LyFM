<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyUrl{
	private $path;
	private $url_list;
	function __construct() {
		if(!isset( $_SERVER['REQUEST_URI'])){
			$_SERVER['REQUEST_URI'] = $_SERVER['PHP_SELF'];
			if(isset($_SERVER['QUERY_STRING'])){
				$_SERVER['REQUEST_URI'] .= '?'.$_SERVER['QUERY_STRING'];
			}
		}
		$this->init_param();
	}
	private function make_list(){
		if($this->path=='' || '/'==$this->path || $_SERVER['SCRIPT_NAME']==$this->path)return array();
		if(substr($this->path,0,1)!='/'){
			$this->path = "/".$this->path;
		}
		if(substr($this->path,-1)=='/'){
			return explode("/",substr($this->path,1,-1));
		}else{
			return explode("/",substr($this->path,1));
		}
	}
	public function get_req_list(){
		return $this->url_list;
	}
	private function init_param(){
		$this->make_req();
		$this->url_list = $this->make_list();
		$is_https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' && !empty($_SERVER['HTTPS']);
		define('NOW_URL',($is_https?'https://':'http://').$_SERVER["HTTP_HOST"].$_SERVER['REQUEST_URI']);
		define('URL_PATH',dirname($_SERVER['SCRIPT_NAME']));
		$i = strpos($_SERVER['REQUEST_URI'],$_SERVER['SCRIPT_NAME']);
		if($i==0 && $i!==false){
			define('WEB_URL',($is_https?'https://':'http://').$_SERVER["HTTP_HOST"].$this->clean_url_more_char($_SERVER['SCRIPT_NAME']."/"));
			define('WEB_FILE_URL',($is_https?'https://':'http://').$this->clean_url_more_char($_SERVER["HTTP_HOST"].dirname($_SERVER['SCRIPT_NAME'])."/"));
		}else{
			define('WEB_URL',($is_https?'https://':'http://').$_SERVER["HTTP_HOST"].$this->clean_url_more_char(dirname($_SERVER['SCRIPT_NAME'])."/"));
			define('WEB_FILE_URL',WEB_URL);
		}
	}
	private function clean_url_more_char($url){
		return preg_replace("/[\\/\\\\]+/","/",$url);
	}
	private function make_req(){
		if(isset($_SERVER['SERVER_SOFTWARE']) && strtolower($_SERVER['SERVER_SOFTWARE'])=="microsoft-iis/5.1" &&!isset($_SERVER['PATH_INFO']) && isset($_SERVER['HTTP_X_ORIGINAL_URL'])){
			$pos = strpos($_SERVER['HTTP_X_ORIGINAL_URL'],'?');
			$len = strlen($_SERVER["PHP_SELF"]);
			if($pos===false){
				$_SERVER['PATH_INFO'] = substr($_SERVER['HTTP_X_ORIGINAL_URL'],$len);
			}else{
				$_SERVER['PATH_INFO'] = substr($_SERVER['HTTP_X_ORIGINAL_URL'],$len,$pos-$len);
			}
		}
		if(!isset($_SERVER['PATH_INFO']) || $_SERVER['PATH_INFO']===""){
			$i = strpos($_SERVER['REQUEST_URI'],'?');
			if($i===false){
				$this->path = $_SERVER['REQUEST_URI'];
			}else{
				$this->path = substr($_SERVER['REQUEST_URI'],0,$i);
			}
			$dir = dirname($_SERVER['SCRIPT_NAME']);
			$j = strpos($this->path,$dir);
			if($j===0){
				$this->path = substr($this->path,strlen($dir));
			}
		}else{
			$this->path = $_SERVER['PATH_INFO'];
		}
		$this->path = trim($this->path);
	}
}
?>