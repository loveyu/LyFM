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