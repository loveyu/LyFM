<?php
class About{
	public function main(){
		get_lib('LibTemplate')->set_title('关于');
		get_core()->view('header');
		get_core()->view('about');
		get_core()->view('footer');
	}
}
?>