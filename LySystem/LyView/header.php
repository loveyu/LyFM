<?php header("content-Type: text/html; charset=utf-8"); ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php $_LibTemplate->the_title();?></title>
<link rel="stylesheet" type="text/css" href="<?=get_file_url('css/style.css')?>"/>
<link rel="stylesheet" type="text/css" href="<?=get_file_url('css/colorbox.css')?>"/>
<link rel="stylesheet" type="text/css" href="<?=get_file_url('css/uploadify.css')?>"/>
<script type="text/javascript">
var URL = '<?=WEB_URL?>';
var FILE_URL = '<?=WEB_FILE_URL?>';
var VERSION = '<?=VERSION?>';
<?php if($_LibLogin->is_login() && $_LibTemplate->is_home()):?>
var ROOT = '<?=str_replace("\\","/",dirname(WEB_PATH))?>';
var NOW_PATH = ROOT;
<?php endif;?>
</script>
<script type="text/javascript" src="<?=get_file_url('js/jquery-1.8.2.min.js')?>"></script>
</head>
<body>
<div id="container">
<div id="header">
	<div class="title">
		<img src="<?=get_file_url('images/LyFM.png')?>" alt="LyFM" />
		<!--h1><?php //get_config('title')?></h1-->
	</div>
	<div class="menu">
<?php $_CORE->view('menu');?>
	</div>
	<div class="clear"></div>
</div>
<div id="warp">

