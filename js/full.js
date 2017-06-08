/*
 LyFM
 Copyright (c) 2013 loveyu
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
function LyFM(id) {
	LyFM.ID = id;
	this.reSizeSidebar();
}
var NOW_PATH = '';
if (typeof URL == 'undefined') {
	// 增对为未知变量的声明
	alert("页面有误，加载失败！");
	URL = '';
	FILE_URL = '';
}
TextFileExtenName = ['tpl', 'eml', 'txt', 'htaccess', 'php', 'php5',
	'json', 'xml', 'xsl', 'asp', 'html', 'htm', 'jsp', 'java', 'c', 'cpp', 'h', 'cmd', 'sh', 'm', 'cc', 'cxx', 'hxx', 'hpp', 'log', 'ini', 'cs', 'inc', 'pas', 'phtml', 'js', 'jsp', 'css', 'sh', 'bsh', 'pl', 'py', 'rc',
	'vb', 'vbs', 'as', 'asm', 'f', 'sql', 'tex', 'md', 'readme', 'srt', 'conf'];
ImageFileExtenName = ['jpg', 'jpeg', 'png', 'bmp', 'ico', 'gif', 'tif', 'tiff'];
AudioFileExtenName = ['mp3', 'ogg', 'wav'];
VideoFileExtenName = ['mp4', 'mkv', '3gp', 'mpeg', 'mpeg4', 'flv', 'f4v', 'vob', 'mpg'];
CharsetList = ['UTF-8', 'GBK', 'GB2312', 'ASCII', 'UNICODE', 'BIG5', 'UCS-2', 'UCS-2LE', 'UCS-2BE'];
LyFM.ID = '';
LyFM.update_url = "//www.loveyu.net/Update/LyFm.php";
LyFM.file_list = [];
LyFM.image_count = 0;
LyFM.video_count = 0;
LyFM.audio_count = 0;
LyFM.prototype.out_file_list = function () {
	$(LyFM.ID + " tbody").html("");
	$(LyFM.ID + " .path h3").html("当前路径：" + this.make_now_path());
	$(LyFM.ID + " .table_head tbody").append(this.make_parent_path());
	var count_list = 0;
	LyFM.image_count = 0;
	LyFM.video_count = 0;
	LyFM.audio_count = 0;
	for (var i = 0; i < LyFM.file_list['dir'].length; i++) {
		$(LyFM.ID + " .table tbody").append((this.make_dir_content(LyFM.file_list['dir'][i])));
		count_list++;
	}
	for (i = 0; i < LyFM.file_list['file'].length; i++) {
		$(LyFM.ID + " .table tbody").append((this.make_file_content(LyFM.file_list['file'][i])));
		count_list++;
	}
	if (0 == count_list) {
		$(LyFM.ID + " .table tbody").append((this.make_empty_content()));
	} else {
		this.fix_width();
	}
	load_FM_UI();
	if (LyFM.image_count > 0) {
		$(".BrowerImages").colorbox({rel: 'group1', transition: "none", width: "75%", height: "75%"});
	}
	if (LyFM.audio_count > 0) {
		$(".BrowerAudio").colorbox({rel: 'group2', transition: "none", width: "75%", height: "75%"});
	}
	if (LyFM.video_count > 0) {
		$(".BrowerVideo").colorbox({rel: 'group3', transition: "none", width: "75%", height: "75%"});
	}
};
LyFM.prototype.make_dir_content = function (elem) {
	if(!elem.owner.hasOwnProperty('name')){
		elem.owner['name'] = "未知";
	}
	if(!elem.group.hasOwnProperty('name')){
		elem.group['name'] = "未知";
	}
	return    '<tr>' +
		'<td class="ico first" ><a href="#" onClick="return load_file_list(\'' + elem['path'] + '\');" title="进入文件夹"><img src="' + FILE_URL + 'images/folder_ico.png" alt="floder"/></a></td>' +
		'<td class="file_name"><a href="#" onClick="return load_file_list(\'' + elem['path'] + '\');" title="进入文件夹">' + elem['name'] + '</a></td>' +
		'<td class="size"><p>文件：' + elem['file_number'] + '</p></p>文件夹：' + elem['dir_number'] + '</td>' +
		'<td class="quanxian"><a href="#" title="修改权限" onClick="return change_perms(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'' + elem['perms'] + '\');">' + elem['perms'] + '<br /> (修改)</a></td>' +
		'<td class="edit">' +
		'<p>' +
		'<a href="#" onClick="return zip_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'dir\');">压缩</a>' +
		'</p>' +
		'<p>' +
		'<a href="#" onClick="return rename_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\');">重命名</a>' +
		'<a href="#" onClick="return move_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'dir\');">移动</a>' +
		'<a href="#" onClick="return copy_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'dir\');">复制</a>' +
		'<a href="#" onClick="return delete_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'文件夹\');">删除</a>' +
		'</p>' +
		'</td>' +
		'<td>' + elem['d_altera'] + '</td>' +
		'<td>' + elem['d_create'] + '</td>' +
		(is_linux() ? ('<td>' + elem['owner']['name'] + ' (' + elem['owner_id'] + ')</td>' + '<td>' + elem['group']['name'] + ' (' + elem['group_id'] + ')</td>') : "") +
		'<td class="checkbox"><input name="file_list_box_check" class="dir_check_box" type="checkbox" value="' + elem['name'] + '" /></td>' +
		'</tr>';
};
LyFM.prototype.make_file_content = function (elem) {
	var is_text = is_text_ext_name(elem['exten']);
	return    '<tr>' +
		'<td class="ico first" >' +
		(is_image_ext_name(elem['exten']) ?
			'<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" class="BrowerImages" title="图片 ' + elem['name'] + '"><img src="' + FILE_URL + 'images/img_ico.png" alt="file" /></a>'
				: (is_text ?
				'<a href="#" onClick="return edit_file(\'' + elem['path'] + '\',\'' + elem['name'] + '\');" title="编辑文件"><img src="' + FILE_URL + 'images/text_ico.png" alt="file" /></a>'
					: (elem['exten'].toLowerCase() == 'zip' ?
					'<a href="#" onClick="return read_zip(\'' + elem['path'] + '\');" title="查看压缩文件内容列表"><img src="' + FILE_URL + 'images/zip_ico.png" alt="file" /></a>'
						: (is_audio_ext_name(elem['exten']) ?
						'<a href="' + URL + 'Api/get_ajax_media?type=audio&path=' + encodeURIComponent(elem['path']) + '" class="BrowerAudio" title="音频 ' + elem['name'] + '"><img src="' + FILE_URL + 'images/audio_ico.png" alt="file" /></a>'
							: (is_video_ext_name(elem['exten']) ?
								('<a href="' + URL + 'Api/get_ajax_media?type=video&path=' + encodeURIComponent(elem['path']) + '" class="BrowerVideo" title="视频 ' + elem['name'] + '"><img src="' + FILE_URL + 'images/video_ico.png" alt="file" /></a>')
								: (elem['exten'].toLowerCase() == 'pdf' ?
									('<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="打开文件"><img src="' + FILE_URL + 'images/pdf_ico.png" alt="file" /></a>')
									: ('<a href="' + URL + 'Api/file_download?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="下载文件"><img src="' + FILE_URL + 'images/file_ico.png" alt="file" /></a>')
							)
						)
					)
				)
			)
		) +
		'</td>' +
		'<td class="file_name"><a href="' + URL + 'Api/file_download?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="下载文件">' + elem['name'] + '</a></td>' +
		'<td class="size">' + elem['size'] + '<br /> (' + this.get_size(elem["size"]) + ')</td>' +
		'<td class="quanxian"><a href="#" onClick="return change_perms(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'' + elem['perms'] + '\');" title="修改权限">' + elem['perms'] + '<br /> (修改)</a></td>' +
		'<td class="edit">' +
		'<p>' +
		(is_text ? '<a href="#" onClick="return edit_file(\'' + elem['path'] + '\',\'' + elem['name'] + '\');">编辑</a>' : "" ) +
		(elem['exten'].toLowerCase() == 'zip' ? '<a href="#" onClick="return unzip(\'' + elem['path'] + '\');" >解压</a>' : "") +
		'<a href="#" onClick="return zip_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'file\');">压缩</a>' +
		(is_image_ext_name(elem['exten']) ? ('<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="新窗口打开图片">打开图片</a>') : '') +
		(is_audio_ext_name(elem['exten']) ? ('<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="新窗口打开音频">打开音频</a>') : '') +
		(is_video_ext_name(elem['exten']) ? ('<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="新窗口打开视频">打开视频</a>') : '') +
		((elem['exten'].toLowerCase() == 'pdf') ? ('<a href="' + URL + 'Api/get_media?path=' + encodeURIComponent(elem['path']) + '" target="_blank" title="打开文件">阅读PDF</a>') : "") +
		'</p>' +
		'<p>' +
		'<a href="#" onClick="return rename_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\');">重命名</a>' +
		'<a href="#" onClick="return move_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'file\');">移动</a>' +
		'<a href="#" onClick="return copy_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'file\');">复制</a>' +
		'<a href="#" onClick="return delete_one(\'' + elem['path'] + '\',\'' + elem['name'] + '\',\'文件\');">删除</a>' +
		'</p>' +
		'</td>' +
		'<td>' + elem['d_altera'] + '</td>' +
		'<td>' + elem['d_create'] + '</td>' + elem['d_create'] + '</td>' +
		(is_linux() ? ('<td>' + elem['owner']['name'] + ' (' + elem['owner_id'] + ')</td><td>' + elem['group']['name'] + ' (' + elem['group_id'] + ')</td>') : "") +
		'<td class="checkbox"><input name="file_list_box_check" class="file_check_box" type="checkbox" value="' + elem['name'] + '" /></td>' +
		'</tr>';
};
LyFM.prototype.make_parent_path = function () {
	return    '<tr>' +
		'<td class="ico first" ><a href="#" onClick="return load_file_list(\'' + LyFM.file_list['parent'] + '\');" title="进入文件夹"><img src="' + FILE_URL + 'images/folder_ico.png" alt="floder"/></a></td>' +
		'<td colspan="' + (is_linux() ? '9' : '7') + '" class="parent"><a href="#" onClick="return load_file_list(\'' + LyFM.file_list['parent'] + '\');" >上级目录：<span>' + ((LyFM.file_list['path'] == LyFM.file_list['parent']) ? "已是最顶层" : LyFM.file_list['parent']) + '</span></a></td>' +
		'</tr>';
};
LyFM.prototype.make_empty_content = function () {
	if (!LyFM.file_list['exists']) {
		return '<tr><td class="empty no_found">该目录不存在。</td></tr>';
	}
	if (!LyFM.file_list['is_read']) {
		return '<tr><td class="empty no_found">没有读取权限。</td></tr>';
	}
	if (LyFM.file_list['exists']) {
		return '<tr><td class="empty">该目录为空。</td></tr>';
	}
	return null;
};
LyFM.prototype.fix_width = function () {
	var a = [];
	$(LyFM.ID + " .table tbody tr :first td").each(function (index, element) {
		a[index] = $(element).width();
	});
	$(LyFM.ID + " .table_head thead tr :first td").each(function (index, element) {
		if (index != a.length - 1)
			$(element).width(a[index]);
	});
};
LyFM.prototype.reSizeSidebar = function () {
	var width = $(window).width() - $("#file_action").width();
	if (width != $("#file_list").width()) {
		$("#file_list").width(width);
	}
	setTimeout("LyFM.prototype.reSizeSidebar()", 1000);
};
LyFM.prototype.show_rename_box = function (path, name) {
	var html = '';
	html = '<div id="rename_box"><form action="' + URL + 'Api/rename">' +
		'<p>当前路径：<strong>' + path + '</strong></p>' +
		'<p>旧名称：<strong>' + name + '</strong></p>' +
		'<label>新名称：<input name="name" value="' + name + '" type="text" /></label>' +
		'<input name="path" value="' + path + '" type="hidden" />' +
		'<button type="submit">确定修改</button>' +
		'</form></div>';
	this.app_box('重命名', html);
	$("#rename_box input[name=\"name\"]").focus();
	$("#rename_box form").submit(function () {
		var s_path = $("#rename_box input[name=\"path\"]").val();
		var s_name = $("#rename_box input[name=\"name\"]").val();
		if (s_name == name) {
			alert('未修改，名称未变化');
			return false;
		}
		if (s_name == "") {
			alert("不能为空");
			return false;
		}
		if (s_name.indexOf('/') >= 0 || s_name.indexOf('\\') >= 0) {
			alert('存在非法斜杠');
			return false;
		}
		$.getJSON(URL + "Api/rename", {path: s_path, name: s_name}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.app_box_close();
				LyFM.prototype.get_file_list(NOW_PATH);
			} else {
				alert('改名失败');
			}
		});
		return false;
	});
};
LyFM.prototype.show_delete_box = function (path, name, type) {
	var html = '';
	html = '<div id="delete_box"><form action="' + URL + 'Api/delete">' +
		'<p>当前' + type + '路径：<strong>' + path + '</strong></p>' +
		'<p>' + type + '名称：<strong>' + name + '</strong></p>' +
		'<input name="path" value="' + path + '" type="hidden" />' +
		'<button type="submit">确定删除' + type + '?</button>' +
		'</form></div>';
	this.app_box(type + ' 删除', html);
	$("#delete_box form").submit(function () {
		$.getJSON(URL + "Api/delete", {path: path}, function (data) {
			LyFM.prototype.get_file_list(NOW_PATH);
			var tmp = '';
			for (var i = 0; i < data['list'].length; i++) {
				tmp += "<li>" + (data['list'][i]['status'] ? '<p class="true">成功</p>' : '<p class="false">失败</p>') + "<p>" + data['list'][i]['path'] + "</p></li>"
			}
			LyFM.prototype.app_box_close();
			LyFM.prototype.app_box(name + " " + type + " 删除状态", '<ul id="delete_box" style="max-height:500px;overflow:auto;">' + tmp + "</ul>");
			if (false == data['status']) {
				alert('删除失败: ' + data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_delete_more_box = function () {
	this.app_box_close();
	var n = 0;
	var list = [];
	$("input[name=\"file_list_box_check\"]").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			list[n++] = $(element).val();
		}
	});
	if (n > 0) {
		this.app_box('你确定删除？', '<div>' +
			'<p>你确定删除你选中的 ' + n + ' 个文件或文件夹?</p>' +
			'<p style="color:red;">提示：递归过程中出现权限文件将无法详细显示</p>' +
			'<div id="Delete_More_List"></div><button type="submit" id="Delete_More">确定删除</button></div>');
		$("#Delete_More").click(function () {
			$(this).remove();
			LyFM.prototype.app_box_title("批量文件删除状态");
			for (var i in list) {
				$.getJSON(URL + "Api/delete", {path: NOW_PATH + '/' + list[i]}, function (data) {
					if (true == data['status']) {
						$("#Delete_More_List").append('<p style="color:black;">' + list[i] + ' 已删除</p>');
					} else {
						$("#Delete_More_List").append('<p style="color:red;">' + list[i] + ' 删除失败</p>');
					}
					if (i == (n - 1)) {
						LyFM.prototype.get_file_list(NOW_PATH);
					}
				});
			}
		});
	} else {
		alert('没有选中任何项目');
	}
};
LyFM.prototype.char_set_change_more = function () {
	var f_list = [];
	var f_n = 0;
	$("input[name=\"file_list_box_check\"].file_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			f_list[f_n++] = $(element).val();
		}
	});
	if (f_n == 1) {
		var name = NOW_PATH + "/" + f_list[0];
		var arr = CharsetList;
		var option = '';
		for (var i in arr) {
			option += '<option>' + arr[i] + '</option>';
		}
		tmp = '<div id="CHAR_CHANGE"><form>' +
			'<p>当前文件路径:' + name + '</p>' +
			'<p style="color:red;">如果是非文本文件，将导致文件不可用，原始编码错误将导致文件乱码。</p>' +
			'<p>将 <select name="old">' + option + '</select> 转换为 <select name="new">' + option + '</select>' +
			'<button type="submit">开始转换</button>' +
			'</form></div>';
		this.app_box("文件编码转换", tmp);
		$("#CHAR_CHANGE form").submit(function () {
			var old_char = $("#CHAR_CHANGE form select[name=\"old\"]").val();
			var new_char = $("#CHAR_CHANGE form select[name=\"new\"]").val();
			if (old_char == new_char) {
				alert('相同编码转换无意义');
				return false;
			}
			$.getJSON(URL + 'Api/change_charset', {path: name, old_char: old_char, new_char: new_char}, function (data) {
				if (data['status']) {
					LyFM.prototype.app_box_content('转换完成，但转换状态不一定成功');
					LyFM.prototype.get_file_list(NOW_PATH);
				} else {
					alert(data['error']);
				}
			});
			return false;
		});
	} else {
		alert('仅且只能选择一个文件，文件夹无效');
	}
};
LyFM.prototype.email_more = function () {
	var f_list = [];
	var f_n = 0;
	$("input[name=\"file_list_box_check\"].file_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			f_list[f_n++] = $(element).val();
		}
	});
	if (f_n > 0) {
		var tmp = '<div id="MailBox"><form onSubmit="return false;">' +
			'<p>当前共选中 <span style="color:red;">' + f_n + '</span> 个文件</p>' +
			'<p>邮件地址:<input type="text" value="" name="email" /></p>' +
			'<p>发送方式:<select name="method"><option>mail</option><option>smtp</option></select>(smtp需先配置)</p>' +
			'<p>附加内容:<textarea name="more"></textarea></p>' +
			'<button type="submit">发送邮件</button>' +
			'</form></div>';
		this.app_box("邮件发送附件", tmp);
		$("#MailBox form").submit(function () {
			var email = $("#MailBox form input[name=\"email\"]").val();
			if (email == "" || email != email.match(/[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)) {
				alert("邮件有误");
				return false;
			}
			var method = $("#MailBox form select[name=\"method\"]").val();
			var more = $("#MailBox form textarea[name=\"more\"]").val();
			LyFM.prototype.app_box_title('等待发送状态，可以关闭窗口');
			$.post(URL + 'Api/mail_file', {path: NOW_PATH, list: f_list, email: email, method: method, more: more}, function (data) {
				if (data['status']) {
					alert('邮件发送成功');
				} else {
					alert('邮件发送失败：' + data['error']);
					if (data['data'] != '') {
						LyFM.prototype.app_box_close();
						LyFM.prototype.app_box("邮箱发送状态", "<div>" + data['data'] + "</div>");
					}
				}
			});
			return false;
		});
	} else {
		alert('至少选择一个文件');
	}
};
LyFM.prototype.show_choice_dirve = function () {
	$.getJSON(URL + 'Api/window_dirve', function (data) {
		if (data['status']) {
			var tmp = '<div>';
			for (var itmp in data['list']) {
				tmp += ('<a href="#" onClick="return load_file_list(\'' + data['list'][itmp] + '\');">' + data['list'][itmp] + '</a>&nbsp;&nbsp;&nbsp;&nbsp;');
			}
			tmp += '</div>';
			LyFM.prototype.app_box('选择一个磁盘打开', tmp);
		} else {
			alert(data['error']);
		}
	});
};
LyFM.prototype.show_move_file = function (path, name, type) {
	var tmp = '<div id="Move_File"><form action="' + URL + 'Api/move_file">' +
		'<p>当前' + type + '路径：<strong>' + path + '</strong></p>' +
		'<p>所在目录：<strong>' + dirname(path) + '</strong></p>' +
		'<input type="hidden" name="path" value="' + path + '" />' +
		'<label>新目录：<input type="text" name="new_path" value="' + dirname(path) + '" /></label>' +
		'<button type="submit">移动' + type + '</button>' +
		'</form></div>';
	this.app_box('移动' + type, tmp);
	$("#Move_File form input[name=\"new_path\"]").focus();
	$("#Move_File form").submit(function () {
		var new_path = $("#Move_File form input[name=\"new_path\"]").val();
		if (new_path == dirname(path)) {
			alert('目录未改变,请修改');
			return false;
		}
		$.getJSON(URL + "Api/move_file", {path: path, new_path: new_path, type: (type == "文件" ? "file" : "dir")}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				LyFM.prototype.show_move_succ_box(new_path);
			} else {
				alert(type + '移动失败：' + data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_move_more_box = function () {
	this.app_box_close();
	var f_n = 0;
	var d_n = 0;
	var f_list = [];
	var d_list = [];
	$("input[name=\"file_list_box_check\"].file_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			f_list[f_n++] = $(element).val();
		}
	});
	$("input[name=\"file_list_box_check\"].dir_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			d_list[d_n++] = $(element).val();
		}
	});
	var count = f_n + d_n;
	if (count > 0) {
		var tmp = '<div id="MOVE_File"><form>' +
			'<p>共选中<span style="color:red;">' + f_n + '</span> 个文件与 <span style="color:red;">' + d_n + '</span> 个文件夹</p>' +
			'<p>当前目录：<strong>' + NOW_PATH + '</strong></p>' +
			'<label>新目录：<input type="text" name="new_path" value="' + NOW_PATH + '" /></label>' +
			'<button type="submit">移动选中项</button>' +
			'</form></div>';
		this.app_box('你确定移动所选择的内容？', tmp);
		$("#MOVE_File form input[name=\"new_path\"]").focus();
		$("#MOVE_File form").submit(function () {
			var new_path = $("#MOVE_File form input[name=\"new_path\"]").val();
			if (new_path == NOW_PATH) {
				alert('目录未改变,请修改');
				return false;
			}
			for (var i in f_list) {
				$.getJSON(URL + "Api/move_file", {path: NOW_PATH + '/' + f_list[i], new_path: new_path, type: 'file'}, function (data) {
					if (false == data['status']) {
						alert('移动 ' + f_list[i] + ' 失败：' + data['error']);
					}
					if ((--count) == 0) {
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			for (var i in d_list) {
				$.getJSON(URL + "Api/move_file", {path: NOW_PATH + '/' + d_list[i], new_path: new_path, type: 'dir'}, function (data) {
					if (false == data['status']) {
						alert('移动 ' + d_list[i] + ' 失败：' + data['error']);
					}
					if ((--count) == 0) {
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_move_succ_box(new_path);
					}
				});
			}
			return false;
		});
	} else {
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_zip_one = function (path, name, type) {
	var type_name = (type == 'file' ? "文件" : "文件夹");
	var tmp = '<div id="ZIP_FILE"><form onSubmit="return false;">' +
		'<p>' + type_name + '路径：<strong>' + path + '</strong></p>' +
		'<p><label>压缩包路径：<input name="zip_path" type="text" value="' + dirname(path) + '" /></label></p>' +
		'<p><label>ZIP文件名：<input class="short" name="zip_name" type="text" value="' + (type == 'file' ? remove_ext(name) : name) + '" />.zip</label></p>' +
		'<p><button type="submit">压缩</button></p>' +
		'<input name="path" type="hidden" value="' + path + '" />' +
		'</form></div>';
	this.app_box('压缩' + type_name, tmp);
	$("#ZIP_FILE form input[name=\"zip_name\"]").focus();
	$("#ZIP_FILE form").submit(function () {
		var zip_path = $("#ZIP_FILE form input[name=\"zip_path\"]").val();
		var zip_name = $("#ZIP_FILE form input[name=\"zip_name\"]").val();
		if (zip_path == "" || zip_name == "") {
			alert("不允许存在空值");
			return false;
		}
		LyFM.prototype.app_box_title('压缩中 loading...');
		$.getJSON(URL + "Api/zip_file", {path: path, zip_path: zip_path + '/' + zip_name}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				var list = '<ul>';
				for (var i = 0; i < data['list'].length; i++) {
					list += '<li>' + data['list'][i]['path'] + '</li>';
				}
				list += '</ul>';
				tmp = '<div id="ZIP_FILE">' +
					'<p>耗时:' + data['time'] + '</p>' +
					'<p>文件列表:' + i + ' 个</p>' +
					list +
					'</div>';
				LyFM.prototype.app_box(type_name + " 压缩状态", tmp);
			} else {
				alert(type_name + '压缩失败：' + data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_zip_more = function () {
	var n = 0;
	var list = [];
	$("input[name=\"file_list_box_check\"]").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			list[n++] = $(element).val();
		}
	});
	if (n > 0) {
		this.app_box('你确定压缩这些文件？',
			'<div id="ZIP_More"><form><p>你确定压缩你选中的 ' + n + ' 个文件或文件夹?</p>' +
			'<p>当前路径：' + NOW_PATH + '</p>' +
			'<p><label>ZIP文件名:<input name="zip" class="short" value="" type="text" />.zip</label></p>' +
			'<button type="submit">确定压缩</button></form></div>');
		$("#ZIP_More form").submit(function () {
			LyFM.prototype.app_box_title("压缩中....");
			$("#ZIP_More input[name=\"zip\"]").focus();
			var zip_name = $("#ZIP_More input[name=\"zip\"]").val();
			$.post(URL + "Api/zip_more", {path: NOW_PATH, list: list, zip_name: zip_name}, function (data) {
				if (true == data['status']) {
					LyFM.prototype.get_file_list(NOW_PATH);
					LyFM.prototype.app_box_close();
					list = '<ul>';
					for (var i = 0; i < data['list'].length; i++) {
						list += '<li>' + data['list'][i]['path'] + '</li>';
					}
					list += '</ul>';
					var tmp = '<div id="ZIP_FILE">' +
						'<p>耗时:' + data['time'] + '</p>' +
						'<p>文件列表:' + i + ' 个</p>' +
						list +
						'</div>';
					LyFM.prototype.app_box("压缩状态", tmp);
				} else {
					alert('压缩失败：' + data['error']);
				}
			});
			return false;
		});
	} else {
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_unzip = function (path) {
	var tmp = '<div id="UNZIP_FILE"><form onSubmit="return false;">' +
		'<p style="color:red;">如有相同文件名或路径将被覆盖！</p>' +
		'<p>压缩包路径：<strong>' + path + '</strong></p>' +
		'<p><label>解压路径：<input name="unzip_path" type="text" value="' + NOW_PATH + '" /></label></p>' +
		'<p><button type="submit">解压缩</button></p>' +
		'<input name="path" type="hidden" value="' + path + '" />' +
		'</form></div>';
	this.app_box('文件解压缩压缩', tmp);
	$("#UNZIP_FILE form input[name=\"unzip_path\"]").focus();
	$("#UNZIP_FILE form").submit(function () {
		var unzip_path = $("#UNZIP_FILE form input[name=\"unzip_path\"]").val();
		if (unzip_path == "") {
			alert("不允许空值");
			return false;
		}
		LyFM.prototype.app_box_title('正在解压 loading...');
		$.getJSON(URL + "Api/unzip_file", {path: path, unzip_path: unzip_path}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				alert('解压耗时 ' + data['time'] + ' ！');
			} else {
				alert('解压压缩失败：' + data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_change_perms = function (path, name, perms) {
	var tmp = '<div id="Change_Perms"><form onSubmit="return false;">' +
		'<p>当前路径:<span style="color:#111;display:inline;">' + path + '</span></p>' +
		'<p style="color:#F22;">提示：如需递归修改，请使用边栏工具</p>' +
		'<p><label>修改权限为:<input class="short" name="new" value="' + perms + '" type="text" /></label></p>' +
		'<p><button type="submit">修改</button></p>' +
		'<input name="path" value="' + path + '" type="hidden" />' +
		'</form></div>';
	this.app_box('修改权限', tmp);
	$("#Change_Perms form input[name=\"new\"]").focus();
	$("#Change_Perms form").submit(function () {
		var new_perms = $("#Change_Perms form input[name=\"new\"]").val();
		if (new_perms == "") {
			alert("不允许空值");
			return false;
		}
		LyFM.prototype.app_box_title('正在修改权限 loading...');
		$.getJSON(URL + "Api/change_perms", {path: path, new_perms: new_perms}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_content('<p>成功修改权限，具体值可能有区别！</p>');
			} else {
				alert(data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_chmod_more = function () {
	this.app_box_close();
	var n = 0;
	var list = [];
	$("input[name=\"file_list_box_check\"]").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			list[n++] = $(element).val();
		}
	});
	if (n > 0) {
		this.app_box('你确定修改权限？',
			'<div id="CHMODE_More"><form><p>你确定修改你选中的 ' + n + ' 个文件或文件夹的权限?</p>' +
			'<p><label>文件夹权限:<input name="dir_chmod" class="short" value="' + (is_linux() ? "0755" : "0777") + '" type="text" /></label></p>' +
			'<p><label>文件权限:<input name="file_chmod" class="short" value="' + (is_linux() ? "0644" : "0666") + '" type="text" /></label></p>' +
			'<p><label>文件夹权限递归 <input type="checkbox" name="recursion" value="true" /></label></p>' +
			'<button type="submit">确定修改</button></form></div>');
		$("#CHMODE_More button[type=\"submit\"]").click(function () {
			LyFM.prototype.app_box_title("批量文件权限修改状态");
			$("#CHMODE_More input[name=\"dir_mode\"]").focus();
			var file_mode = $("#CHMODE_More input[name=\"file_chmod\"]").val();
			var dir_mode = $("#CHMODE_More input[name=\"dir_chmod\"]").val();
			var recursion = $("#CHMODE_More input[name=\"recursion\"]").attr("checked");
			if (recursion == true || recursion == "checked") {
				recursion = "true";
			} else {
				recursion = "false";
			}
			$.post(URL + "Api/chmod_more", {path: NOW_PATH, list: list, file_mode: file_mode, dir_mode: dir_mode, r: recursion}, function (data) {
				if (true == data['status']) {
					LyFM.prototype.app_box_content("<div>权限修改成功</div>");
				} else {
					alert('修改权限失败：' + data['error']);
				}
				LyFM.prototype.get_file_list(NOW_PATH);
			});
			return false;
		});
	} else {
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_read_zip = function (path) {
	$.getJSON(URL + "Api/read_zip_file", {path: path}, function (data) {
		if (true == data['status']) {
			if (data['list'].length <= 0) {
				alert('ZIP文件内容为空');
				return false;
			}
			var tmp = '<ul>';
			for (var i in data['list']) {
				tmp += '<li><span style="color: #000;display: inline;">&gt;&gt;</span>' + data['list'][i] + '</li>';
			}
			tmp += '</ul>';
			LyFM.prototype.app_box('查看压缩文件列表', '<div><p style="margin:2px;color:red;"><span>文件路径:</span>' + path + '</p><p>内容列表：(' + data['list'].length + '个列表)</p>' + tmp + '</div>');
		} else {
			alert('ZIP文件读取失败：' + data['error']);
		}
	});
	return false;
};
LyFM.prototype.show_copy_file = function (path, name, type) {
	var tmp = '<div id="Copy_File"><form action="' + URL + 'Api/copy_file">' +
		'<p>当前' + type + '路径：<strong>' + path + '</strong></p>' +
		'<p>所在目录：<strong>' + dirname(path) + '</strong></p>' +
		'<input type="hidden" name="path" value="' + path + '" />' +
		'<label>新目录：<input type="text" name="new_path" value="' + dirname(path) + '" /></label>' +
		'<button type="submit">复制' + type + '</button>' +
		'</form></div>';
	this.app_box('复制' + type, tmp);
	$("#Copy_File form input[name=\"new_path\"]").focus();
	$("#Copy_File form").submit(function () {
		var new_path = $("#Copy_File form input[name=\"new_path\"]").val();
		if (new_path == dirname(path)) {
			alert('目录未改变,请修改');
			return false;
		}
		$.getJSON(URL + "Api/copy_file", {path: path, new_path: new_path, type: (type == "文件" ? "file" : "dir")}, function (data) {
			if (true == data['status']) {
				LyFM.prototype.app_box_close();
				LyFM.prototype.show_copy_succ_box(new_path);
			} else {
				alert(type + '复制失败：' + data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_copy_more_box = function () {
	this.app_box_close();
	var f_n = 0;
	var d_n = 0;
	var f_list = [];
	var d_list = [];
	$("input[name=\"file_list_box_check\"].file_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			f_list[f_n++] = $(element).val();
		}
	});
	$("input[name=\"file_list_box_check\"].dir_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			d_list[d_n++] = $(element).val();
		}
	});
	var count = f_n + d_n;
	if (count > 0) {
		var tmp = '<div id="Copy_File"><form>' +
			'<p>共选中<span style="color:red;">' + f_n + '</span> 个文件与 <span style="color:red;">' + d_n + '</span> 个文件夹</p>' +
			'<p>当前目录：<strong>' + NOW_PATH + '</strong></p>' +
			'<label>新目录：<input type="text" name="new_path" value="' + NOW_PATH + '" /></label>' +
			'<button type="submit">复制选中项</button>' +
			'</form></div>';
		this.app_box('你确定复制所选择的内容？', tmp);
		$("#Copy_File form input[name=\"new_path\"]").focus();
		$("#Copy_File form").submit(function () {
			var new_path = $("#Copy_File form input[name=\"new_path\"]").val();
			if (new_path == NOW_PATH) {
				alert('目录未改变,请修改');
				return false;
			}
			for (var i in f_list) {
				$.getJSON(URL + "Api/copy_file", {path: NOW_PATH + '/' + f_list[i], new_path: new_path, type: 'file'}, function (data) {
					if (false == data['status']) {
						alert('复制 ' + f_list[i] + ' 失败：' + data['error']);
					}
					if ((--count) == 0) {
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			for (var i in d_list) {
				$.getJSON(URL + "Api/copy_file", {path: NOW_PATH + '/' + d_list[i], new_path: new_path, type: 'dir'}, function (data) {
					if (false == data['status']) {
						alert('复制 ' + d_list[i] + ' 失败：' + data['error']);
					}
					if ((--count) == 0) {
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			return false;
		});
	} else {
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_move_succ_box = function (path) {
	LyFM.prototype.app_box("移动成功，是否打开该目录?",
		"<div id=\"Movie_File\">" +
		"<p>已移动到：" + path + "</p>" +
		"<button onclick=\"load_file_list('" + path + "');LyFM.prototype.app_box_close();\">打开该目录</button>" +
		"</div>");
};
LyFM.prototype.show_copy_succ_box = function (path) {
	LyFM.prototype.app_box("复制成功，是否打开该目录?",
		"<div id=\"Movie_File\">" +
		"<p>已复制到：" + path + "</p>" +
		"<button onclick=\"load_file_list('" + path + "');LyFM.prototype.app_box_close();\">打开该目录</button>" +
		"</div>");
};
LyFM.prototype.app_box = function (title, html, width) {
	this.app_box_close();
	var content = '<div id="LyFM_BOX">' +
		'<div class="title"><h3>' + title + '</h3></div><button class="close" onClick="LyFM.prototype.app_box_close()">关闭</button>' +
		'<div class="content">' + html + '</div>' +
		'</div>';
	$("body").append(content);
	$("#LyFM_BOX").css("width", width);
	this.app_box_size();
	this.app_box_move();
	$(window).resize(this.app_box_size);
};
LyFM.prototype.app_box_close = function () {
	$("#LyFM_BOX").remove();
};
LyFM.prototype.app_box_title = function (title) {
	$("#LyFM_BOX .title h3").html(title);
};
LyFM.prototype.app_box_size = function () {
	$("#LyFM_BOX .title h3").width($("#LyFM_BOX .title").width() - $("#LyFM_BOX .title button").width() * 3);
	$("#LyFM_BOX").css("top", (($(window).height() - $("#LyFM_BOX").height()) / 2.7) + 'px');
	$("#LyFM_BOX").css("left", (($(window).width() - $("#LyFM_BOX").width()) / 2.7) + 'px');
};
LyFM.prototype.app_box_content = function (content) {
	$("#LyFM_BOX div.content :first").html(content);
};
LyFM.prototype.app_box_move = function () {
	var bool = false;
	var offsetX = 0;
	var offsetY = 0;
	$("#LyFM_BOX .title").mouseleave(function () {
		bool = false;
	});
	$("#LyFM_BOX .title").mousedown(function () {
		bool = true;
		offsetX = event.offsetX;
		offsetY = event.offsetY;
	}).mouseup(function () {
		bool = false;
	});
	$(document).bind('mousemove', function (e) {
		if (!bool) {
			return;
		}
		var x = event.clientX - offsetX; //event.clientX  获取鼠标的水平位置
		var y = event.clientY - offsetY;
		var max_x = $(window).width() - $("#LyFM_BOX").width() - 15;
		var max_y = $(window).height() - $("#LyFM_BOX").height() - 4;
		if (x > max_x)x = max_x;
		if (y > max_y)y = max_y;
		if (x < 0)x = 0;
		if (y < 0)y = 0;
		$("#LyFM_BOX").css("left", x + "px");
		$("#LyFM_BOX").css("top", y + "px");
	});
};
LyFM.prototype.make_now_path = function () {
	var path = LyFM.file_list['path'];
	if (path.substr(-1) == '/') {
		path = path.substr(0, path.length - 1);
	}
	var array = path.split('/');
	var rt = '';
	for (var i = 0; i < array.length; i++) {
		if (array[i] != '' && array[i] != '/') {
			if (i != (array.length - 1)) {
				var tmp = '';
				for (var j = 0; j <= i; j++) {
					tmp += (array[j] + '/');
				}
				rt += '<a href="#" onclick="return load_file_list(\'' + tmp + '\')">' + array[i] + '</a>/';
			} else {
				rt += '<a href="#" onclick="return false;">' + array[i] + '</a>';
			}
		}
	}
	if (is_linux()) {
		rt = '<a href="#" onclick="return load_file_list(\'/\')">/</a>' + rt;
	}
	return rt;
};
LyFM.prototype.show_web_download = function () {
	var tmp = '<div id="WEB_Download"><form>' +
		'<p>当前目录:<span>' + NOW_PATH + '</span></p>' +
		'<p><label>下载地址:<input name="url" type="text" value="" /></label></p>' +
		'<p><label>保存文件名(留空默认)：<input class="short" name="name" type="text" value="" /></label></p>' +
		'<p><button type="submit">下载</button></p>' +
		'</form></div>';
	this.app_box('下载远程文件', tmp);
	$("#WEB_Download form input[name=\"url\"]").focus();
	$("#WEB_Download form").submit(function () {
		var url = $("#WEB_Download form input[name=\"url\"]").val();
		var name = $("#WEB_Download form input[name=\"name\"]").val();
		if (!url.match(/[a-zA-z]+:\/\/[^.\s][^\s]*/)) {
			alert('网址匹配出错');
			return false;
		}
		LyFM.prototype.app_box_title("<span style=\"color:red;\">文件下载中 （关闭该窗口无影响,会提示状态）...</span>");
		$.getJSON(URL + 'Api/url_download', {path: NOW_PATH, url: url, name: name}, function (data) {
			var tmp_path = NOW_PATH;
			if (!data['status']) {
				LyFM.prototype.app_box_title("<span style=\"color:red;\">文件下载出现错误</span>");
				alert('下载出错:' + data['error']);
			} else {
				alert('下载成功\n' + data['name'] + ' (' + LyFM.prototype.get_size(data['size']) + ') \n下载耗时' + data['time']);
				LyFM.prototype.app_box_title("<span style=\"color:red;\">下载成功</span>");
				LyFM.prototype.app_box_content('<div><p>地址：' + url + '</p><p>下载文件名：' + data['name'] + ' ' + LyFM.prototype.get_size(data['size']) + ' </p><p>下载耗时：' + data['time'] + '</p></div>');
				LyFM.prototype.get_file_list(tmp_path);
			}
		});
		return false;
	});
};
LyFM.prototype.get_file_list = function (request_path) {
	$.getJSON(URL + "Api/file_list", {path: request_path,order:_ORDER.order, by:_ORDER.by}, function (data) {
		LyFM.file_list = data;
		LyFM.prototype.out_file_list();
		NOW_PATH = request_path;
		LyFM.set_path(NOW_PATH);
		$('#GO_TO_PATH').val(NOW_PATH);
	});
	load_FM_UI();
};
LyFM.prototype.mkdir = function (path, name) {
	if (name == "" || name == "/" || name == "\\") {
		alert("不能为空或斜杠");
		return false;
	}
	$.getJSON(URL + "Api/mkdir", {path: path, name: name}, function (data) {
		if (data['status']) {
			refresh_file();
			$("#make_dir input[name=\"name\"]").val("");
		} else {
			alert(data['error']);
		}
	});
};
LyFM.prototype.mkfile = function (path, name, charset) {
	if (name == "") {
		alert("不能为空");
		return false;
	}
	if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
		alert('存在非法斜杠');
		return false;
	}
	if (!is_char_set(charset)) {
		alert('未知编码');
		return false;
	}
	$.getJSON(URL + "Api/mk_file", {path: path, name: name}, function (data) {
		if (data['status']) {
			refresh_file();
			LyEdit.open_new(path + "/" + name, name, charset);
			$("#make_file input[name=\"name\"]").val("");
		} else {
			alert(data['error']);
		}
	});
}
LyFM.set_path = function (path) {
	NOW_PATH = path;
	$.cookie("LYEDIT_NOW_PATH", path);
};
LyFM.get_path = function () {
	var cookie_path = $.cookie("LYEDIT_NOW_PATH");
	if (cookie_path != '' && cookie_path != null) {
		return cookie_path;
	}
	return ROOT;
};
LyFM.prototype.get_size = function (size) {
	var a = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	var pos = 0;
	if (size < 0)return '出错';
	while (size > 1024) {
		size /= 1024;
		pos++;
	}
	return (Math.round(size * 100) / 100) + a[pos];
};
LyFM.prototype.check_update = function () {
	var local_data = window.localStorage.getItem("LyPHPFMUpdateInfo");
	if (local_data == null || local_data == "null" || local_data == "") {
		$.getJSON(LyFM.update_url + '?version=' + VERSION + '&jsoncallback=?', function (data) {
			LyFM.prototype.set_update_value(data);
			localStorage.setItem("LyPHPFMUpdateInfo", JSON.stringify(data));
		});
	} else {
		var json_data = JSON.parse(local_data);
		var timestamp = new Date().getTime();
		var exp_time = (timestamp / 1000 - 24 * 60 * 60);
		if (json_data['request_time'] < exp_time) {
			this.check_up_now();
		}
		this.set_update_value(json_data);
	}
};
LyFM.prototype.check_up_now = function () {
	window.localStorage.setItem("LyPHPFMUpdateInfo", "");
	this.check_update();
};
LyFM.prototype.set_update_value = function (data) {
	$("#feedback_url").attr("href", remove_html(data['feedback_url']));
	$("#file_action .new_version").remove();
	if (VERSION < data['top_version']) {
		$("#feedback_url").after("<a class=\"new_version\" target=\"_blank\" href=\"" + remove_html(data['top_download']) + "\">下载 " + remove_html(data['top_version']) + "</a>");
	} else {
		$("#file_action .bug ul").append("<li>当前为最新版本</li>");
	}
	$("#file_action .bug ul").html("");
	for (i in data['bug_list']) {
		$("#file_action .bug ul").append("<li><a style=\"color:red;\" href=\"" + remove_html(data['bug_list'][i]['url']) + "\" target=\"_blank\">" + remove_html(data['bug_list'][i]['title']) + "</a></li>");
	}
	for (i in data['update_list']) {
		$("#file_action .bug ul").append("<li><a href=\"" + remove_html(data['update_list'][i]['url']) + "\" target=\"_blank\">" + remove_html(data['update_list'][i]['title']) + "</a></li>");
	}
};
Date.prototype.format = function (format) {
	/*
	 * eg:format="yyyy-MM-dd hh:mm:ss";
	 */
	if (!format) {
		format = "yyyy-MM-dd hh:mm:ss";
	}
	var o = {
		"M+": this.getMonth() + 1, // month
		"d+": this.getDate(), // day
		"h+": this.getHours(), // hour
		"m+": this.getMinutes(), // minute
		"s+": this.getSeconds(), // second
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
		"S": this.getMilliseconds()
		// millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
function remove_html(content) {
	return content.replace(/</, "&lt;").replace(/>/, "&gt;");
}
function dirname(path) {
	return path.match(/^.+[\\\\\\/]/);
}
function remove_ext(path) {
	return path.replace(/\.[^\.]+$/, "");
}
function is_text_ext_name(exten) {
	exten = exten.toLowerCase();
	for (var i = 0; i < TextFileExtenName.length; i++) {
		if (TextFileExtenName[i] == exten) {
			return true;
		}
	}
	return false;
}
function is_image_ext_name(exten) {
	exten = exten.toLowerCase();
	for (var i = 0; i < ImageFileExtenName.length; i++) {
		if (ImageFileExtenName[i] == exten) {
			++LyFM.image_count;
			return true;
		}
	}
	return false;
}
function is_char_set(char) {
	var i;
	for (i = 0; i < CharsetList.length; i++) {
		if (CharsetList[i] == char) {
			return true;
		}
	}
	return false;
}
function is_audio_ext_name(exten) {
	exten = exten.toLowerCase();
	for (var i = 0; i < AudioFileExtenName.length; i++) {
		if (AudioFileExtenName[i] == exten) {
			++LyFM.audio_count;
			return true;
		}
	}
	return false;
}
function is_video_ext_name(exten) {
	exten = exten.toLowerCase();
	for (var i = 0; i < VideoFileExtenName.length; i++) {
		if (VideoFileExtenName[i] == exten) {
			++LyFM.video_count;
			return true;
		}
	}
	return false;
}
function is_linux() {
	return (LyFM.file_list['os'].toLowerCase() == 'linux');
}
jQuery.cookie = function (name, value, options) {
	if (typeof value != 'undefined') {
		options = options || {};
		if (value === null) {
			value = '';
			options = $.extend({}, options);
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		return null;
	} else {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
/*
 LyFM
 Copyright (c) 2013 loveyu
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var fm = new LyFM("#file_list");
var edit = null;
var upload = null;
var run_code_box = null;
$(document).ready(function () {
	if ("undefined" == typeof ROOT)return;
	load_FM_UI();
	$(window).resize(load_FM_UI);
	$(window).resize(fm.fix_width);
	load_file_list(LyFM.get_path());
	add_func_event();
	check_update();
});
function check_update() {
	fm.check_update();
}
function check_up_now() {
	fm.check_up_now();
}
function edit_file(path, name) {
	if (edit == null)edit = new LyEdit();
	edit.add(path, name);
	return false;
}
function file_upload() {
	if (upload == null) {
		upload = new LyUpload();
	}
	upload.open_box();
}
function email_more() {
	fm.email_more();
	return false;
}
function run_code() {
	if (run_code_box == null) {
		run_code_box = new LyCode();
	}
	run_code_box.open_box();
}
function add_func_event() {
	$("#make_dir").submit(make_dir);
	$("#make_file").submit(make_file);
}
function char_set_change_more() {
	fm.char_set_change_more();
	return false;
}
function make_dir() {
	fm.mkdir(NOW_PATH, $("#make_dir input[name=\"name\"]").val());
	return false;
}
function make_file() {
	fm.mkfile(NOW_PATH, $("#make_file input[name=\"name\"]").val(), $("#make_file select[name=\"char_set\"]").val());
	return false;
}
function refresh_file() {
	load_file_list(NOW_PATH);
	return false;
}
function web_download() {
	fm.show_web_download();
}
function move_one(path, name, type) {
	if (type == 'file') {
		fm.show_move_file(path, name, "文件");
	} else if (type == 'dir') {
		fm.show_move_file(path, name, "文件夹");
	} else {
		alert("类型有误！");
	}
	return false;
}
function choice_drive() {
	fm.show_choice_dirve();
	return false;
}
function zip_one(path, name, type) {
	fm.show_zip_one(path, name, type);
	return false;
}
function zip_more() {
	fm.show_zip_more();
	return false;
}
function unzip(path) {
	fm.show_unzip(path);
	return false;
}
function read_zip(path) {
	fm.show_read_zip(path);
	return false;
}
function change_perms(path, name, perms) {
	fm.show_change_perms(path, name, perms);
	return false;
}
function chmod_more() {
	fm.show_chmod_more();
	return false;
}
function copy_one(path, name, type) {
	if (type == 'file') {
		fm.show_copy_file(path, name, "文件");
	} else if (type == 'dir') {
		fm.show_copy_file(path, name, "文件夹");
	} else {
		alert("类型有误！");
	}
	return false;
}
function rename_one(path, name) {
	fm.show_rename_box(path, name);
	return false;
}
function delete_one(path, name, type) {
	fm.show_delete_box(path, name, type);
	return false;
}
function delete_more() {
	fm.show_delete_more_box();
	return false;
}
function copy_more() {
	fm.show_copy_more_box();
	return false;
}
function move_more() {
	fm.show_move_more_box();
	return false;
}
function text_open_more() {
	$("#file_list .table input[type=\"checkbox\"].file_check_box").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			var name = $(element).val();
			edit_file(NOW_PATH + "/" + name, name);
		}
	});
	return false;
}
function load_file_list(path) {
	$("#file_list .path h3").html("Loading...");
	fm.get_file_list(path);
	return false;
}

function order_change(){
	_ORDER.by = $("#SelectOrder").val();
	_ORDER.order = $("#SelectOrder2").val();
	load_file_list(NOW_PATH);
}

function click_all_checkbox() {
	var n = 0;
	var size = $("#file_list .table input[type=\"checkbox\"]").size();
	$("#file_list .table input[type=\"checkbox\"]").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			n++;
		} else {
			$(element).attr("checked", true);
		}
	});
	if (n == size) {
		$("#file_list .table input[type=\"checkbox\"]").each(function (index, element) {
			$(element).removeAttr("checked");
		});
	}
	return false;
}
function click_all() {
	$("#file_list .table input[type=\"checkbox\"]").each(function (index, element) {
		$(element).attr("checked", true);
	});
	return false;
}
function click_all_no() {
	$("#file_list .table input[type=\"checkbox\"]").each(function (index, element) {
		$(element).removeAttr("checked");
	});
	return false;
}
function click_all_file() {
	$("#file_list .table input[type=\"checkbox\"].file_check_box").each(function (index, element) {
		$(element).attr("checked", true);
	});
	$("#file_list .table input[type=\"checkbox\"].dir_check_box").each(function (index, element) {
		$(element).removeAttr("checked");
	});
	return false;
}
function click_f() {
	$("#file_list .table input[type=\"checkbox\"]").each(function (index, element) {
		if ($(element).attr("checked") == true || $(element).attr("checked") == "checked") {
			$(element).removeAttr("checked");
		} else {
			$(element).attr("checked", true);
		}
	});
	return false;
}
function load_FM_UI() {
	var width = $("#warp").width();
	$("#file_action").css("width", "300px");
	$("#file_list").css("width", (width - 300) + "px");
	var height = $(window).height();
	var x_height = height - ($("#header").height()) - ($("#footer").height()) - ($("#function").height());
	if (x_height < 400) {
		x_height = 400;
	}
	$("#file_action").height(x_height);
	$("#file_list").height(x_height);
	$("#file_action").css("overflow", "auto");
	$("#file_list .table").height(x_height - ($("#file_list .path").height()) - ($("#file_list .table_head").height()));
	$("#file_list .table").css("overflow", "auto");
}
/*
 LyFM
 Copyright (c) 2013 loveyu
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
function LyEdit() {
	this.init();
}
LyEdit.file = [];
LyEdit.is_close = false;
LyEdit.is_open = false;
LyEdit.is_min = false;
LyEdit.open_new = function (path, name, charset) {
	if (edit == null)edit = new LyEdit();
	LyEdit.file[LyEdit.file.length] = {name: name, path: path, is_open: false, status: true, id: LyEdit.file.length, char_set: charset};
	if (LyEdit.is_min) {
		LyEdit.prototype.minChange();
	}
	if (LyEdit.is_close) {
		$("#LyEditBOX").css("display", "block");
		LyEdit.is_open = true;
	}
	if (LyEdit.is_open) {
		LyEdit.prototype.open_file();
	}
};
LyEdit.prototype.add = function (path, name) {
	var flag = false;
	for (var i = 0; i < LyEdit.file.length; i++) {
		if (LyEdit.file[i].path == path && LyEdit.file[i].is_open) {
			LyEdit.file[i].is_open = false;
			editAreaLoader.closeFile('LyEditBoxText', i + "_" + name);
			flag = true;
		}
	}
	if (!flag) {
		LyEdit.file[LyEdit.file.length] = {name: name, path: path, is_open: false, status: true, id: LyEdit.file.length};
	}
	if (LyEdit.is_min) {
		this.minChange();
	}
	if (LyEdit.is_close) {
		$("#LyEditBOX").css("display", "block");
		LyEdit.is_open = true;
	}
	if (LyEdit.is_open) {
		this.open_file();
	}
};
LyEdit.prototype.open_file = function () {
	$.each(LyEdit.file, function (index, value) {
		if (!value.is_open) {
			$.getJSON(URL + 'Api/get_file', {path: value.path, char_set: 'utf-8'}, function (data) {
				if (data['status']) {
					if ("undefined" == typeof value.char_set)value.char_set = data['char_set'];
					var file = {id: value.id + "_" + value.name, text: data['text'], syntax: LyEdit.prototype.get_syntax(value.name), title: value.name + " (" + value.char_set + ") "};
					editAreaLoader.openFile('LyEditBoxText', file);
				} else {
					alert(data['error']);
					value.status = false;
				}
				value.is_open = true;
			});
		}
	});
};
LyEdit.prototype.get_syntax = function (file) {
	var ex = file.match(/[^\.]+$/, "");
	return ex;
};
LyEdit.prototype.init = function () {
	$("body").append("<div id=\"LyEditBOX\"><div class=\"title\">文件编辑器</div><div class=\"action\"><button class=\"old\">还原</button><button class=\"min\">最小化</button><button class=\"max\">最大化</button><button class=\"close\">关闭</button></div><textarea id=\"LyEditBoxText\"></textarea></div>");
	editAreaLoader.init({
		id: "LyEditBoxText"	// id of the textarea to transform
		, start_highlight: true, allow_toggle: false, language: "zh", syntax: "html", toolbar: "fullscreen, search, save, go_to_line, |, undo, redo, |, select_font, |, syntax_selection, |, change_smooth_selection, highlight, reset_highlight, |, help", syntax_selection_allow: "css,html,js,php,python,vb,xml,c,cpp,sql,basic,pas,brainfuck", is_multi_files: true, EA_load_callback: "LyEdit.prototype.loader", save_callback: "LyEdit.prototype.save", show_line_colors: true
	});
};
LyEdit.prototype.save = function (id, content) {
	var selected = $(window.frames["frame_LyEditBoxText"].document).find("#tab_browsing_list li.selected");
	var id = (selected[0].id).replace(/tab_file_/, "");
	var file = LyEdit.file[id.match(/[0-9]+/)];
	if (file.status) {
		$.post(URL + 'Api/put_file', {path: file.path, char_set: file.char_set, content: content}, function (data) {
			if (data['status']) {
				LyEdit.prototype.add(file.path, file.name);
				refresh_file();
			} else {
				alert('保存出错');
			}
		});
	}
	return true;
};
LyEdit.prototype.loader = function () {
	this.redoSize();
	this.action_even();
	this.box_move();
	this.open_file();
	LyEdit.is_open = true;
	this.center();
	$(window.frames["frame_LyEditBoxText"].document).keydown(function () {
		LyEdit.prototype.key_down()
	});
};
LyEdit.prototype.key_down = function () {
	var now_event = document.frame_LyEditBoxText.event;
	if (now_event.ctrlKey && String.fromCharCode(now_event.keyCode).toLowerCase() == 's') {
		document.frame_LyEditBoxText.eA.execCommand('save');
		alert("保存网页中");
	}
};
LyEdit.prototype.action_even = function () {
	$("#LyEditBOX button.close").click(function () {
		$.each(LyEdit.file, function (index, value) {
			if (value.is_open && value.status)editAreaLoader.closeFile('LyEditBoxText', value.id + "_" + value.name);
		});
		LyEdit.file = Array();
		$("#LyEditBOX").css("display", "none");
		LyEdit.is_close = true;
		LyEdit.is_open = false;
	});
	$("#LyEditBOX button.max").click(function () {
		$("#frame_LyEditBoxText").width($(window).width() - 0);
		$("#frame_LyEditBoxText").height($(window).height() - $("#LyEditBOX .title").height() - 10);
		$("#LyEditBOX").css("left", "0px");
		$("#LyEditBOX").css("top", "0px");
	});
	$("#LyEditBOX button.old").click(function () {
		$("#frame_LyEditBoxText").width($(window).width() * 0.7);
		$("#frame_LyEditBoxText").height(400);
		setTimeout(function () {
			LyEdit.prototype.center();
		}, 1000);
	});
	$("#LyEditBOX button.min").click(function () {
		LyEdit.prototype.minChange();
	});
	refresh_file();
};
LyEdit.prototype.center = function () {
	$("#LyEditBOX").css("top", (($(window).height() - $("#LyEditBOX").height()) / 2.7) + 'px');
	$("#LyEditBOX").css("left", (($(window).width() - $("#LyEditBOX").width()) / 2.7) + 'px');
};
LyEdit.prototype.box_move = function () {
	var bool = false;
	var offsetX = 0;
	var offsetY = 0;
	$("#LyEditBOX .title").mousedown(function () {
		bool = true;
		offsetX = event.offsetX;
		offsetY = event.offsetY;
	}).mouseup(function () {
		bool = false;
	});
	$(document).bind('mousemove', function (e) {
		if (!bool) {
			return;
		}
		var x = event.clientX - offsetX; //event.clientX  获取鼠标的水平位置
		var y = event.clientY - offsetY;
		var max_x = $(window).width() - $("#LyEditBOX").width();
		var max_y = $(window).height() - $("#LyEditBOX").height() - 10;
		if (x > max_x)x = max_x;
		if (y > max_y)y = max_y;
		if (x < 0)x = 0;
		if (y < 0)y = 0;
		$("#LyEditBOX").css("left", x + "px");
		$("#LyEditBOX").css("top", y + "px");
	});
};
LyEdit.prototype.redoSize = function () {
	$("#LyEditBOX").width($("#frame_LyEditBoxText").width());
	$("#LyEditBOX").height($("#frame_LyEditBoxText").height() + $("#LyEditBOX .title").height());
	setTimeout("LyEdit.prototype.redoSize()", 500);
};
LyEdit.prototype.minChange = function () {
	if (LyEdit.is_min) {
		$("#LyEditMinShow").remove();
		$("#LyEditBOX").css("display", "block");
	} else {
		$("#function").html("<div id=\"LyEditMinShow\" style=\"border-color:#F00;\" class=\"box\">文本编辑<button class=\"min\">还原</button></div>" + $("#function").html());
		$("#LyEditMinShow button.min").click(function () {
			LyEdit.prototype.minChange();
		});
		$("#LyEditBOX").css("display", "none");
	}
	LyEdit.is_min = (!LyEdit.is_min);
};
/*
 LyFM
 Copyright (c) 2013 loveyu
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
function LyUpload() {
	if (typeof(window.FileReader) == 'undefined') {
		alert('当前浏览器不支持HTML5上传，所以请你更换浏览器。');
	}
	LyUpload.instance = this;
	$("body").append('<div id="Upload_Box" style="display:none;">' +
		'<div class="title">' +
		'<button onClick="LyUpload.instance.upload();">开始文件上传</button>' +
		'<button onClick="LyUpload.instance.min_box();">最小化</button>' +
		'<button onClick="LyUpload.instance.clear();">清空</button>' +
		'</div>' +
		'<div class="button"><input id="file_upload" name="file_upload" type="file" multiple="true" onchange="LyUpload.prototype.fileSelected();" /></div>' +
		'<table id="Upload_Box_QueueID"></table>' +
		'</div>');
}
LyUpload.files = {list: {}, count: 0, index: []};
LyUpload.index = '0';
LyUpload.upload_index = 0;
LyUpload.instance = null;
LyUpload.prototype = {
	fileSelected: function () {
		if (LyUpload.files.count === 0) {
			$("#Upload_Box_QueueID").html("");
		}
		var fs = $("#file_upload").get(0).files;
		var html = '';
		for (var i = 0; i < fs.length; i++) {
			var file = fs[i];
			var count = LyUpload.files.count;
			this.add_queue(file, count);
			++LyUpload.files.count;
		}
		$("#file_upload").val("");
		$("#Upload_Box_QueueID").append(html);
	},
	open_box: function () {
		$("#Upload_Box").css("display", "block");
		$("#Upload_Box").css("max-height", ($(window).height() - (($(window).height() - $("#Upload_Box").height()) / 5.7) * 2) + 'px');
		this.center();
	},
	center: function () {
		$("#Upload_Box").css("top", (($(window).height() - $("#Upload_Box").height()) / 5.7) + 'px');
		$("#Upload_Box").css("left", (($(window).width() - $("#Upload_Box").width()) / 1.7) + 'px');
	},
	add_queue: function (file, index) {
		LyUpload.files.list[index] = file;
		this.create_index();
		$("table#Upload_Box_QueueID").append("<tr id='FileUploadQueue_" + index + "'><td style='text-align: center;' class='progress'>0%</td><td>" + file.name + "</td>" +
			"<td class='size'>" + fm.get_size(file.size) + "</td><td><a href='#' onclick='LyUpload.instance.cancel_item(" + index + ");' >取消</a></td></tr>");
	},
	cancel_item: function (id) {
		LyUpload.files.list[id] = null;
		this.create_index();
		$("#FileUploadQueue_" + id).hide('slow', function () {
			$(this).remove();
		});
	},
	create_index: function () {
		LyUpload.files.index = [];
		for (var index in LyUpload.files.list) {
			if (LyUpload.files.list.hasOwnProperty(index) && LyUpload.files.list[index] !== null) {
				LyUpload.files.index.push(index);
			}
		}
	},
	upload: function () {
		if (LyUpload.files.count === 0) {
			alert("请先选择文件来上传。或者当前文件已全部上传完成");
			return;
		}
		LyUpload.index = LyUpload.files.index[LyUpload.upload_index];
		if (LyUpload.files.list.hasOwnProperty(LyUpload.index)) {
			var xhr = new XMLHttpRequest();
			xhr.upload.addEventListener("progress", this.progress, false);
			xhr.addEventListener("load", this.complete, false);
			xhr.addEventListener("error", this.failed, false);
			xhr.addEventListener("abort", this.canceled, false);
			xhr.open("POST", URL + "Api/upload_file", true);
			var fd = new FormData();
			fd.append("Filedata", LyUpload.files.list[LyUpload.index]);
			fd.append("path", NOW_PATH);
			xhr.send(fd);
		} else {
			alert("上传出现异常，尝试刷新页面后重试");
		}
	},
	progress: function (evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.round(evt.loaded * 100 / evt.total) + '%';
			$("tr#FileUploadQueue_" + LyUpload.index + " td.progress").html(percentComplete);
		}
	},
	complete: function (evt) {
		var data = $.parseJSON(this.response);
		if (!data.status) {
			$("tr#FileUploadQueue_" + LyUpload.index + " td.size").html("出错:<span style='color: red'>" + data['error'] + "</span>");
		} else {
			$("tr#FileUploadQueue_" + LyUpload.index + " td.progress").html("<span style='color: blue;'>成功</span>");
			refresh_file();
		}
		if (LyUpload.upload_index === LyUpload.files.index.length - 1) {
			LyUpload.files = {list: {}, count: 0, index: []};
			LyUpload.upload_index = 0;
			LyUpload.index = '0';
			return;
		}
		++LyUpload.upload_index;
		//必须使用实例来上传下一个
		LyUpload.instance.upload();
	},
	failed: function (evt) {
		$("tr#FileUploadQueue_" + LyUpload.index + " td.progress").html("" +
			"<span style='color: red;'>出错:" + this.status + " - " + this.statusText + "</span>");
	},
	canceled: function (evt) {
		$("tr#FileUploadQueue_" + LyUpload.index + " td.progress").html("<span style='color: red;'>" +
			"被取消:" + this.status + " - " + this.statusText + "</span>");
	},
	min_box: function () {
		$("#Upload_Box").css("display", "none");
		$("#Upload_Button").html('还原上传对话框');
	},
	clear: function () {
		$("table#Upload_Box_QueueID").html("");
		LyUpload.files = {list: {}, count: 0, index: []};
		LyUpload.upload_index = 0;
		LyUpload.index = '0';
	}
};
/*
 LyFM
 Copyright (c) 2013 loveyu
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
function LyCode() {
	$("body").append('<div id="' + LyCode.ID + '"><div class="title"><button class=\"run_code\">运行代码/Ctrl+Entry</button><button class=\"min\">最小化</button><button class=\"clear\">清空</button><button class=\"close\">关闭</button></div><div class="content"><div class="code"><textarea id="RUN_CODE_TEXTAREA"></textarea></div><div class="run"><pre></pre></div><div class="clear"></div></div></div>');
	$("#" + LyCode.ID + " .run_code").click(function () {
		LyCode.prototype.run_code()
	});
	$("#" + LyCode.ID + " .min").click(function () {
		LyCode.prototype.min_box()
	});
	$("#" + LyCode.ID + " .close").click(function () {
		LyCode.prototype.close_box()
	});
	$("#" + LyCode.ID + " .clear").click(function () {
		LyCode.prototype.clear_box()
	});
	editAreaLoader.init({
		id: "RUN_CODE_TEXTAREA"	// id of the textarea to transform
		, start_highlight: true	// if start with highlight
		, font_size: "10", allow_resize: "yes", allow_toggle: false, language: "zh", syntax: "php", EA_load_callback: "LyCode.prototype.edit_load_ok", replace_tab_by_spaces: 4
	});
};
LyCode.ID = "RUN_CODE_BOX";
LyCode.prototype = {
	open_box: function () {
		$("#" + LyCode.ID).css("display", "block");
		this.center_box();
	},
	min_box: function () {
		$("#" + LyCode.ID).css("display", "none");
	},
	edit_load_ok: function () {
		$(window.frames["frame_RUN_CODE_TEXTAREA"].document).keydown(function () {
			LyCode.prototype.key_down()
		});
	},
	close_box: function () {
		this.clear_box();
		this.min_box();
	},
	run_code: function () {
		$.post(URL + 'Api/run_code', {code: editAreaLoader.getValue("RUN_CODE_TEXTAREA")}, function (data) {
			if (data == "") {
				$("#" + LyCode.ID + " .content pre").text("代码返回结果为空");
			} else {
				$("#" + LyCode.ID + " .content pre").text(data);
			}
		});
	},
	clear_box: function () {
		$("#" + LyCode.ID + " .content pre").html("");
		$("#RUN_CODE_TEXTAREA").val("");
		editAreaLoader.setValue("RUN_CODE_TEXTAREA", "");
	},
	key_down: function () {
		if (document.frame_RUN_CODE_TEXTAREA.event.ctrlKey && document.frame_RUN_CODE_TEXTAREA.event.keyCode == 13) {
			this.run_code();
		}
	},
	center_box: function () {
		$("#" + LyCode.ID).css("top", (($(window).height() - $("#" + LyCode.ID).height()) / 2.7) + 'px');
		$("#" + LyCode.ID).css("left", (($(window).width() - $("#" + LyCode.ID).width()) / 2.7) + 'px');
		$("#" + LyCode.ID + " .code").height($("#" + LyCode.ID).height() - $("#" + LyCode.ID + " .title").height());
		$("#" + LyCode.ID + " .run").height($("#" + LyCode.ID).height() - $("#" + LyCode.ID + " .title").height());
		$("#" + LyCode.ID + " .code").width($("#" + LyCode.ID).width() / 2);
		$("#" + LyCode.ID + " .run").width($("#" + LyCode.ID).width() / 2-5);
	}
};