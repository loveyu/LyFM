<?php
define('VERSION','0.1.5');
require_once('LySystem/LyCore/LyCore.php');
$LyFile = new LyCore('LySystem/LyCore','LySystem/LyPage','LySystem/LyView','LySystem/LyLib');//核心文件夹目录，页面文件夹,视图文件夹,用户定义类
$LyFile->load_config("config");
$LyFile->load_filter("LibFilter");//加载过滤器,任意一过滤方法返回false后结束执行
								//URL()//页面解析之后
								//LIB()//页面加载之前
$LyFile->default_load('Welcome');//设置默认页面,对应页面文件夹中Welcome文件Welcome类的main,
						//指定其他类和参数使用 文件夹,...,文件夹(文件夹留空为默认文件夹),文件名(类名),函数名,参数1,参数2,.... 的内容
						//当类名(文件)和文件夹冲突时优先取类
?>