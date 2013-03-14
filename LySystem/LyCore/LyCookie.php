<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyCookie{
	private $domain;
	private $hash;
	private $prefix;
	function __construct(){
		$this->domain = get_config('system','cookie_domain');
		$this->hash = get_config('system','cookie_hash');
		$this->prefix = get_config('system','cookie_prefix');
		$this->_array = &$_COOKIE;
	}
	public function get(){
		$arr = func_get_args();
		$array = $_COOKIE;
		foreach($arr as $v){
			if(isset($array[$this->prefix.$v])){
				$array = $array[$this->prefix.$v];
			}else{
				return false;
			}
		}
		$this->decode_array($array);
		return $array;
	}
	public function set($name,$value,$expire=0,$path='',$domain='',$secure=false,$httponly=false){
		setcookie($this->prefix.$name,$this->encode($value),$expire,$this->get_path($path),$this->get_domain($domain),$secure,$httponly);
	}
	public function del($name,$path='',$domain=''){
		setcookie($this->prefix.$name,"",0,$this->get_path($path),$this->get_domain($domain),'');
	}
	private function get_path($path){
		if(''==$path)return URL_PATH;
		else return $path;
	}
	private function get_domain($domain){
		$host = $_SERVER['HTTP_HOST'];
		if(''==$domain){
			if(!$this->domain){
				if(strpos($host,'www.')===0){
					return substr($host,3);
				}else{
					return ".".$host;
				}
			}else{
				return $this->domain;
			}
		}else{
			return $domain;
		}
	}
	private function encode($cookie){
		if($this->hash){
			return get_core('LySafe')->encrypt($cookie,$this->hash);
		}else{
			return $cookie;
		}
	}
	private function decode($cookie){
		if($this->hash){
			return get_core('LySafe')->decrypt($cookie,$this->hash);
		}else{
			return $cookie;
		}
	}
	private function decode_array(&$array){
		if($this->hash){
			if(is_array($array)){
				foreach($array as $id => $v){
					if(is_array($v)){
						$this->decode_array($array[$id]);
					}else{
						$array[$id] = $this->decode($array[$id]);
					}
				}
			}else{
				$array = $this->decode($array);
			}
		}
	}
}
?>