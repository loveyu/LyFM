<?php
//数组中不要使用下划线等字符，以免出错
$config = array(
	'title' => 'LY PHP 文件管理器',
	'password' => '40cf9ca4ccba1c36f9b6c68f263cca82',//default 94a5f0635f5e7163fc23346870d55b52 使用密码的MD5值
	'system' => array(
		'404_page' => '',//404页面，留空默认系统
		'cookie_prefix' => 'ly_fm_',//COOKIE前缀,留空为空
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
?>
