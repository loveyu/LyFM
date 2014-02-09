/*
LyFM
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
function LyFM(id){
	LyFM.ID = id;
	this.reSizeSidebar();
}
TextFileExtenName = new Array('tpl','eml','txt','htaccess','php','php5','json','xml','xsl','asp','html','htm','jsp','java','c','cpp','h','cmd','sh','m','cc','cxx','hxx','hpp','log','ini','cs','inc','pas','phtml','js','jsp','css','sh','bsh','pl','py','rc','vb','vbs','as','asm','f','sql','tex','md','readme','srt','conf');
ImageFileExtenName = new Array('jpg','jpeg','png','bmp','ico','gif','tif','tiff');
AudioFileExtenName = new Array('mp3','ogg','wav');
VideoFileExtenName = new Array('mp4','mkv','3gp','mpeg','mpeg4','flv','f4v','vob','mpg');
CharsetList = Array('UTF-8','GBK','GB2312','ASCII','UNICODE','BIG5','UCS-2','UCS-2LE','UCS-2BE');
LyFM.ID;
LyFM.update_url = "http://www.loveyu.net/Update/LyFm.php";
LyFM.file_list;
LyFM.image_count;
LyFM.video_count;
LyFM.audio_count;
LyFM.prototype.out_file_list = function(){
	$(LyFM.ID+" tbody").html("");
	$(LyFM.ID+" .path h3").html("当前路径："+this.make_now_path());
	$(LyFM.ID+" .table_head tbody").append(this.make_parent_path());
	count_list = 0;
	LyFM.image_count = 0;
	LyFM.video_count = 0;
	LyFM.audio_count = 0;
	for(i=0;i<LyFM.file_list['dir'].length;i++){
		$(LyFM.ID+" .table tbody").append((this.make_dir_content(LyFM.file_list['dir'][i])));
		count_list++;
	}
	for(i=0;i<LyFM.file_list['file'].length;i++){
		$(LyFM.ID+" .table tbody").append((this.make_file_content(LyFM.file_list['file'][i])));
		count_list++;
	}
	if(0==count_list){
		$(LyFM.ID+" .table tbody").append((this.make_empty_content()));
	}else{
		this.fix_width();
	}
	load_FM_UI();
	if(LyFM.image_count>0){
		$(".BrowerImages").colorbox({rel:'group1',transition:"none", width:"75%", height:"75%"});
	}
	if(LyFM.audio_count>0){
		$(".BrowerAudio").colorbox({rel:'group2',transition:"none", width:"75%", height:"75%"});
	}
	if(LyFM.video_count>0){
		$(".BrowerVideo").colorbox({rel:'group3',transition:"none", width:"75%", height:"75%"});
	}
};
LyFM.prototype.make_dir_content = function(elem){
	return	'<tr>'+
				'<td class="ico first" ><a href="#" onClick="return load_file_list(\''+elem['path']+'\');" title="进入文件夹"><img src="'+FILE_URL+'images/folder_ico.png" alt="floder"/></a></td>'+
				'<td class="file_name"><a href="#" onClick="return load_file_list(\''+elem['path']+'\');" title="进入文件夹">'+elem['name']+'</a></td>'+
				'<td class="size"><p>文件：'+elem['file_number']+'</p></p>文件夹：'+elem['dir_number']+'</td>'+
				'<td class="quanxian"><a href="#" title="修改权限" onClick="return change_perms(\''+elem['path']+'\',\''+elem['name']+'\',\''+elem['perms']+'\');">'+elem['perms']+'<br /> (修改)</a></td>'+
				'<td class="edit">'+
					'<p>'+
						'<a href="#" onClick="return zip_one(\''+elem['path']+'\',\''+elem['name']+'\',\'dir\');">压缩</a>'+
					'</p>'+
					'<p>'+
						'<a href="#" onClick="return rename_one(\''+elem['path']+'\',\''+elem['name']+'\');">重命名</a>'+
						'<a href="#" onClick="return move_one(\''+elem['path']+'\',\''+elem['name']+'\',\'dir\');">移动</a>'+
						'<a href="#" onClick="return copy_one(\''+elem['path']+'\',\''+elem['name']+'\',\'dir\');">复制</a>'+
						'<a href="#" onClick="return delete_one(\''+elem['path']+'\',\''+elem['name']+'\',\'文件夹\');">删除</a>'+
					'</p>'+
				'</td>'+
				'<td>'+elem['d_altera']+'</td>' +
				'<td>'+elem['d_create']+'</td>' +
				(is_linux()?('<td>'+elem['owner']['name']+' ('+elem['owner_id']+')</td>'+'<td>'+elem['group']['name']+' ('+elem['group_id']+')</td>'):"")+
				'<td class="checkbox"><input name="file_list_box_check" class="dir_check_box" type="checkbox" value="'+elem['name']+'" /></td>'+
			'</tr>';
};
LyFM.prototype.make_file_content = function(elem){
	is_text = is_text_ext_name(elem['exten']);
	return	'<tr>'+
				'<td class="ico first" >'+
					(is_image_ext_name(elem['exten'])?
						'<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" class="BrowerImages" title="图片 '+elem['name']+'"><img src="'+FILE_URL+'images/img_ico.png" alt="file" /></a>'
						:(is_text?
								'<a href="#" onClick="return edit_file(\''+elem['path']+'\',\''+elem['name']+'\');" title="编辑文件"><img src="'+FILE_URL+'images/text_ico.png" alt="file" /></a>'
								:(elem['exten'].toLowerCase()=='zip'?
									'<a href="#" onClick="return read_zip(\''+elem['path']+'\');" title="查看压缩文件内容列表"><img src="'+FILE_URL+'images/zip_ico.png" alt="file" /></a>'
									:(is_audio_ext_name(elem['exten'])?
										'<a href="'+URL+'Api/get_ajax_media?type=audio&path='+encodeURIComponent(elem['path'])+'" class="BrowerAudio" title="音频 '+elem['name']+'"><img src="'+FILE_URL+'images/audio_ico.png" alt="file" /></a>'
											:(is_video_ext_name(elem['exten'])?
												('<a href="'+URL+'Api/get_ajax_media?type=video&path='+encodeURIComponent(elem['path'])+'" class="BrowerVideo" title="视频 '+elem['name']+'"><img src="'+FILE_URL+'images/video_ico.png" alt="file" /></a>')
													:(elem['exten'].toLowerCase()=='pdf'?
														('<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="打开文件"><img src="'+FILE_URL+'images/pdf_ico.png" alt="file" /></a>')
														:('<a href="'+URL+'Api/file_download?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="下载文件"><img src="'+FILE_URL+'images/file_ico.png" alt="file" /></a>')
														)
													)
										)
								)
						)
					)+
				'</td>'+
				'<td class="file_name"><a href="'+URL+'Api/file_download?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="下载文件">'+elem['name']+'</a></td>'+
				'<td class="size">'+elem['size']+'<br /> ('+this.get_size(elem["size"])+')</td>'+
				'<td class="quanxian"><a href="#" onClick="return change_perms(\''+elem['path']+'\',\''+elem['name']+'\',\''+elem['perms']+'\');" title="修改权限">'+elem['perms']+'<br /> (修改)</a></td>'+
				'<td class="edit">'+
					'<p>'+
						(is_text?'<a href="#" onClick="return edit_file(\''+elem['path']+'\',\''+elem['name']+'\');">编辑</a>':"" )+
						(elem['exten'].toLowerCase()=='zip'?'<a href="#" onClick="return unzip(\''+elem['path']+'\');" >解压</a>':"")+
						'<a href="#" onClick="return zip_one(\''+elem['path']+'\',\''+elem['name']+'\',\'file\');">压缩</a>'+
						(is_image_ext_name(elem['exten'])?('<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="新窗口打开图片">打开图片</a>'):'')+
						(is_audio_ext_name(elem['exten'])?('<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="新窗口打开音频">打开音频</a>'):'')+
						(is_video_ext_name(elem['exten'])?('<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="新窗口打开视频">打开视频</a>'):'')+
						((elem['exten'].toLowerCase()=='pdf')?('<a href="'+URL+'Api/get_media?path='+encodeURIComponent(elem['path'])+'" target="_blank" title="打开文件">阅读PDF</a>'):"")+
					'</p>'+
					'<p>'+
						'<a href="#" onClick="return rename_one(\''+elem['path']+'\',\''+elem['name']+'\');">重命名</a>'+
						'<a href="#" onClick="return move_one(\''+elem['path']+'\',\''+elem['name']+'\',\'file\');">移动</a>'+
						'<a href="#" onClick="return copy_one(\''+elem['path']+'\',\''+elem['name']+'\',\'file\');">复制</a>'+
						'<a href="#" onClick="return delete_one(\''+elem['path']+'\',\''+elem['name']+'\',\'文件\');">删除</a>'+
					'</p>'+
				'</td>'+
				'<td>'+elem['d_altera']+'</td>'+
				'<td>'+elem['d_create']+'</td>'+elem['d_create']+'</td>' +
				(is_linux()?('<td>'+elem['owner']['name']+' ('+elem['owner_id']+')</td><td>'+elem['group']['name']+' ('+elem['group_id']+')</td>'):"")+
				'<td class="checkbox"><input name="file_list_box_check" class="file_check_box" type="checkbox" value="'+elem['name']+'" /></td>'+
			'</tr>';
};
LyFM.prototype.make_parent_path = function(){
	return	'<tr>'+
				'<td class="ico first" ><a href="#" onClick="return load_file_list(\''+LyFM.file_list['parent']+'\');" title="进入文件夹"><img src="'+FILE_URL+'images/folder_ico.png" alt="floder"/></a></td>'+
				'<td colspan="'+(is_linux()?'9':'7')+'" class="parent"><a href="#" onClick="return load_file_list(\''+LyFM.file_list['parent']+'\');" >上级目录：<span>'+((LyFM.file_list['path']==LyFM.file_list['parent'])?"已是最顶层":LyFM.file_list['parent'])+'</span></a></td>'+
			'</tr>';
};
LyFM.prototype.make_empty_content = function(){
	if(!LyFM.file_list['exists']){
		return '<tr><td class="empty no_found">该目录不存在。</td></tr>';
	}
	if(!LyFM.file_list['is_read']){
		return '<tr><td class="empty no_found">没有读取权限。</td></tr>';
	}
	if(LyFM.file_list['exists']){
		return '<tr><td class="empty">该目录为空。</td></tr>';
	}
};
LyFM.prototype.fix_width = function(){
	a = new Array();
	$(LyFM.ID+" .table tbody tr :first td").each(function(index, element) {
		a[index] = $(element).width();
	});
	$(LyFM.ID+" .table_head thead tr :first td").each(function(index, element){
		if(index!=a.length-1)
			$(element).width(a[index]);
	});
};
LyFM.prototype.reSizeSidebar = function(){
	width = $(window).width()-$("#file_action").width();
	if(width!=$("#file_list").width()){
		$("#file_list").width(width);
	}
	setTimeout("LyFM.prototype.reSizeSidebar()",1000);
};
LyFM.prototype.show_rename_box = function(path,name){
	html = '';
	html =	'<div id="rename_box"><form action="'+URL+'Api/rename">'+
			'<p>当前路径：<strong>'+path+'</strong></p>'+
			'<p>旧名称：<strong>'+name+'</strong></p>'+
			'<label>新名称：<input name="name" value="'+name+'" type="text" /></label>'+
			'<input name="path" value="'+path+'" type="hidden" />'+
			'<button type="submit">确定修改</button>'+
			'</form></div>';
	this.app_box('重命名',html);
	$("#rename_box input[name=\"name\"]").focus();
	$("#rename_box form").submit(function(){
		s_path = $("#rename_box input[name=\"path\"]").val();
		s_name = $("#rename_box input[name=\"name\"]").val();
		if(s_name==name){
			alert('未修改，名称未变化');
			return false;
		}
		if(s_name==""){
			alert("不能为空");
			return false;
		}
		if(s_name.indexOf('/')>=0 || s_name.indexOf('\\')>=0){
			alert('存在非法斜杠');
			return false;
		}
		$.getJSON(URL+"Api/rename",{path:s_path,name:s_name},function(data){
			if(true == data['status']){
				LyFM.prototype.app_box_close();
				LyFM.prototype.get_file_list(NOW_PATH);
			}else{
				alert('改名失败');
			}
		});
		return false;
	});
};
LyFM.prototype.show_delete_box = function(path,name,type){
	html = '';
	html =	'<div id="delete_box"><form action="'+URL+'Api/delete">'+
			'<p>当前'+type+'路径：<strong>'+path+'</strong></p>'+
			'<p>'+type+'名称：<strong>'+name+'</strong></p>'+
			'<input name="path" value="'+path+'" type="hidden" />'+
			'<button type="submit">确定删除'+type+'?</button>'+
			'</form></div>';
	this.app_box(type+' 删除',html);
	$("#delete_box form").submit(function(){
		$.getJSON(URL+"Api/delete",{path:path},function(data){
			LyFM.prototype.get_file_list(NOW_PATH);
			tmp = '';
			for(i=0;i<data['list'].length;i++){
				tmp+="<li>"+(data['list'][i]['status']?'<p class="true">成功</p>':'<p class="false">失败</p>')+"<p>"+data['list'][i]['path']+"</p></li>"
			}
			LyFM.prototype.app_box_close();
			LyFM.prototype.app_box(name+" "+type+" 删除状态",'<ul id="delete_box" style="max-height:500px;overflow:auto;">'+tmp+"</ul>");
			if(false == data['status']){
				alert('删除失败: '+data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_delete_more_box = function(){
	this.app_box_close();
	var n = 0;
	var list = new Array();
	$("input[name=\"file_list_box_check\"]").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			list[n++] = $(element).val();
		}
	});
	if(n>0){
		this.app_box('你确定删除？','<div>'+
					'<p>你确定删除你选中的 '+n+' 个文件或文件夹?</p>'+
					'<p style="color:red;">提示：递归过程中出现权限文件将无法详细显示</p>'+
					'<div id="Delete_More_List"></div><button type="submit" id="Delete_More">确定删除</button></div>');
		$("#Delete_More").click(function(){
			$(this).remove();
			LyFM.prototype.app_box_title("批量文件删除状态");
			for(i in list){
				$.getJSON(URL+"Api/delete",{path:NOW_PATH+'/'+list[i]},function(data){
					if(true == data['status']){
						$("#Delete_More_List").append('<p style="color:black;">'+list[i]+' 已删除</p>');						
					}else{
						$("#Delete_More_List").append('<p style="color:red;">'+list[i]+' 删除失败</p>');		
					}
					if(i==(n-1)){
						LyFM.prototype.get_file_list(NOW_PATH);
					}
				});
			}
		});
	}else{
		alert('没有选中任何项目');
	}
};
LyFM.prototype.char_set_change_more = function(){
	var f_list = Array();
	var f_n = 0;
	$("input[name=\"file_list_box_check\"].file_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			f_list[f_n++] = $(element).val();
		}
	});
	if(f_n==1){
		var name = NOW_PATH+"/"+f_list[0];
		arr = CharsetList;
		option = '';
		for(i in arr){
			option += '<option>'+arr[i]+'</option>';
		}
		tmp =	'<div id="CHAR_CHANGE"><form>'+
				'<p>当前文件路径:'+name+'</p>'+
				'<p style="color:red;">如果是非文本文件，将导致文件不可用，原始编码错误将导致文件乱码。</p>'+
				'<p>将 <select name="old">'+option+'</select> 转换为 <select name="new">'+option+'</select>'+
				'<button type="submit">开始转换</button>'+
				'</form></div>';
		this.app_box("文件编码转换",tmp);
		$("#CHAR_CHANGE form").submit(function(){
			old_char = $("#CHAR_CHANGE form select[name=\"old\"]").val();
			new_char = $("#CHAR_CHANGE form select[name=\"new\"]").val();
			if(old_char==new_char){
				alert('相同编码转换无意义');
				return false;
			}
			$.getJSON(URL+'Api/change_charset',{path:name,old_char:old_char,new_char:new_char},function(data){
				if(data['status']){
					LyFM.prototype.app_box_content('转换完成，但转换状态不一定成功');
					LyFM.prototype.get_file_list(NOW_PATH);
				}else{
					alert(data['error']);
				}
			});
			return false;
		});
	}else{
		alert('仅且只能选择一个文件，文件夹无效');
	}
};
LyFM.prototype.email_more = function(){
	var f_list = Array();
	var f_n = 0;
	$("input[name=\"file_list_box_check\"].file_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			f_list[f_n++] = $(element).val();
		}
	});
	if(f_n>0){
		var tmp =	'<div id="MailBox"><form onSubmit="return false;">'+
					'<p>当前共选中 <span style="color:red;">'+f_n+'</span> 个文件</p>'+
					'<p>邮件地址:<input type="text" value="" name="email" /></p>'+
					'<p>发送方式:<select name="method"><option>mail</option><option>smtp</option></select>(smtp需先配置)</p>'+
					'<p>附加内容:<textarea name="more"></textarea></p>'+
					'<button type="submit">发送邮件</button>'+
					'</form></div>';
		this.app_box("邮件发送附件",tmp);
		$("#MailBox form").submit(function(){
			email = $("#MailBox form input[name=\"email\"]").val();
			if(email=="" || email!=email.match(/[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)){
				alert("邮件有误");
				return false;
			}
			method = $("#MailBox form select[name=\"method\"]").val();
			more = $("#MailBox form textarea[name=\"more\"]").val();
			LyFM.prototype.app_box_title('等待发送状态，可以关闭窗口');
			$.post(URL+'Api/mail_file',{path:NOW_PATH,list:f_list,email:email,method:method,more:more},function(data){
				if(data['status']){
					alert('邮件发送成功');
				}else{
					alert('邮件发送失败：'+data['error']);
					if(data['data']!=''){
						LyFM.prototype.app_box_close();
						LyFM.prototype.app_box("邮箱发送状态","<div>"+data['data']+"</div>");
					}
				}
			});
			return false;
		});
	}else{
		alert('至少选择一个文件');
	}	
};
LyFM.prototype.show_choice_dirve = function(){
	$.getJSON(URL+'Api/window_dirve',function(data){
		if(data['status']){
			tmp = '<div>';
			for(itmp in data['list']){
				tmp += ('<a href="#" onClick="return load_file_list(\''+data['list'][itmp]+'\');">'+data['list'][itmp]+'</a>&nbsp;&nbsp;&nbsp;&nbsp;');
			}
			tmp += '</div>';
			LyFM.prototype.app_box('选择一个磁盘打开',tmp);	
		}else{
			alert(data['error']);
		}
	});
};
LyFM.prototype.show_move_file = function(path,name,type){
	tmp = '';
	tmp =	'<div id="Move_File"><form action="'+URL+'Api/move_file">'+
			'<p>当前'+type+'路径：<strong>'+path+'</strong></p>'+
			'<p>所在目录：<strong>'+dirname(path)+'</strong></p>'+
			'<input type="hidden" name="path" value="'+path+'" />'+
			'<label>新目录：<input type="text" name="new_path" value="'+dirname(path)+'" /></label>'+
			'<button type="submit">移动'+type+'</button>'+
			'</form></div>';
	this.app_box('移动'+type,tmp);
	$("#Move_File form input[name=\"new_path\"]").focus();
	$("#Move_File form").submit(function(){
		var new_path = $("#Move_File form input[name=\"new_path\"]").val();
		if(new_path==dirname(path)){
			alert('目录未改变,请修改');
			return false;
		}
		$.getJSON(URL+"Api/move_file",{path:path,new_path:new_path,type:(type=="文件"?"file":"dir")},function(data){
			if(true == data['status']){
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				LyFM.prototype.show_move_succ_box(new_path);
			}else{
				alert(type+'移动失败：'+data['error']);
			}
		});
		return false;
	});	
};
LyFM.prototype.show_move_more_box = function(){
	this.app_box_close();
	var f_n = 0;
	var d_n = 0;
	var f_list = new Array();
	var d_list = new Array();
	$("input[name=\"file_list_box_check\"].file_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			f_list[f_n++] = $(element).val();
		}
	});
	$("input[name=\"file_list_box_check\"].dir_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			d_list[d_n++] = $(element).val();
		}
	});
	var count = f_n+d_n;
	if(count>0){
		tmp =	'<div id="MOVE_File"><form>'+
				'<p>共选中<span style="color:red;">'+f_n+'</span> 个文件与 <span style="color:red;">'+d_n+'</span> 个文件夹</p>'+
				'<p>当前目录：<strong>'+NOW_PATH+'</strong></p>'+
				'<label>新目录：<input type="text" name="new_path" value="'+NOW_PATH+'" /></label>'+
				'<button type="submit">移动选中项</button>'+
				'</form></div>';
		this.app_box('你确定移动所选择的内容？',tmp);
		$("#MOVE_File form input[name=\"new_path\"]").focus();
		$("#MOVE_File form").submit(function(){
			var new_path = $("#MOVE_File form input[name=\"new_path\"]").val();
			if(new_path==NOW_PATH){
				alert('目录未改变,请修改');
				return false;
			}			
			for(i in f_list){
				$.getJSON(URL+"Api/move_file",{path:NOW_PATH+'/'+f_list[i],new_path:new_path,type:'file'},function(data){
					if(false == data['status']){
						alert('移动 '+f_list[i]+' 失败：'+data['error']);
					}
					if((--count)==0){
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			for(i in d_list){
				$.getJSON(URL+"Api/move_file",{path:NOW_PATH+'/'+d_list[i],new_path:new_path,type:'dir'},function(data){
					if(false == data['status']){
						alert('移动 '+d_list[i]+' 失败：'+data['error']);
					}
					if((--count)==0){
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_move_succ_box(new_path);
					}
				});
			}
			return false;
		});
	}else{
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_zip_one = function(path,name,type){
	type_name = (type=='file'?"文件":"文件夹");
	tmp =	'<div id="ZIP_FILE"><form onSubmit="return false;">'+
			'<p>'+type_name+'路径：<strong>'+path+'</strong></p>'+
			'<p><label>压缩包路径：<input name="zip_path" type="text" value="'+dirname(path)+'" /></label></p>'+
			'<p><label>ZIP文件名：<input class="short" name="zip_name" type="text" value="'+(type=='file'?remove_ext(name):name)+'" />.zip</label></p>'+
			'<p><button type="submit">压缩</button></p>'+
			'<input name="path" type="hidden" value="'+path+'" />'+
			'</form></div>';
	this.app_box('压缩'+type_name,tmp);
	$("#ZIP_FILE form input[name=\"zip_name\"]").focus();
	$("#ZIP_FILE form").submit(function(){
		zip_path = $("#ZIP_FILE form input[name=\"zip_path\"]").val();
		zip_name = $("#ZIP_FILE form input[name=\"zip_name\"]").val();
		if(zip_path=="" || zip_name==""){
			alert("不允许存在空值");
			return false;
		}
		LyFM.prototype.app_box_title('压缩中 loading...');
		$.getJSON(URL+"Api/zip_file",{path:path,zip_path:zip_path+'/'+zip_name},function(data){
			if(true == data['status']){
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				list = '<ul>';
				for(i=0;i<data['list'].length;i++){
					list+='<li>'+data['list'][i]['path']+'</li>';
				}
				list += '</ul>';
				tmp =	'<div id="ZIP_FILE">'+
						'<p>耗时:'+data['time']+'</p>'+
						'<p>文件列表:'+i+' 个</p>'+
						list+
						'</div>';
				LyFM.prototype.app_box(type_name+" 压缩状态",tmp);
			}else{
				alert(type_name+'压缩失败：'+data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_zip_more = function(){
	var n = 0;
	var list = new Array();
	$("input[name=\"file_list_box_check\"]").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			list[n++] = $(element).val();
		}
	});
	if(n>0){
		this.app_box('你确定压缩这些文件？',
				'<div id="ZIP_More"><form><p>你确定压缩你选中的 '+n+' 个文件或文件夹?</p>'+
				'<p>当前路径：'+NOW_PATH+'</p>'+
				'<p><label>ZIP文件名:<input name="zip" class="short" value="" type="text" />.zip</label></p>'+
				'<button type="submit">确定压缩</button></form></div>');
		$("#ZIP_More form").submit(function(){
			LyFM.prototype.app_box_title("压缩中....");
			$("#ZIP_More input[name=\"zip\"]").focus();
			zip_name = $("#ZIP_More input[name=\"zip\"]").val();
			$.post(URL+"Api/zip_more",{path:NOW_PATH,list:list,zip_name:zip_name},function(data){
				if(true == data['status']){
					LyFM.prototype.get_file_list(NOW_PATH);
					LyFM.prototype.app_box_close();
					list = '<ul>';
					for(i=0;i<data['list'].length;i++){
						list+='<li>'+data['list'][i]['path']+'</li>';
					}
					list += '</ul>';
					tmp =	'<div id="ZIP_FILE">'+
							'<p>耗时:'+data['time']+'</p>'+
							'<p>文件列表:'+i+' 个</p>'+
							list+
							'</div>';
					LyFM.prototype.app_box("压缩状态",tmp);
				}else{
					alert('压缩失败：'+data['error']);
				}
				});
			return false;
		});
	}else{
		alert('没有选中任何项目');
	}		
};
LyFM.prototype.show_unzip = function(path){
	tmp =	'<div id="UNZIP_FILE"><form onSubmit="return false;">'+
			'<p style="color:red;">如有相同文件名或路径将被覆盖！</p>'+
			'<p>压缩包路径：<strong>'+path+'</strong></p>'+
			'<p><label>解压路径：<input name="unzip_path" type="text" value="'+NOW_PATH+'" /></label></p>'+
			'<p><button type="submit">解压缩</button></p>'+
			'<input name="path" type="hidden" value="'+path+'" />'+
			'</form></div>';
	this.app_box('文件解压缩压缩',tmp);
	$("#UNZIP_FILE form input[name=\"unzip_path\"]").focus();
	$("#UNZIP_FILE form").submit(function(){
		unzip_path = $("#UNZIP_FILE form input[name=\"unzip_path\"]").val();
		if(unzip_path==""){
			alert("不允许空值");
			return false;
		}
		LyFM.prototype.app_box_title('正在解压 loading...');
		$.getJSON(URL+"Api/unzip_file",{path:path,unzip_path:unzip_path},function(data){
			if(true == data['status']){
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_close();
				alert('解压耗时 '+data['time']+' ！');
			}else{
				alert('解压压缩失败：'+data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_change_perms = function(path,name,perms){
	tmp = 	'<div id="Change_Perms"><form onSubmit="return false;">'+
			'<p>当前路径:<span style="color:#111;display:inline;">'+path+'</span></p>'+
			'<p style="color:#F22;">提示：如需递归修改，请使用边栏工具</p>'+
			'<p><label>修改权限为:<input class="short" name="new" value="'+perms+'" type="text" /></label></p>'+
			'<p><button type="submit">修改</button></p>'+
			'<input name="path" value="'+path+'" type="hidden" />'+
			'</form></div>';
	this.app_box('修改权限',tmp);
	$("#Change_Perms form input[name=\"new\"]").focus();
	$("#Change_Perms form").submit(function(){
		new_perms = $("#Change_Perms form input[name=\"new\"]").val();
		if(new_perms==""){
			alert("不允许空值");
			return false;
		}
		LyFM.prototype.app_box_title('正在修改权限 loading...');
		$.getJSON(URL+"Api/change_perms",{path:path,new_perms:new_perms},function(data){
			if(true == data['status']){
				LyFM.prototype.get_file_list(NOW_PATH);
				LyFM.prototype.app_box_content('<p>成功修改权限，具体值可能有区别！</p>');
			}else{
				alert(data['error']);
			}
		});
		return false;
	});
};
LyFM.prototype.show_chmod_more = function(){
	this.app_box_close();
	var n = 0;
	var list = new Array();
	$("input[name=\"file_list_box_check\"]").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			list[n++] = $(element).val();
		}
	});
	if(n>0){
		this.app_box('你确定修改权限？',
				'<div id="CHMODE_More"><form><p>你确定修改你选中的 '+n+' 个文件或文件夹的权限?</p>'+
				'<p><label>文件夹权限:<input name="dir_chmod" class="short" value="'+(is_linux()?"0755":"0777")+'" type="text" /></label></p>'+
				'<p><label>文件权限:<input name="file_chmod" class="short" value="'+(is_linux()?"0644":"0666")+'" type="text" /></label></p>'+
				'<p><label>文件夹权限递归 <input type="checkbox" name="recursion" value="true" /></label></p>'+
				'<button type="submit">确定修改</button></form></div>');
		$("#CHMODE_More button[type=\"submit\"]").click(function(){
			LyFM.prototype.app_box_title("批量文件权限修改状态");
			$("#CHMODE_More input[name=\"dir_mode\"]").focus();
			file_mode = $("#CHMODE_More input[name=\"file_chmod\"]").val();
			dir_mode = $("#CHMODE_More input[name=\"dir_chmod\"]").val();
			recursion = $("#CHMODE_More input[name=\"recursion\"]").attr("checked");
			if(recursion==true || recursion=="checked"){
				recursion = "true";
			}else{
				recursion = "false";
			}
			$.post(URL+"Api/chmod_more",{path:NOW_PATH,list:list,file_mode:file_mode,dir_mode:dir_mode,r:recursion},function(data){
				if(true == data['status']){
					LyFM.prototype.app_box_content("<div>权限修改成功</div>");				
				}else{
					alert('修改权限失败：'+data['error']);
				}
				LyFM.prototype.get_file_list(NOW_PATH);
			});
			return false;
		});
	}else{
		alert('没有选中任何项目');
	}	
};
LyFM.prototype.show_read_zip = function(path){
	$.getJSON(URL+"Api/read_zip_file",{path:path},function(data){
		if(true == data['status']){
			if(data['list'].length<=0){
				alert('ZIP文件内容为空');
				return false;
			}
			var tmp = '<ul>';
			for(i in data['list']){
				tmp += '<li><span style="color: #000;display: inline;">&gt;&gt;</span>'+data['list'][i]+'</li>';
			}
			tmp += '</ul>';
			LyFM.prototype.app_box('查看压缩文件列表','<div><p style="margin:2px;color:red;"><span>文件路径:</span>'+path+'</p><p>内容列表：('+data['list'].length+'个列表)</p>'+tmp+'</div>');
		}else{
			alert('ZIP文件读取失败：'+data['error']);
		}
	});
	return false;
};
LyFM.prototype.show_copy_file = function(path,name,type){
	tmp =	'<div id="Copy_File"><form action="'+URL+'Api/copy_file">'+
			'<p>当前'+type+'路径：<strong>'+path+'</strong></p>'+
			'<p>所在目录：<strong>'+dirname(path)+'</strong></p>'+
			'<input type="hidden" name="path" value="'+path+'" />'+
			'<label>新目录：<input type="text" name="new_path" value="'+dirname(path)+'" /></label>'+
			'<button type="submit">复制'+type+'</button>'+
			'</form></div>';
	this.app_box('复制'+type,tmp);
	$("#Copy_File form input[name=\"new_path\"]").focus();
	$("#Copy_File form").submit(function(){
		var new_path = $("#Copy_File form input[name=\"new_path\"]").val();
		if(new_path==dirname(path)){
			alert('目录未改变,请修改');
			return false;
		}
		$.getJSON(URL+"Api/copy_file",{path:path,new_path:new_path,type:(type=="文件"?"file":"dir")},function(data){
			if(true == data['status']){
				LyFM.prototype.app_box_close();
				LyFM.prototype.show_copy_succ_box(new_path);
			}else{
				alert(type+'复制失败：'+data['error']);
			}
		});
		return false;
	});	
};
LyFM.prototype.show_copy_more_box = function(){
	this.app_box_close();
	var f_n = 0;
	var d_n = 0;
	var f_list = new Array();
	var d_list = new Array();
	$("input[name=\"file_list_box_check\"].file_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			f_list[f_n++] = $(element).val();
		}
	});
	$("input[name=\"file_list_box_check\"].dir_check_box").each(function(index, element) {
		if($(element).attr("checked")==true || $(element).attr("checked")=="checked"){
			d_list[d_n++] = $(element).val();
		}
	});
	var count = f_n+d_n;
	if(count>0){
		tmp =	'<div id="Copy_File"><form>'+
				'<p>共选中<span style="color:red;">'+f_n+'</span> 个文件与 <span style="color:red;">'+d_n+'</span> 个文件夹</p>'+
				'<p>当前目录：<strong>'+NOW_PATH+'</strong></p>'+
				'<label>新目录：<input type="text" name="new_path" value="'+NOW_PATH+'" /></label>'+
				'<button type="submit">复制选中项</button>'+
				'</form></div>';
		this.app_box('你确定复制所选择的内容？',tmp);
		$("#Copy_File form input[name=\"new_path\"]").focus();
		$("#Copy_File form").submit(function(){
			var new_path = $("#Copy_File form input[name=\"new_path\"]").val();
			if(new_path==NOW_PATH){
				alert('目录未改变,请修改');
				return false;
			}			
			for(i in f_list){
				$.getJSON(URL+"Api/copy_file",{path:NOW_PATH+'/'+f_list[i],new_path:new_path,type:'file'},function(data){
					if(false == data['status']){
						alert('复制 '+f_list[i]+' 失败：'+data['error']);
					}
					if((--count)==0){
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			for(i in d_list){
				$.getJSON(URL+"Api/copy_file",{path:NOW_PATH+'/'+d_list[i],new_path:new_path,type:'dir'},function(data){
					if(false == data['status']){
						alert('复制 '+d_list[i]+' 失败：'+data['error']);
					}
					if((--count)==0){
						LyFM.prototype.get_file_list(NOW_PATH);
						LyFM.prototype.app_box_close();
						LyFM.prototype.show_copy_succ_box(new_path);
					}
				});
			}
			return false;
		});
	}else{
		alert('没有选中任何项目');
	}
};
LyFM.prototype.show_move_succ_box = function(path){
	LyFM.prototype.app_box("移动成功，是否打开该目录?",
		"<div id=\"Movie_File\">"+
			"<p>已移动到："+path+"</p>"+
			"<button onclick=\"load_file_list('"+path+"');LyFM.prototype.app_box_close();\">打开该目录</button>"+
		"</div>");	
};
LyFM.prototype.show_copy_succ_box = function(path){
	LyFM.prototype.app_box("复制成功，是否打开该目录?",
		"<div id=\"Movie_File\">"+
			"<p>已复制到："+path+"</p>"+
			"<button onclick=\"load_file_list('"+path+"');LyFM.prototype.app_box_close();\">打开该目录</button>"+
		"</div>");	
};
LyFM.prototype.app_box = function(title,html,width){
	this.app_box_close();
	content =	'<div id="LyFM_BOX">'+
				'<div class="title"><h3>'+title+'</h3></div><button class="close" onClick="LyFM.prototype.app_box_close()">关闭</button>'+
				'<div class="content">'+html+'</div>'+
				'</div>';
	$("body").append(content);
	$("#LyFM_BOX").css("width",width);
	this.app_box_size();
	this.app_box_move();
	$(window).resize(this.app_box_size);
};
LyFM.prototype.app_box_close = function(){
	$("#LyFM_BOX").remove();
};
LyFM.prototype.app_box_title = function(title){
	$("#LyFM_BOX .title h3").html(title);
};
LyFM.prototype.app_box_size = function(){
	$("#LyFM_BOX .title h3").width($("#LyFM_BOX .title").width()-$("#LyFM_BOX .title button").width()*3);
	$("#LyFM_BOX").css("top",(($(window).height()-$("#LyFM_BOX").height())/2.7)+'px');
	$("#LyFM_BOX").css("left",(($(window).width()-$("#LyFM_BOX").width())/2.7)+'px');
};
LyFM.prototype.app_box_content = function(content){
	$("#LyFM_BOX div.content :first").html(content);
};
LyFM.prototype.app_box_move = function(){
	var bool=false;
	var offsetX=0;
	var offsetY=0;
	$("#LyFM_BOX .title").mouseleave(function(){
		bool = false;
	});
	$("#LyFM_BOX .title").mousedown(function(){
		bool=true;
		offsetX = event.offsetX;
		offsetY = event.offsetY;
	}).mouseup(function(){
		bool=false;
	});
	$(document).bind('mousemove',function(e){
		if(!bool){
			return;
		}
		var x = event.clientX-offsetX; //event.clientX  获取鼠标的水平位置
		var y = event.clientY-offsetY;
		max_x = $(window).width()-$("#LyFM_BOX").width()-15;
		max_y = $(window).height()-$("#LyFM_BOX").height()-4;
		if(x>max_x)x = max_x;
		if(y>max_y)y = max_y;
		if(x<0)x=0;
		if(y<0)y=0;
		$("#LyFM_BOX").css("left", x+"px");
		$("#LyFM_BOX").css("top", y+"px");
	});
};
LyFM.prototype.make_now_path = function(){
	path = LyFM.file_list['path'];
	if(path.substr(-1)=='/'){
		path = path.substr(0,path.length-1);
	}
	array = path.split('/');
	rt = '';
	for(i=0;i<array.length;i++){
		if(array[i]!='' && array[i]!='/'){
			if(i!=(array.length-1)){
				tmp = '';
				for(j=0;j<=i;j++){
					tmp+=(array[j]+'/');
				}				
				rt+='<a href="#" onclick="return load_file_list(\''+tmp+'\')">'+array[i]+'</a>/';
			}else{
				rt+='<a href="#" onclick="return false;">'+array[i]+'</a>';
			}
		}
	}
	if(is_linux()){
		rt = '<a href="#" onclick="return load_file_list(\'/\')">/</a>' + rt;
	}
	return rt;
};
LyFM.prototype.show_web_download = function(){
	var tmp =	'<div id="WEB_Download"><form>'+
				'<p>当前目录:<span>'+NOW_PATH+'</span></p>'+
				'<p><label>下载地址:<input name="url" type="text" value="" /></label></p>'+
				'<p><label>保存文件名(留空默认)：<input class="short" name="name" type="text" value="" /></label></p>'+
				'<p><button type="submit">下载</button></p>'+
				'</form></div>';
	this.app_box('下载远程文件',tmp);
	$("#WEB_Download form input[name=\"url\"]").focus();
	$("#WEB_Download form").submit(function(){
		url = $("#WEB_Download form input[name=\"url\"]").val();
		name = $("#WEB_Download form input[name=\"name\"]").val();
		if(!url.match(/[a-zA-z]+:\/\/[^.\s][^\s]*/)){
			alert('网址匹配出错');
			return false;
		}
		LyFM.prototype.app_box_title("<span style=\"color:red;\">文件下载中 （关闭该窗口无影响,会提示状态）...</span>");
		$.getJSON(URL+'Api/url_download',{path:NOW_PATH,url:url,name:name},function(data){
			var tmp_path = NOW_PATH;
			if(!data['status']){
				LyFM.prototype.app_box_title("<span style=\"color:red;\">文件下载出现错误</span>");
				alert('下载出错:'+data['error']);
			}else{
				alert('下载成功\n'+data['name']+ ' (' +LyFM.prototype.get_size(data['size']) +') \n下载耗时'+data['time']);
				LyFM.prototype.app_box_title("<span style=\"color:red;\">下载成功</span>");
				LyFM.prototype.app_box_content('<div><p>地址：'+url+'</p><p>下载文件名：'+data['name']+' '+LyFM.prototype.get_size(data['size'])+' </p><p>下载耗时：'+data['time']+'</p></div>');
				LyFM.prototype.get_file_list(tmp_path);
			}
		});
		return false;
	});
};
LyFM.prototype.get_file_list=function(request_path){
	$.getJSON(URL+"Api/file_list",{path:request_path},function(data){
		LyFM.file_list = data;
		LyFM.prototype.out_file_list();
		NOW_PATH = request_path;
		LyFM.set_path(NOW_PATH);
		$('#GO_TO_PATH').val(NOW_PATH);
	});
	load_FM_UI();
};
LyFM.prototype.mkdir = function(path,name){
	if(name=="" || name=="/" || name=="\\"){
		alert("不能为空或斜杠");
		return false;
	}
	$.getJSON(URL+"Api/mkdir",{path:path,name:name},function(data){
		if(data['status']){
			refresh_file();
			$("#make_dir input[name=\"name\"]").val("");
		}else{
			alert(data['error']);
		}
	});
};
LyFM.prototype.mkfile = function(path,name,charset){
	if(name==""){
		alert("不能为空");
		return false;
	}
	if(name.indexOf('/')>=0 || name.indexOf('\\')>=0){
		alert('存在非法斜杠');
		return false;
	}
	if(!is_char_set(charset)){
		alert('未知编码');
		return false;
	}
	$.getJSON(URL+"Api/mk_file",{path:path,name:name},function(data){
		if(data['status']){
			refresh_file();
			LyEdit.open_new(path+"/"+name,name,charset);
			$("#make_file input[name=\"name\"]").val("");
		}else{
			alert(data['error']);
		}
	});	
}
LyFM.set_path = function(path){
	NOW_PATH = path;
	$.cookie("LYEDIT_NOW_PATH",path);
};
LyFM.get_path = function(){
	cookie_path = null;
	cookie_path = $.cookie("LYEDIT_NOW_PATH");
	if(cookie_path!='' && cookie_path!=null){
		return cookie_path;
	}
	return ROOT;
};
LyFM.prototype.get_size = function(size){
	a = new Array("B", "KB", "MB", "GB", "TB", "PB","EB","ZB","YB");
	pos = 0;
	if(size<0)return '出错';
    while (size > 1024)   
    {
        size /= 1024;
        pos++;
    }
	return (Math.round(size*100)/100)+a[pos];
};
LyFM.prototype.check_update = function(){
	local_data = window.localStorage.getItem("LyPHPFMUpdateInfo");
	if(local_data==null || local_data=="null" || local_data==""){
		$.getJSON(LyFM.update_url+'?version='+VERSION+'&jsoncallback=?',function(data){
			LyFM.prototype.set_update_value(data);
			localStorage.setItem("LyPHPFMUpdateInfo",JSON.stringify(data));
		});
	}else{
		var json_data = JSON.parse(local_data);
		var timestamp=new Date().getTime();
		var exp_time = (timestamp/1000 - 24*60*60);
		if(json_data['request_time']<exp_time){
			this.check_up_now();
		}
		this.set_update_value(json_data);
	}
};
LyFM.prototype.check_up_now = function(){
	window.localStorage.setItem("LyPHPFMUpdateInfo","");
	this.check_update();
};
LyFM.prototype.set_update_value = function(data){
	$("#feedback_url").attr("href",remove_html(data['feedback_url']));
	$("#file_action .new_version").remove();
	if(VERSION<data['top_version']){
		$("#feedback_url").after("<a class=\"new_version\" target=\"_blank\" href=\""+remove_html(data['top_download'])+"\">下载 "+remove_html(data['top_version'])+"</a>");
	}else{
		$("#file_action .bug ul").append("<li>当前为最新版本</li>");
	}
	$("#file_action .bug ul").html("");
	for(i in data['bug_list']){
		$("#file_action .bug ul").append("<li><a style=\"color:red;\" href=\""+remove_html(data['bug_list'][i]['url'])+"\" target=\"_blank\">"+remove_html(data['bug_list'][i]['title'])+"</a></li>");
	}
	for(i in data['update_list']){
		$("#file_action .bug ul").append("<li><a href=\""+remove_html(data['update_list'][i]['url'])+"\" target=\"_blank\">"+remove_html(data['update_list'][i]['title'])+"</a></li>");
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
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
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
function remove_html(content){
	return content.replace(/</,"&lt;").replace(/>/,"&gt;");
}
function dirname(path){
	return path.match(/^.+[\\\\\\/]/);
}
function remove_ext(path){
	return path.replace(/\.[^\.]+$/,"");
}
function is_text_ext_name(exten){
	exten = exten.toLowerCase();
	j=i;
	for(i=0;i<TextFileExtenName.length;i++){
		if(TextFileExtenName[i]==exten){
			i=j;
			return true;
		}
	}
	i=j;
	return false;	
}
function is_image_ext_name(exten){
	exten = exten.toLowerCase();
	j=i;
	for(i=0;i<ImageFileExtenName.length;i++){
		if(ImageFileExtenName[i]==exten){
			++LyFM.image_count;
			i=j;
			return true;
		}
	}
	i=j;
	return false;		
}
function is_char_set(char){
	var i;
	j=i;
	for(i=0;i<CharsetList.length;i++){
		if(CharsetList[i]==char){
			i=j;
			return true;
		}
	}
	i=j;
	return false;		
}
function is_audio_ext_name(exten){
	exten = exten.toLowerCase();
	j=i;
	for(i=0;i<AudioFileExtenName.length;i++){
		if(AudioFileExtenName[i]==exten){
			++LyFM.audio_count;
			i=j;
			return true;
		}
	}
	i=j;
	return false;	
}
function is_video_ext_name(exten){
	exten = exten.toLowerCase();
	j=i;
	for(i=0;i<VideoFileExtenName.length;i++){
		if(VideoFileExtenName[i]==exten){
			++LyFM.video_count;
			i=j;
			return true;
		}
	}
	i=j;
	return false;	
}
function is_linux(){
	return (LyFM.file_list['os'].toLowerCase()=='linux');
}
jQuery.cookie = function(name, value, options) {
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