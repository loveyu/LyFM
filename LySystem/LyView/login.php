<div id="login">
<fieldset>
	<legend><h1>个人账户密码认证</h1></legend>
	<form action="<?php echo get_url('Login/post')?>" method="post">
<?php if(get_core('LyGet')->get('status')=='error'):?>
	<p class="error">登录失败，密码错误！</p>
<?php endif;?>
		<label>
			<h2>输入密码:</h2>
			<input class="password" name="password" value="" type="password" />
		</label>
		<button class="submit" type="submit">确认</button>
		<input name="redirect" value="<?php echo urldecode(get_core('LyGet')->get('redirect'))?>" type="hidden" />
	</form>
</fieldset>
</div>
<script type="text/javascript">
$(document).ready(function(e) {
	$.getScript(FILE_URL+"js/jquery.md5.js");
	$("#login input[name=\"password\"]").focus();
});
$("#login form").submit(function(){
	$("#login form input[name=\"password\"]").val($.md5($("#login form input[name=\"password\"]").val()));
	return true;
});
</script>