<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyRequest{
	public $_array;
	function __construct(){
		$this->_array = array();
	}
	public function get(){
		$arr = func_get_args();
		$array = $this->_array;
		foreach($arr as $v){
			if(isset($array[$v])){
				$array = $array[$v];
			}else{
				return false;
			}
		}
		return $array;
	}
	public function get_s(){
		$args = func_get_args();
		$rt = call_user_func_array(array($this,'get'),$args);
		if(is_array($rt)){
			foreach($rt as $id => $v){
				if(is_array($v)){
					get_core('LySafe')->escape_array($rt[$id]);
				}else{
					$rt[$id] = get_core('LySafe')->escape($rt[$id]);
				}
			}
			return $rt;
		}else{
			return get_core('LySafe')->escape($rt);
		}
	}
}
?>