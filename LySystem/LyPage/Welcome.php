<?php
class Welcome{
	private $core;
	function __construct(){
		$this->core = get_core();
	}
	public function main(){
		$this->core->view('header');
		$this->core->view('index');
		$this->core->view('footer');
	}
}
?>