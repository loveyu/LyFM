<?php
class Api{
	private $file_lib;
	function __construct(){
		$this->file_lib = get_lib('LibFile');
	}
	public function main(){
		get_lib('LibTemplate')->set_title('API 列表');
		get_core()->view('header');
		get_core()->view('api_list');
		get_core()->view('footer');
	}
	public function file_list(){
		//获取文件夹内文件和文件夹列表
		$rt = $this->file_lib->get_file_list(get_core('LyGet')->get('path'));
		$this->out_json($rt);
	}
	public function rename(){
		//文件或文件夹重命名
		$rt = $this->file_lib->rename_one(get_core('LyGet')->get('path'),get_core('LyGet')->get('name'));
		$this->out_json($rt);
	}
	public function delete(){
		//删除文件或文件夹
		$rt = $this->file_lib->delete(get_core('LyGet')->get('path'));
		$this->out_json($rt);	
	}
	public function move_file(){
		//移动文件或文件夹
		$type = get_core('LyGet')->get('type');
		$rt = array('status'=>false,'error'=>'移动类型不明确');
		if($type=='file'){
			$rt = $this->file_lib->move_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('new_path'));
		}elseif($type=='dir'){
			$rt = $this->file_lib->move_dir(get_core('LyGet')->get('path'),get_core('LyGet')->get('new_path'));
		}
		$this->out_json($rt);
	}
	public function copy_file(){
		//复制文件或文件夹
		$type = get_core('LyGet')->get('type');
		$rt = array('status'=>false,'error'=>'复制类型不明确');
		if($type=='file'){
			$rt = $this->file_lib->copy_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('new_path'));
		}elseif($type=='dir'){
			$rt = $this->file_lib->copy_dir(get_core('LyGet')->get('path'),get_core('LyGet')->get('new_path'));
		}
		$this->out_json($rt);		
	}
	public function mkdir(){
		//在当前目录创建文件夹
		$rt = $this->file_lib->mkdir(get_core('LyGet')->get('path'),get_core('LyGet')->get('name'));
		$this->out_json($rt);		
	}
	public function zip_file(){
		//zip压缩单个文件或目录到指定文件
		$rt = $this->file_lib->zip_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('zip_path'));
		$this->out_json($rt);		
	}
	public function zip_more(){
		//压缩多个文件或文件夹到当前目录的指定文件名
		$rt = $this->file_lib->zip_more(get_core('LyPost')->get('path'),get_core('LyPost')->get('list'),get_core('LyPost')->get('zip_name'));
		$this->out_json($rt);
	}
	public function unzip_file(){
		//解压zip文件到指定已存在的目录
		$this->out_json($this->file_lib->unzip_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('unzip_path')));
	}
	public function read_zip_file(){
		//读取zip文件内容列表
		$this->out_json($this->file_lib->read_zip_file(get_core('LyGet')->get('path')));
	}
	public function get_file(){
		//指定编码返回文件内容
		$rt = $this->file_lib->get_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('char_set'));
		$this->out_json($rt);
	}
	public function put_file(){
		//将内容写入文件
		$rt = $this->file_lib->put_file(get_core('LyPost')->get('path'),get_core('LyPost')->get('char_set'),get_core('LyPost')->get('content'));
		$this->out_json($rt);
	}
	public function mk_file(){
		//创建一个空文件
		$rt = $this->file_lib->make_file(get_core('LyGet')->get('path'),get_core('LyGet')->get('name'));
		$this->out_json($rt);
	}
	public function window_dirve(){
		//获取window的驱动器列表
		$this->out_json($this->file_lib->get_window_dirve());
	}
	public function change_charset(){
		//文件编码转换
		$this->out_json($this->file_lib->change_charset(get_core('LyGet')->get('path'),get_core('LyGet')->get('old_char'),get_core('LyGet')->get('new_char')));
	}
	public function mail_file(){
		//邮件发送文件
		$this->out_json($this->file_lib->file_to_mail(get_core('LyPost')->get('path'),get_core('LyPost')->get('list'),get_core('LyPost')->get('more'),get_core('LyPost')->get('email'),get_core('LyPost')->get('method')));
	}
	public function get_media(){
		//获取一个媒体文件
		$rt = $this->file_lib->get_media(get_core('LyGet')->get('path'));
		if(!$rt['status']){
			header("content-Type: text/plain; charset=utf-8");
			echo ($rt['error']);
			return;
		}
		if(is_array($rt['mime'])){
			header("content-Type: ".$rt['mime'][0]);
		}else if($rt['mime']!==false){
			header("content-Type: ".$rt['mime']);
		}
		header("Content-Length: ".$rt['length']);
		header("Content-Disposition:filename=".$rt['name']);
		flush();
		$fp = fopen($rt['path'], "r");
		while(!feof($fp))
		{
			echo fread($fp, 65536); 
			flush();
		}  
		fclose($fp);
	}
	public function get_ajax_media(){
		//获取一个能够展示的html5多媒体页面
		header("content-Type: text/html; charset=utf-8");
		switch(strtolower(get_core('LyGet')->get('type'))){
			case 'video':
				echo '<video style="width:99.9%;height:97%;" src="',get_url('Api/get_media?path='),get_core('LyGet')->get('path'),'" controls="controls"></video>';
			break;
			case 'audio':
				echo '<audio src="',get_url('Api/get_media?path='),get_core('LyGet')->get('path'),'" controls="controls"></audio>';
			break;
			default:
				echo "<p class=\"error\">未知类型</p>";
		}
	}
	public function run_code(){
		//执行任意代码，返回输出数据
		header("content-Type: text/plain; charset=utf-8");
		eval(get_core('LyPost')->get('code'));
	}	
	public function url_download(){
		//URL远程下载文件到网站
		$this->out_json($this->file_lib->url_download(get_core('LyGet')->get('path'),get_core('LyGet')->get('url'),get_core('LyGet')->get('name')));
	}
	public function file_download(){
		//下载网站任意文件到计算机
		$rt = $this->file_lib->download_info(get_core('LyGet')->get('path'));
		if(!$rt['status']){
			header("content-Type: text/plain; charset=utf-8");
			echo ($rt['error']);
			return;
		}
		if($rt['length']<0){
			header("content-Type: text/plain; charset=utf-8");
			echo "文件过大或其他情况导致数据出错，无法下载";
			return;
		}
		header("Content-Disposition: attachment; filename=".$rt['name']);   
		header("Content-Type: application/force-download;");
		header("Content-Length: ".$rt['length']);
		flush();
		$fp = fopen($rt['path'], "r"); 
		while (!feof($fp))
		{
			echo fread($fp, 65536); 
			flush();
		}  
		fclose($fp);
	}
	public function change_perms(){
		//修改文件或目录单级权限
		$this->out_json($this->file_lib->change_perms(get_core('LyGet')->get('path'),get_core('LyGet')->get('new_perms')));
	}
	public function chmod_more(){
		//对文件系统的多个文件进行文件权限批量或递归修改
		$this->out_json($this->file_lib->change_more_perms(get_core('LyPost')->get('path'),get_core('LyPost')->get('list'),get_core('LyPost')->get('file_mode'),get_core('LyPost')->get('dir_mode'),get_core('LyPost')->get('r')));
	}
	public function upload_file(){
		//单个文件上传
		$this->out_json($this->file_lib->move_upload_file(get_core('LyPost')->get('path'),isset($_FILES['Filedata'])?$_FILES['Filedata']:""));
	}
	private function out_json($content){
		header("content-Type: application/json; charset=utf-8");
		echo json_encode($content);
	}
}

?>