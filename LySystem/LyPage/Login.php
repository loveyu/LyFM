<?php
class Login{
	/**
	 * @var LibLogin
	 */
	private $lib;
	function __construct(){
		if(get_config('password')=='94a5f0635f5e7163fc23346870d55b52'){
			redirect('Help#DefaultPassword');
		}
		$this->lib = get_lib('LibLogin');
	}
	public function main(){

		get_lib('LibTemplate')->set_title('用户密码验证');
		get_core()->view('header');
		get_core()->view('login');
		get_core()->view('footer');
	}
	public function logout(){
		$this->lib->logout();
		redirect('Login');
	}
	public function post(){
		$this->lib->set_password(get_core('LyPost')->get('password'),true);
		if($this->lib->v()){
			if(get_core('LyPost')->get('redirect'))
				redirect(get_core('LyPost')->get('redirect'));
			else
				redirect(get_url());
		}else{
			if(get_core('LyPost')->get('redirect'))
				redirect(get_url('Login?status=error&redirect='.urlencode(get_core('LyPost')->get('redirect'))));
			else
				redirect(get_url('Login?status=error'));
			
		}
	}
}
?>