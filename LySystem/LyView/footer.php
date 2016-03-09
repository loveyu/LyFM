

</div>
<div id="footer">
	<p>&copy;<span>loveyu.org</span>&nbsp;&nbsp;<a href="http://www.loveyu.net/LyFm">LyFM PHP文件管理器</a><?php if($_LibLogin->is_login()):?>&nbsp;&nbsp;&nbsp;&nbsp;( 当前版本: <?php echo VERSION?> )<?php endif;?></p>
</div>
</div>
</body>
<?php if($_LibLogin->is_login() && $_LibTemplate->is_home()):?>
<!--移除多文件加载方式，使用单文件加载
<script type="text/javascript" src="<?php echo get_file_url('js/LyApi.js')?>"></script>
<script type="text/javascript" src="<?php echo get_file_url('js/load.js')?>"></script>
<script type="text/javascript" src="<?php echo get_file_url('js/LyEdit.js')?>"></script>
<script type="text/javascript" src="<?php echo get_file_url('js/LyUpload2.js')?>"></script>
<script type="text/javascript" src="<?php echo get_file_url('js/LyCode.js')?>"></script>
-->
<script type="text/javascript" src="<?php echo get_file_url('js/full.min.js')?>"></script>
<script type="text/javascript" src="<?php echo get_file_url('edit_area/edit_area_full.js')?>"></script>
<?php endif;?>
<script type="text/javascript" src="<?php echo get_file_url('js/jquery.colorbox-min.js')?>"></script>
</html>