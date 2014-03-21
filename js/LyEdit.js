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