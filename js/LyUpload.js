/*
LyFM
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
function LyUpload(){
	$("body").append(	'<div id="Upload_Box" style="display:none;">'+
							'<div class="title">'+
								'<button onClick="LyUpload.prototype.upload();">开始文件上传</button>'+
								'<button onClick="LyUpload.prototype.min_box();">最小化</button>'+
								'<button onClick="LyUpload.prototype.clear();">清空</button>'+
							'</div>'+
							'<div class="button"><input id="file_upload" name="file_upload" type="file" multiple="true" /></div>'+
							'<div id="Upload_Box_QueueID"></div>'+
						'</div>');
	$('#file_upload').uploadify({
		'auto'     : false,
		'formData'	:{'path' : NOW_PATH},
		'buttonText'	: '选择文件集',
		'queueID'	: 'Upload_Box_QueueID',
		'swf'      : FILE_URL + 'swf/uploadify.swf',
		'uploader' : 'Api/upload_file',
		'removeCompleted'	:	false,
		'onUploadSuccess' : function(file, data, response) {
            LyUpload.prototype.upLoad(file, data, response);
        }
	});
};
LyUpload.prototype = {
	open_box:function(){
		$("#Upload_Box").css("display","block");
		$("#Upload_Box").css("max-height",($(window).height()-(($(window).height()-$("#Upload_Box").height())/5.7)*2)+'px');
		this.center();
	},
	center:function(){
		$("#Upload_Box").css("top",(($(window).height()-$("#Upload_Box").height())/5.7)+'px');
		$("#Upload_Box").css("left",(($(window).width()-$("#Upload_Box").width())/1.7)+'px');
	},
	upload:function(){
		$("#file_upload").uploadify("settings", "formData", {'path':NOW_PATH});  
		$('#file_upload').uploadify('upload','*');
	},
	min_box:function(){
		$("#Upload_Box").css("display","none");
		$("#Upload_Button").html('还原上传对话框');
	},
	clear:function(){
		$('#file_upload').uploadify('cancel', '*');
	},
	upLoad:function(file, data, response){
		data = eval('('+data+')');
		if(data['status']){
			$("#" + file.id).find(".data").html(" - 上传完成");
			refresh_file();
		}else{
			$("#" + file.id).find(".data").html(" - <span style=\"color:red;\">"+data['error']+"</span>");
		}
	}
};