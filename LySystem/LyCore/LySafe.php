<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LySafe{
	function __construct(){
		if(phpversion()<'5.3.0') { 
			set_magic_quotes_runtime(0);
		}
		if(PHP_VERSION<6 && get_magic_quotes_gpc()){
			$this->tescape_array($_GET);
			$this->tescape_array($_POST);
			$this->tescape_array($_COOKIE);
		}
	}
	public function encrypt($encrypt,$key='') { 
		$iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND ); 
		$passcrypt = mcrypt_encrypt ( MCRYPT_RIJNDAEL_256, $key, $encrypt, MCRYPT_MODE_ECB, $iv ); 
		$encode = base64_encode ( $passcrypt ); 
		return $encode; 
	}
	public function decrypt($decrypt,$key='') { 
		$decoded = base64_decode ( $decrypt ); 
		$iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND ); 
		$decrypted = mcrypt_decrypt ( MCRYPT_RIJNDAEL_256, $key, $decoded, MCRYPT_MODE_ECB, $iv );
		return $decrypted; 
	}
	public function escape($string){
		return mysql_real_escape_string($string);
	}
	public function tescape($string){
		return stripslashes($string);
	}
	private function tescape_array(&$array){
		//数组数据反转义
		foreach($array as $id => $v){
			if(is_array($v)){
				$this->tescape_array($array[$id]);
			}else{
				$array[$id] = $this->tescape($array[$id]);
			}
		}
	}
	private function escape_array(&$array){
		//数组转义
		foreach($array as $id => $v){
			if(is_array($v)){
				$this->escape_array($array[$id]);
			}else{
				$array[$id] = $this->escape($array[$id]);
			}
		}
	}
	public function text($content){
		return htmlspecialchars($content);
	}
}
?>