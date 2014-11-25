<?php
class LibFilter{
	public function URL(){
		$this->setTimeZone();
		/**
		 * @var $login LibLogin
		 */
		$login = get_core()->load_lib('LibLogin');
		$url_list = get_core('LyUrl')->get_req_list();
		if($login->is_login()){
			return true;
		}else{
			if(isset($url_list[0]) && in_array($url_list[0],array('Login','Help','About'))){
				return true;
			}
			redirect(get_url('Login?redirect='.urlencode(NOW_URL)));
			return false;
		} 
	}
	public function LIB(){
		get_core()->load_lib('LibTemplate');
		return true;
	}
	private function setTimeZone(){
		date_default_timezone_set('Asia/Shanghai');
	}
}
?>