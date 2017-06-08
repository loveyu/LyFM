<?php
/**
 * LyCore
 * Copyright (c) 2013 loveyu
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
class LySafe
{
	function __construct()
	{
		if(version_compare(PHP_VERSION, '5.3.0', "<")) {
			set_magic_quotes_runtime(0);
		}
		if(version_compare(PHP_VERSION, '7.0.0', "<") && get_magic_quotes_gpc()) {
			$this->tescape_array($_GET);
			$this->tescape_array($_POST);
			$this->tescape_array($_COOKIE);
		}
	}

	public function encrypt($encrypt, $key = '')
	{
		if(!function_exists('mcrypt_encrypt') || version_compare(PHP_VERSION, '7.1.0', ">=")) {
			return self::encrypt_self($encrypt, $key);
		}
		$passcrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $encrypt, MCRYPT_MODE_ECB);
		$encode = base64_encode($passcrypt);
		return $encode;
	}

	public function encrypt_self($txt, $key = '')
	{
		//当不存在mcrypt函数库时的加密方法
		srand((double)microtime() * 1000000);
		$encrypt_key = md5(rand(0, 32000));
		$ctr = 0;
		$tmp = '';
		for($i = 0; $i < strlen($txt); $i++) {
			$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
			$tmp .= $encrypt_key[$ctr].($txt[$i] ^ $encrypt_key[$ctr++]);
		}
		return base64_encode(self::passport_key($tmp, $key));
	}

	public function decrypt_self($txt, $key)
	{
		//当不存在mcrypt函数库时的解密方法
		$txt = self::passport_key(base64_decode($txt), $key);
		$tmp = '';
		for($i = 0; $i < strlen($txt); $i++) {
			$md5 = $txt[$i];
			$tmp .= $txt[++$i] ^ $md5;
		}
		return $tmp;
	}

	function passport_key($txt, $encrypt_key)
	{
		$encrypt_key = md5($encrypt_key);
		$ctr = 0;
		$tmp = '';
		for($i = 0; $i < strlen($txt); $i++) {
			$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
			$tmp .= $txt[$i] ^ $encrypt_key[$ctr++];
		}
		return $tmp;
	}

	public function decrypt($decrypt, $key = '')
	{
		if(!function_exists('mcrypt_decrypt') || version_compare(PHP_VERSION, '7.1.0', ">=")) {
			return self::decrypt_self($decrypt, $key);
		}
		$decoded = base64_decode($decrypt);
		$decrypted = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), $decoded, MCRYPT_MODE_ECB);
		return $decrypted;
	}

	public function escape($string)
	{
		return mysql_real_escape_string($string);
	}

	public function tescape($string)
	{
		return stripslashes($string);
	}

	private function tescape_array(&$array)
	{
		//数组数据反转义
		foreach($array as $id => $v) {
			if(is_array($v)) {
				$this->tescape_array($array[$id]);
			} else {
				$array[$id] = $this->tescape($array[$id]);
			}
		}
	}

	private function escape_array(&$array)
	{
		//数组转义
		foreach($array as $id => $v) {
			if(is_array($v)) {
				$this->escape_array($array[$id]);
			} else {
				$array[$id] = $this->escape($array[$id]);
			}
		}
	}

	public function text($content)
	{
		return htmlspecialchars($content);
	}
}

?>