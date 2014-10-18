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