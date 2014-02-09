<?php
$menu = $_CORE->load_lib('LibMenu');
$menu->set(
	array(
		'name' => '首页',
		'url' => get_url(),
		'page' => array('/')
	),
	array(
		'name' => 'Api',
		'page' => array('Api')
	),
	array(
		'name' => '帮助文档',
		'page' => array('Help')
	),
	array(
		'name' => '关于',
		'page' => array('About')
	),
	array(
		'name' => (get_lib('LibLogin')->is_login()?"登出":'登录'),
		'page' => (get_lib('LibLogin')->is_login()?array('Login','logout'):array('Login'))
	)
);
$menu->the_menu("\t\t<li>","</li>\n","","","select");
?>