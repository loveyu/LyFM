<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
function get_core($name = ''){
	$r_core = LyCore::$core;
	if($name!='' && isset($r_core->$name)){
		return $r_core->$name;
	}else{
		return $r_core;
	}
}
function get_lib($name=''){
	$r_core = LyCore::$core;
	if($name=='')return $r_core->lib;
	if(isset($r_core->lib[$name])){
		return $r_core->lib[$name];
	}else{
		return get_core()->load_lib($name);
	}
}
function get_config(){
	return call_user_func_array(array(get_core(),'get_config'),func_get_args());
}
function get_url($param=''){
	if(is_array($param))return WEB_URL.implode("/",$param);
	return WEB_URL.$param;
}
function get_file_url($param=''){
	if(is_array($param))return WEB_URL.implode("/",$param);
	return WEB_FILE_URL.$param;
}
function redirect($uri = '', $method = 'location', $http_response_code = 302){
	if ( ! preg_match('#^https?://#i', $uri)){
		$uri = get_url($uri);
	}
	switch($method){
		case 'refresh'	: header("Refresh:0;url=".$uri);
			break;
		default			: header("Location: ".$uri, TRUE, $http_response_code);
			break;
	}
	exit;
}
function system_path($path){
	if(PHP_OS=='WIN32' || PHP_OS=='WINNT')
		return rtrim(mb_convert_encoding($path,"GBK","UTF-8"));
	else
		return rtrim($path);
}
function porgram_path($path){
	if(PHP_OS=='WIN32' || PHP_OS=='WINNT')
		return rtrim(mb_convert_encoding($path,"UTF-8","GBK"));
	else
		return rtrim($path);
}
?>