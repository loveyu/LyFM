<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyPost extends LyRequest{
	function __construct(){
		$this->_array = &$_POST;
	}
	public function is_post(){
		return 'POST'==$_SERVER['REQUEST_METHOD'];
	}
}
?>