<div id="api_list">
<h2>Api List</h2>
<?php
$list =	array(
			array(
				'name'		=>	'获取文件夹内文件和文件夹列表',
				'url' 		=>	'Api/file_list',
				'param'		=>	'path',
			),
			array(
				'name'		=>	'文件或文件夹重命名',
				'url' 		=>	'Api/rename',
				'param'		=>	'path,name',
			),
			array(
				'name'		=>	'删除文件或文件夹',
				'url' 		=>	'Api/delete',
				'param'		=>	'path',
			),
			array(
				'name'		=>	'移动文件或文件夹',
				'url' 		=>	'Api/move_file',
				'param'		=>	'path,new_path,type={file,dir}',
			),
			array(
				'name'		=>	'复制文件或文件夹',
				'url' 		=>	'Api/copy_file',
				'param'		=>	'path,new_path,type={file,dir}',
			),
			array(
				'name'		=>	'在当前目录递归创建文件夹',
				'url' 		=>	'Api/mkdir',
				'param'		=>	'path,name',
			),
			array(
				'name'		=>	'修改文件或目录单级权限',
				'url' 		=>	'Api/change_perms',
				'param'		=>	'path,new_perms',
			),
			array(
				'name'		=>	'对文件系统的多个文件进行文件权限批量或递归修改',
				'url' 		=>	'Api/chmod_more',
				'param'		=>	'[POST]:path,list[],file_mode,dir_mode,r',
			),
			array(
				'name'		=>	'zip压缩单个文件或目录到指定文件',
				'url' 		=>	'Api/zip_file',
				'param'		=>	'path,zip_path',
			),
			array(
				'name'		=>	'压缩多个文件或文件夹到当前目录的指定文件名',
				'url' 		=>	'Api/zip_more',
				'param'		=>	'path,list[],zip_name',
			),
			array(
				'name'		=>	'解压zip文件到指定已存在的目录',
				'url' 		=>	'Api/unzip_file',
				'param'		=>	'path,unzip_path',
			),
			array(
				'name'		=>	'读取zip文件内容列表(非绝对准确)',
				'url' 		=>	'Api/read_zip_file',
				'param'		=>	'path',
			),
			array(
				'name'		=>	'指定编码返回文件内容',
				'url' 		=>	'Api/get_file',
				'param'		=>	'path,char_set',
			),
			array(
				'name'		=>	'将内容写入文件',
				'url' 		=>	'Api/put_file',
				'param'		=>	'[POST]:path,char_set,content',
			),
			array(
				'name'		=>	'创建一个空文件',
				'url' 		=>	'Api/mk_file',
				'param'		=>	'path,name',
			),
			array(
				'name'		=>	'获取window的驱动器列表',
				'url' 		=>	'Api/window_dirve',
				'param'		=>	'无',
			),
			array(
				'name'		=>	'文件编码转换',
				'url' 		=>	'Api/change_charset',
				'param'		=>	'path,old_char,new_char',
			),
			array(
				'name'		=>	'邮件发送文件',
				'url' 		=>	'Api/mail_file',
				'param'		=>	'[POST]:path,list[],more,email,method',
			),
			array(
				'name'		=>	'获取一个媒体文件，图片音频等，二进制数据',
				'url' 		=>	'Api/get_media',
				'param'		=>	'path',
			),
			array(
				'name'		=>	'获取一个能够展示的html5多媒体页面,音频和视频',
				'url' 		=>	'Api/get_ajax_media',
				'param'		=>	'path,type',
			),
			array(
				'name'		=>	'执行任意代码，返回输出数据',
				'url' 		=>	'Api/run_code',
				'param'		=>	'[POST]:code',
			),
			array(
				'name'		=>	'URL远程下载文件到网站',
				'url' 		=>	'Api/url_download',
				'param'		=>	'path,url,name',
			),
			array(
				'name'		=>	'下载网站任意文件到计算机',
				'url' 		=>	'Api/file_download',
				'param'		=>	'path',
			),
			array(
				'name'		=>	'单个文件上传',
				'url' 		=>	'Api/upload_file',
				'param'		=>	'[POST]:path,[FILES]:Filedata',
			),
		);
?>
<ul>
<?php foreach($list as $v){ ?>
	<li><div>
		<h3><?php echo $v['name']?></h3>
		<p class="api"><?php echo $v['url']?></p>
		<p class="des">参数：<?php echo $v['param']?></p>
	</div></li>
<?php }?>
</ul>
</div>