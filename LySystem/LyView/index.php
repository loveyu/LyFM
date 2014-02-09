<div id="file_list">
	<div class="path">
		<h3>当前路径：</h3>
		<span class="refresh"><?php if($_CORE->get_os()=='Win'){?><a href="#" onClick="return choice_drive();">选择驱动器</a> <?php }?><a href="#" onClick="return load_file_list(ROOT)">还原</a> <a href="#" onClick="return load_file_list(NOW_PATH)">刷新</a></span>
		<div class="clear"></div>
	</div>
	<div class="table_head">
		<table>
			<thead>
				<tr><td class="first">类型</td><td>名称</td><td>大小</td><td>权限</td><td>操作</td><td>修改时间</td><td>创建时间</td><?php if($_CORE->get_os()=='Linux'){?><td>用户</td><td>用户组</td><?php }?><td><a href="#" onClick="return click_all_checkbox();">选择</a></td></tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	<div class="table">
		<table>
			<tbody>
			</tbody>
		</table>
	</div>
</div>
<div id="file_action">
	<div class="box">
		<form class="GO_TO_PATH" onSubmit="return false;"><input id="GO_TO_PATH" name="path" type="text" value="" />
		<button onClick="return load_file_list($('#GO_TO_PATH').val());" type="submit">跳转到</button></form>
	</div>
	<div class="box">
		<p>选择：<a href="#" onClick="return click_all();">全选</a><a href="#" onClick="return click_all_no();">全不选</a><a href="#" onClick="return click_f();">反选</a><a href="#" onClick="return click_all_file();">文件</a></p>
	</div>
	<div class="box action">
		<h4>选中项：</h4>
		<p><a href="#" onClick="return delete_more();">删除</a><a href="#" onClick="return copy_more();">复制</a><a href="#" onClick="return move_more();">移动</a></p>
		<p><a href="#" onClick="return chmod_more();">修改权限</a><a href="#" onClick="return zip_more();">压缩</a></p>
		<p><a href="#" onClick="return email_more();">邮件发送</a><a href="#" onClick="return text_open_more();">文本打开</a></p>
		<p><a href="#" onClick="return char_set_change_more();" >文件编码转换</a> (针对文本文件)</p>
	</div>
	<div class="box action">
		<p><a href="#" onClick="return run_code();">执行任意代码或还原</a></p>
	</div>
	<div class="box feedback">
		<p><a href="http://www.loveyu.org/" id="feedback_url" target="_blank">Bug 反馈</a></p>
		<p><a href="#" class="update_now" onClick="return check_up_now();">立即刷新更新状态</a></p>
	</div>
	<div class="box bug">
		<h4>Bug及更新动态(本地存储 24小时更新一次)</h4>
		<ul>
		</ul>
	</div>
	<div class="box">
		 <a href='http://me.alipay.com/iloveyu' target="_blank"> <img src='<?php echo get_file_url('images/alipay_pay.png')?>' /></a>
	</div>	
</div>
<div class="clear"></div>
<div id="function">
	<form id="make_dir" class="box" onSubmit="return false;">
	<label><span>新文件夹(允许多层):</span><input type="text" name="name" value="" /></label>
	<button type="submit">创建</button>
	</form>
	<form id="make_file" class="box" onSubmit="return false;">
	<label><span>新文件：</span><input type="text" name="name" value="" /></label>
<?php $file_char_set = array('UTF-8','GBK','GB2312','ASCII','UNICODE','BIG5','UCS-2','UCS-2LE','UCS-2BE');?>
	<label><span>编码：</span><select name="char_set"><?php foreach($file_char_set as $v){ ?><option><?php echo $v?></option><?php }?></select></label>
	<button type="submit">创建</button>
	</form>
	<div class="box"><button type="button" onClick="return web_download();" class="big">远程下载文件</button></div>
	<div class="box"><button type="button" onClick="return file_upload();" id="Upload_Button" class="big">文件上传</button></div>
	<div class="clear"></div>
</div>
