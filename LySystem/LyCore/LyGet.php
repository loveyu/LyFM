<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyGet extends LyRequest{
	function __construct(){
		$this->_array = &$_GET;
	}
	public function is_get(){
		return 'GET'==$_SERVER['REQUEST_METHOD'];
	}
}
?>