<?php
$list =	array(
			array(
				'id'		=>	'DefaultPassword',
				'name'		=>	'默认密码修改',
				'reason'	=>	'单用户管理密码默认值未修改',
				'answer'	=>	'修改根目录config.php中password的值,密码为md5值'
			),
			array(
				'id'		=>	'BoxDrag',
				'name'		=>	'对话框拖动不正常',
				'reason'	=>	'js对对话框拖动支持不好',
				'answer'	=>	'忍着，或者你提交一个可行的解决方案'
			),
			array(
				'id'		=>	'VersionUpdate',
				'name'		=>	'版本更新',
				'reason'	=>	'采用ajax获取数据，使用HTML5的 localStorage进行存储24小时',
				'answer'	=>	'注释掉js/load.js 初始化中的check_update()函数'
			),
			array(
				'id'		=>	'SendSMTPMail',
				'name'		=>	'SMTP邮件发送失败',
				'reason'	=>	'在SMTP失败，提示框显示状态信息',
				'answer'	=>	'请检查发送人邮箱地址是否与SMPT账号一致，其余问题自己百度'
			),
			array(
				'id'		=>	'MailConfig',
				'name'		=>	'邮件发送配置问题',
				'reason'	=>	'邮件发送采用PHPmailer类',
				'answer'	=>	'相应的数组会对PHPmailer类中的变量进行赋值操作'
			),
			array(
				'id'		=>	'MailTimeOut',
				'name'		=>	'邮件发送时间过长',
				'reason'	=>	'在邮件发送API中，PHP执行时间设置为无限长',
				'answer'	=>	'在邮件发送成功后将会返回状态进行提示，关闭或刷新当前窗口会导致发送操作取消'
			),
			array(
				'id'		=>	'UrlDownload',
				'name'		=>	'远程文件下载无效',
				'reason'	=>	'文件下载无效出错',
				'answer'	=>	'检测下载地址是否需要COOKIE等，检测配置文件中的最大下载值'
			),
			array(
				'id'		=>	'LoginError',
				'name'		=>	'登录成功却无法进入首页',
				'reason'	=>	'该问题由cookie域名出错引起',
				'answer'	=>	'修改config.php中的cookie域名的值，可以使用ip地址，但如localhost之类的会失效，请更换其他'
			),	
			array(
				'id'		=>	'UrlDownloadTimeOut',
				'name'		=>	'远程下载超时',
				'reason'	=>	'脚本执行时间为无限',
				'answer'	=>	'载文件脚本的执行时间为永久，可以通过刷新文件查看下载进度'
			),	
			array(
				'id'		=>	'UploadError',
				'name'		=>	'无法进行文件上传',
				'reason'	=>	'程序使用了一个flash的文件上传组件，请检查是否支持flash',
				'answer'	=>	'安装新版本的Flash，之后重启浏览器'
			),
			array(
				'id'		=>	'HtmlError',
				'name'		=>	'网页错位',
				'reason'	=>	'程序未进行兼容性测试，在Chrome 25下进行调试',
				'answer'	=>	'请安装新版支持html5的浏览器'
			),
			array(
				'id'		=>	'SeeSourceCode',
				'name'		=>	'能否查看实现的源代码',
				'reason'	=>	'看下程序实现这些接口的代码',
				'answer'	=>	'可以通过查看LySystem/LyPage/Api.php,和LySystem/LyLi/LyFile.php'
			),
			array(
				'id'		=>	'Nginx',
				'name'		=>	'nginx下无法使用',
				'reason'	=>	'由于nginx需要修改的配置文件不一样',
				'answer'	=>	'参考程序跟目录下的nginx.conf配置文件'
			),
			array(
				'id'		=>	'Apache',
				'name'		=>	'Apache的访问方式',
				'reason'	=>	'程序使用PHPINFO和Query解析请求路径',
				'answer'	=>	'在未配置伪静态的情况下使用 index.php/Login的形式进行访问'
			),
			array(
				'id'		=>	'License',
				'name'		=>	'程序使用协议问题',
				'reason'	=>	'免费程序带来的一系列问题我无法对你的失误操作进行赔偿，捐助仅仅是支持',
				'answer'	=>	'不要使用该程序对商业性质网站进行管理，否则出事，后果自负。个人性质请谨慎使用，程序作者不对数据和安全负责。'
			),
		);
?>
<div id="help">
<h2>帮助文档</h2>
<ul>
<?php foreach($list as $v){ ?>
	<li><div>
		<h3 id="<?php echo $v['id']?>"><?php echo $v['name']?></h3>
		<p class="reason">原因：<?php echo $v['reason']?></p>
		<p class="answer">解决：<?php echo $v['answer']?></p>
	</div></li>
<?php }?>
</ul>
</div>