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
	$args = func_get_args();
	return call_user_func_array(array(get_core(),'get_config'),$args);
}
function get_url($param=''){
	if(is_array($param))return WEB_URL.implode("/",$param);
	return WEB_URL.$param;
}
function get_file_url($param=''){
	if(is_array($param))return WEB_URL.implode("/",$param);
	return WEB_FILE_URL.$param;
}

/**
 * 打印调试信息
 * @return string
 */
function print_stack_trace()
{
	$array =debug_backtrace();
	//print_r($array);//信息很齐全
	unset($array[0]);
	$html = "";
	foreach($array as $row)
	{
		$html .="<p>".(isset($row['file'])?$row['file']:"__").':'.
		              (isset($row['line'])?$row['line']:"__").' line, call:'.
		              (isset($row['function'])?$row['function']:"__")."<p>\n";
	}
	return $html;
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


/**
 * 输出错误信息
 * @param $error
 * @param $message
 * @param $file
 * @param $line
 */
function php_error_log($error=null, $message=null, $file=null, $line=null){
	$type = NULL;
	switch($error){
		case E_COMPILE_ERROR:
			$type = "E_COMPILE_ERROR";
			break;
		case E_ERROR:
			$type = "E_ERROR";
			break;
		case E_WARNING:
			$type = "E_WARNING";
			break;
		case E_NOTICE:
			$type = "E_NOTICE";
			break;
		default:
			$type = "UNKNOWN";
	}
	echo @"\n<br />\n<b>{$type}</b>:  {$message} in <b>{$file}</b> on line <b>{$line}</b><br />\n";
	echo print_stack_trace();
}

function shutdown_error_log(){
	if ( ( $e = error_get_last() ) && $e['type'] == E_ERROR || $e['type'] == E_COMPILE_ERROR ) {
		call_user_func_array( 'php_error_log', $e );
	}
}