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