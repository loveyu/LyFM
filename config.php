<?php
//数组中不要使用下划线等字符，以免出错
$config = array(
	'title' => 'LY PHP 文件管理器',
	'password' => isset($_SERVER['ENV_DEFINE_LYFM_PASSWORD']) ?
		$_SERVER['ENV_DEFINE_LYFM_PASSWORD'] : //这里如果定义一个环境变量则以环境变量的值为准
		'94a5f0635f5e7163fc23346870d55b52',//default 94a5f0635f5e7163fc23346870d55b52 使用密码的MD5值
	'system'   => array(
		'404_page' => '',//404页面，留空默认系统
		'cookie_prefix' => 'fm_',//COOKIE前缀,留空为空
		'cookie_domain' => '',//COOKIE域名,留空为默认包含全部子域
		'cookie_hash' => '68468gt579*&)&tgluik',//COOKIE加密字符串，留空不加密
	),
	'mail' => array(//PHPmailer配置文件
		'SMTPDebug'	=>	'2',
		'SMTPAuth'	=>	true,
		'SMTPSecure'	=>	'ssl',
		'Host'	=>	'smtp.qq.com',
		'Port'	=>	'465',
		'Username'	=>	'',
		'Password'	=>	'',
		'CharSet'	=>	'utf-8',
	),
	'mailForm' => array(//邮件发送配置
		'add' => '',
		'name' => '',
	),
	'MaxDlSize' => '52428800',//B 最大下载文件
);
/**
 * 是否使用调试模式，启用后会输出错误信息
 */
define('_Debug_', false);
if(_Debug_){
    ini_set('display_errors','on');
    error_reporting(E_ALL | E_STRICT);
} else{
    ini_set('display_errors','off');
    error_reporting(0);
}
?>