<?php
class LibTemplate{
	private $title;
	function __construct(){
		$this->title = get_config('title');
	}
	public function set_title($title){
		$this->title = $title;
	}
	public function get_title(){
		return $this->title;
	}
	public function the_title(){
		if($this->title==get_config('title'))echo $this->title;
		else echo $this->title," - ",get_config('title');
	}
	public function is_home(){
		return count(get_core('LyUrl')->get_req_list())==0;
	}
}
?>