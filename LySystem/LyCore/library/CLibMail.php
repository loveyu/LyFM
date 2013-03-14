<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class CLibMail{
	private $mailer;
	private $status;
	public function __construct(){
		require_once(CORE_PATH."library/phpmailer.php");
		require_once(CORE_PATH."library/smtp.php");
		$this->mailer = new PHPMailer();
		$this->status = false;
	}
	public function set_config($config){
		if(is_array($config)){
			foreach($config as $name => $value){
				if(isset($this->mailer->$name)){
					$this->mailer->$name = $value;
				}
			}
		}
	}
	public function set_from($add,$name=''){
		$this->mailer->SetFrom($add,$name);
	}
	public function AddAddress($add,$name=''){
		$this->mailer->AddAddress($add,$name);
	}
	public function get_mailer(){
		return $this->mailer;
	}
	public function set_method($arg){
		switch(strtolower($arg)){
			case 'smtp':
				$this->mailer->IsSMTP();
			break;
			case 'mail':
				$this->mailer->IsMail();
			break;
			case 'sendmail':
				$this->mailer->IsSendmail();
			break;
			case 'qmail':
				$this->mailer->IsQmail();
			break;
		}
	}
	public function body($content){
		$this->mailer->MsgHTML($content);
	}
	public function send(){
		try {
			if($this->mailer->send()){
				return true;
			}else{
				return false;
			}
		}catch (phpmailerException $e) {
			return $e->errorMessage();
		}catch (Exception $e) {
			return $e->getMessage();
		}
	}
	public function status(){
		return $this->status;
	}
	public function AddAttachment($file_list,$max_size=0){
		
		$size = 0;
		if(!is_array($file_list)){
			$file_list = array($file_list);
		}
		foreach($file_list as $v){
			if(!is_file($v) || !is_readable($v)){
				return false;
			}else{
				$s = filesize($v);
				if($s<0){
					return false;
				}else{
					$size += $s;
					if($max_size>0 && $size>$max_size){
						return false;
					}
				}
			}
		}
		foreach($file_list as $v){
			$this->mailer->AddAttachment($v);
		}
		return true;
	}
}
?>