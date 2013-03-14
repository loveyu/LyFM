<?php
class LibLogin{
	private $password;
	private $is_login;
	function __construct(){
		$this->is_login = false;
		$this->auto_login();
	}
	public function set_password($pwd,$md5=false){
		if($md5)$this->password = $pwd;
		else $this->password = md5($pwd);
	}
	public function is_login(){
		return $this->is_login;
	}
	public function v(){
		if(get_config('password')==$this->password){
			$this->set_cookie();
			$this->is_login = true;
		}
		return $this->is_login();
	}
	private function set_cookie(){
		get_core('LyCookie')->set('LyFileManage',$this->password."\n".$_SERVER['HTTP_USER_AGENT']);
	}
	private function delete_cookie(){
		get_core('LyCookie')->del('LyFileManage');
	}
	public function logout(){
		$this->delete_cookie();
	}
	private function auto_login(){
		$pass = get_core('LyCookie')->get('LyFileManage');
		if($pass){
			$pass = explode("\n",$pass);
			$this->set_password(trim($pass[0]),true);
			if(get_config('password')==$this->password && $_SERVER['HTTP_USER_AGENT']==trim($pass[1])){
				$this->is_login = true;
			}else{
				$this->delete_cookie();
			}
		}
	}
}
?>