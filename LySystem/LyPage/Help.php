<?php
class Help{
	public function main(){
		get_lib('LibTemplate')->set_title('帮助文档');
		get_core()->view('header');
		get_core()->view('help');
		get_core()->view('footer');
	}
}
?>