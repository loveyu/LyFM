<?php
class LibFile{
	private $file_char_set = array('UTF-8','GBK','GB2312','ASCII','UNICODE','BIG5','UCS-2','UCS-2LE','UCS-2BE');
	private $Media = array('jpg','jpeg','png','bmp','ico','gif','tif','tiff','mp3','mp4','avi','3gp','wav','ogg','mkv','pdf','rm','rmvb','wmv','mpg','vob','ts','flv','avi','f4v');
	private $order;
	private $order_by;
	public function get_file_list($path,$order='asc',$by='name'){
		$ret = array('path'=>'','os'=>get_core()->get_os(),'parent'=>'','file'=>array(),'dir'=>array(),'link'=>array(),'exists'=>true);
		$list = get_core('LyFile')->file_list($this->do_path($path));
		$ret['exists'] = is_dir(system_path($list['path']));
		$ret['is_read'] = is_readable(system_path($list['path']));
		$ret['path'] = $list['path'];
		$ret['parent'] = str_replace("\\","/",dirname($this->do_path($list['path'])));
		if($ret['is_read'] && $ret['exists'])$list = get_core('LyFile')->file_list($this->do_path($path));
		else $list = array('file'=>array(),'dir'=>array());
		$i=0;
		foreach($list['file'] as $file){
			$system = system_path($file);
			$ret['file'][$i] = array();
			$ret['file'][$i]['name'] = $this->get_basename($file);
			$ret['file'][$i]['path'] = $file;
			$ret['file'][$i]['size'] = get_core('LyFile')->file_size($system);
			$ret['file'][$i]['perms'] = substr(sprintf('%o', @fileperms($system)), -4);
			$ret['file'][$i]['owner'] = $this->get_file_owner($system);
			$ret['file'][$i]['group'] = $this->get_file_group($system);
			$ret['file'][$i]['owner_id'] = @fileowner($file);
			$ret['file'][$i]['group_id'] = @filegroup($system);
			$ret['file'][$i]['create'] = @filectime($system);
			$ret['file'][$i]['altera'] = @filemtime($system);
			$ret['file'][$i]['d_create'] = @date("Y年m月d日 H:i.s",$ret['file'][$i]['create']);
			$ret['file'][$i]['d_altera'] = @date("Y年m月d日 H:i.s",$ret['file'][$i]['altera']);
			$ret['file'][$i]['exten'] = @pathinfo($file,PATHINFO_EXTENSION);
			$i++;
		}
		$i=0;
		foreach($list['dir'] as $dir){
			$system = system_path($dir);
			$ret['dir'][$i] = array();
			$ret['dir'][$i]['name'] = $this->get_basename($dir);
			$ret['dir'][$i]['path'] = $dir;
			$ret['dir'][$i]['perms'] = substr(sprintf('%o', @fileperms($system)), -4);
			$ret['dir'][$i]['owner'] = $this->get_file_owner($system);
			$ret['dir'][$i]['group'] = $this->get_file_group($system);
			$ret['dir'][$i]['create'] = @filectime($system);
			$ret['dir'][$i]['altera'] = @filemtime($system);
			$ret['dir'][$i]['d_create'] = @date("Y年m月d日 H:i.s",$ret['file'][$i]['create']);
			$ret['dir'][$i]['d_altera'] = @date("Y年m月d日 H:i.s",$ret['file'][$i]['altera']);
			$ret['dir'][$i]['owner_id'] = @fileowner($file);
			$ret['dir'][$i]['group_id'] = @filegroup($system);
			$l2 = get_core('LyFile')->count_file_list($this->do_path($dir));
			$ret['dir'][$i]['file_number'] = $l2['file'];
			$ret['dir'][$i]['dir_number'] = $l2['dir'];
			$i++;
		}
		$this->order_list($ret['file'],$order,$by);
		$this->order_list($ret['dir'],$order,$by);
		return $ret;
	}

	public function order_cmp( $a, $b ) {
		$order_by = $this->order_by;
		if ( !isset( $a[ $order_by ] ) || !isset( $b[$order_by ] ) ) {
			$order_by = "name";
		}
		switch ( $order_by ) {
			case 'name':
				$c = strcmp( $a[ $order_by ], $b[ $order_by ] );
				break;
			case "size":
			case "create":
			case "altera":
				$c = $a[ $order_by ] -$b[ $order_by ];
				break;
			default:
				return 0;
		}
		if ( $this->order == "desc" ) {
			$c = 0 - $c;
		}
		return $c;
	}
	private function order_list(&$list,$order,$by){
		$this->order = strtolower(trim($order));
		$this->order_by = strtolower(trim($by));
		if(!in_array($this->order_by,array('name','size','create','altera')) || !in_array($this->order,array('asc','desc'))){
			return;
		}
		usort($list,[$this,'order_cmp']);
	}
	public function rename_one($path,$name){
		$rt = array('status'=>false);
		$path = $this->do_path($path);
		$name = str_replace("/","",$this->do_path($name));
		if(file_exists(system_path($path))){
			if(rename(system_path($path),system_path(dirname($path)."/".$name))){
				$rt['status'] = true;
			}
		}
		return $rt;
	}
	public function delete($path){
		$path = $this->do_path($path);
		$rt = array('status'=>false,'error'=>'','list' => array());
		if(file_exists(system_path($path))){
			$rt['status'] = get_core('LyFile')->delete_file_dir($path,$rt['list']);
		}else{
			$rt['error'] = '文件路径不存在';
		}
		return $rt;
	}
	public function move_file($path,$new_path){
		$path = system_path($this->do_path($path));
		$new_path = system_path($this->do_path($new_path));
		if(!is_dir($new_path)){
			return array('status'=>false,'error'=>'该目录不存在，无法移动！');
		}
		if(!is_file($path)){
			return array('status'=>false,'error'=>'原始文件不存在');
		}
		$new_file_path = $new_path."/".$this->get_basename($path);
		if(file_exists($new_file_path)){
			return array('status'=>false,'error'=>'目标文件已存在，移动失败!');
		}
		if(rename($path,$new_file_path)){
			return array('status'=>true,'error'=>'');
		}else{
			return array('status'=>false,'error'=>'文件移动出错');
		}
	}
	public function copy_file($path,$new_path){
		$path = system_path($this->do_path($path));
		$new_path = system_path($this->do_path($new_path));
		if(!is_dir($new_path)){
			return array('status'=>false,'error'=>'该目录不存在，无法复制！');
		}
		if(!is_file($path)){
			return array('status'=>false,'error'=>'原始文件不存在');
		}
		$new_file_path = $new_path."/".$this->get_basename($path);
		if(file_exists($new_file_path)){
			return array('status'=>false,'error'=>'目标文件已存在，复制失败!');
		}
		if(copy($path,$new_file_path)){
			return array('status'=>true,'error'=>'');
		}else{
			return array('status'=>false,'error'=>'文件移动出错');
		}
	}
	public function move_dir($path,$new_path){
		$path = system_path($this->do_path($path));
		$new_path = system_path($this->do_path($new_path));
		if(!is_dir($new_path)){
			return array('status'=>false,'error'=>'该目录不存在，无法移动！');
		}
		if(!is_dir($path)){
			return array('status'=>false,'error'=>'原始目录不存在');
		}
		if(strpos($new_path,$path)===0){
			return array('status'=>false,'error'=>'目录不允许存在于被移动文件目录中');
		}
		$new_file_path = $new_path."/".$this->get_basename($path);
		if(file_exists($new_file_path)){
			return array('status'=>false,'error'=>'目标文件夹已存在，移动失败!');
		}
		if(get_core('LyFile')->move_dir($path,$new_file_path)){
			return array('status'=>true,'error'=>'');
		}else{
			return array('status'=>false,'error'=>'文件夹移动出错');
		}
	}
	public function copy_dir($path,$new_path){
		$path = system_path($this->do_path($path));
		$new_path = system_path($this->do_path($new_path));
		if(!is_dir($new_path)){
			return array('status'=>false,'error'=>'该目录不存在，无法复制！');
		}
		if(!is_dir($path)){
			return array('status'=>false,'error'=>'原始目录不存在');
		}
		if(strpos($new_path,$path)===0){
			return array('status'=>false,'error'=>'目录不允许存在于被复制的文件目录中');
		}
		$new_file_path = $new_path."/".$this->get_basename($path);
		if(file_exists($new_file_path)){
			return array('status'=>false,'error'=>'目标文件夹已存在，复制失败!');
		}
		if(get_core('LyFile')->copy_dir($path,$new_file_path)){
			return array('status'=>true,'error'=>'');
		}else{
			return array('status'=>false,'error'=>'文件夹复制出错');
		}
	}
	public function mkdir($path,$name){
		if(empty($name)){
			return array('status'=>false,'error'=>'文件不能为空');
		}
		$path = system_path($this->do_path($path));
		$name = system_path($this->do_path($name));
		$dir_arr = explode("/",$name);
		foreach($dir_arr as $id => $v){
			$v = rtrim($v);
			if(!$v){
				unset($dir_arr[$id]);
			}else{
				$dir_arr[$id] = $v;
			}
		}
		$dir_arr = array_values($dir_arr);
		if(!count($dir_arr)){
			return array('status'=>false,'error'=>'输入的新文件夹名有误，或为空');
		}
		if(!is_dir($path)){
			return array('status'=>false,'error'=>'当前目录非法，或不存在');
		}
		if(file_exists($path."/".$dir_arr[0])){
			return array('status'=>false,'error'=>'目标路径文件或文件已存在');
		}
		foreach($dir_arr as $v){
			$path = $path."/".$v;
			if(!mkdir($path)){
				return array('status'=>false,'error'=>'创建文件夹'.$v.'失败');
			}
		}
		return array('status'=>true,'error'=>'');
	}
	public function zip_file($path,$zip_path){
		$time = new LyTime();
		$path = system_path($this->do_path($path));
		$zip_path = system_path($this->do_path($zip_path.".zip"));
		if(!file_exists($path)){
			return array('status'=>false,'error'=>'原始路径不存在');
		}
		if(file_exists($zip_path)){
			return array('status'=>fasle,'error'=>'目标文件 '+program_path($zip_path)+' 已经存在');
		}
		$time_begin = 0;
		$list = get_core('LyFile')->zip_file(dirname($path),$this->get_basename($path),$zip_path);
		$time_end = 1;
		if(empty($list)){
			return array('status'=>false,'error'=>'压缩失败，请检查路径或权限等问题');
		}else{
			return array('status'=>true,'error'=>'','list'=>$list,'time'=>$time->get_second().'秒');
		}
	}
	public function zip_more($path,$list,$zip_name){
		$time = new LyTime();
		$zip_path = system_path($this->do_path($path."/".$zip_name.".zip"));
		$path = system_path($this->do_path($path));
		if(!file_exists($path)){
			return array('status'=>false,'error'=>'原始路径不存在');
		}
		if(file_exists($zip_path)){
			return array('status'=>fasle,'error'=>'目标文件 '+program_path($zip_path)+' 已经存在');
		}
		$time_begin = 0;
		foreach($list as $id => $v){
			$list[$id] = system_path($this->do_path($v));
			if(!file_exists($path."/".$list[$id])){
				return array('status'=>fasle,'error'=>$v.' 压缩目标不存在');
			}
		}
		$list = get_core('LyFile')->zip_file($path,$list,$zip_path);
		$time_end = 1;
		if(empty($list)){
			return array('status'=>false,'error'=>'压缩失败，请检查路径或权限等问题');
		}else{
			return array('status'=>true,'error'=>'','list'=>$list,'time'=>$time->get_second().'秒');
		}
	}
	public function unzip_file($path,$unzip_path){
		$time = new LyTime();
		$path = system_path($this->do_path($path));
		$unzip_path = system_path($this->do_path($unzip_path));
		if(strtolower(pathinfo($path,PATHINFO_EXTENSION))!='zip')return array('status'=>false,'error'=>'zip路径有误');
		if(!is_file($path))return array('status'=>false,'error'=>'zip文件不存在');
		if(!is_dir($unzip_path))return array('status'=>false,'error'=>'解压目录不存在');
		$zip = new ZipArchive();
		if($zip->open($path) !== true)return array('status'=>false,'error'=>'打开压缩文件失败');
		if($zip->extractTo($unzip_path)!==true){
			$zip->close();
			 return array('status'=>false,'error'=>'文件解压失败');
		}else{
			$zip->close();
			return array('status'=>true,'error'=>'','time'=>$time->get_second().'秒');
		}
	}
	public function read_zip_file($path){
		$path = system_path($this->do_path($path));
		if(strtolower(pathinfo($path,PATHINFO_EXTENSION))!='zip')return array('status'=>false,'error'=>'zip路径有误');
		if(!is_file($path))return array('status'=>false,'error'=>'zip文件不存在');
		$zip = new ZipArchive;
		$list = array();
		if($zip->open($path)){
			for($i = 0; $i < $zip->numFiles; $i++){
				$list[] = $zip->getNameIndex($i);
			}
			$zip->close();
		}else{
			return array('status'=>false,'error'=>'ZIP文件打开失败');
		}
		return array('status'=>true,'error'=>'','list'=>$list);
	}
	private function do_path($path){
		if($path=='/')return '/';
		$path = preg_replace('/\\/+/',"/",str_replace("..","",str_replace("\\","/",$path)));
		if(substr($path,-1)=='/'){
			$path = substr($path,0,-1);
		}
		return $path;
	}
	private function get_file_owner($file){
		if(function_exists('posix_getpwuid'))
			return posix_getpwuid(@fileowner($file));
		else return '';
	}
	private function get_file_group($file){
		if(function_exists('posix_getpwuid'))
			return posix_getpwuid(@filegroup($file));
		else return '';
	}
	public function get_basename($filename){
		return preg_replace('/^.+[\\\\\\/]/', '', $filename);
    }
	public function get_file($file,$char_set="utf-8"){
		$file = system_path($this->do_path($file));
		$arr = array('status'=>false,'path'=>$file,'char_set'=>$char_set,'text'=>'','error'=>'');
		if(!is_file($file)){
			$arr['error']='文件不存在';
			return $arr;
		}
		$arr['text'] = $this->detect_encoding(file_get_contents($file),$arr['char_set'],$char_set);
		$arr['status'] = true;
		return $arr;
	}
	public function put_file($file,$charset,$content){
		$file = system_path($this->do_path($file));
		$arr = array('status'=>false,'error'=>'');
		if(!is_file($file)){
			$arr['error']='文件不存在';
			return $arr;
		}
		if(strtolower($charset)!='utf-8' && in_array(strtolower($charset),$this->file_char_set)){
			$content = mb_convert_encoding($content,$charset,'utf-8');
		}
		if(file_put_contents($file,$content)===false){
			$arr['error']='文件保存出错';
			return $arr;
		}
		$arr['status'] = true;
		return $arr;
	}
	public function make_file($path,$file){
		$file = system_path($this->do_path($path."/".$file));
		$arr = array('status'=>false,'error'=>'');
		if(file_exists($file)){
			$arr['error']='文件或路径已存在';
			return $arr;
		}
		if(file_put_contents($file,"")===false){
			$arr['error']='新建空白文件出错';
			return $arr;
		}
		$arr['status'] = true;
		return $arr;
	}
	public function get_media($path){
		$rt = array('status'=>false,'error'=>'','name'=>$this->get_basename($path));
		$path = system_path($this->do_path($path));
		$ext = pathinfo($path,PATHINFO_EXTENSION);
		if(!in_array(strtolower($ext),$this->Media)){
			$rt['error'] = '路径不合法';
			return $rt;
		}
		if(!is_file($path)){
			$rt['error'] = '文件不存在';
			return $rt;
		}
		$rt['length'] = get_core('LyFile')->file_size($path);
		if($rt['length']<0){
			$rt['error'] = '文件过大';
			return $rt;
		}
		get_core()->load_helper('mime');
		$rt['mime'] = mime_get(strtolower($ext));
		$rt['status']=true;
		$rt['path'] = $path;
		return $rt;
	}
	private function location_parse($url,$location){
		if(filter_var($location,FILTER_VALIDATE_URL)){
			return $location;
		}else{
			$info = parse_url($url);
			$host = $info['scheme']."://".(isset($info['user'])?($info['user'].(isset($info['pass'])?":".$info['pass']:"")."@"):"").$info['host'];
			if($location[0]=="/"){
				return $host.$location;
			}else{
				if($info['path'][strlen($info['path'])-1]=="/"){
					return $host.$info['path'].$location;
				}else{
					return $host.dirname($info['path'])."/".$location;
				}
			}
		}
	}
	public function url_download($path,$url,$name='',$deep=1){
		set_time_limit(0);
		$time = new LyTime();
		$rt = array('status'=>false,'error'=>'','name'=>'','size'=>'','time'=>'');
		if(!filter_var($url,FILTER_VALIDATE_URL)){
			$rt['error'] = 'URL地址不正确';
			return $rt;
		}else{
			$header = @get_headers($url,true);
			if(isset($header['Location']) && !empty($header['Location'])){
				if($deep>10){
					$rt['error'] = '过多的重定向，失败';
					return $rt;
				}
				return $this->url_download($path,$this->location_parse($url,$header['Location']),$name,$deep+1);
			}
			if(isset($header['Content-Length'])){
				if(is_array($header['Content-Length']))$length = array_pop($header['Content-Length']);
				else $length = $header['Content-Length'];
				if($length>get_config('MaxDlSize')){
					$rt['error'] = '数据大于 '.get_config('MaxDlSize')." 字节，禁止下载。";
					return $rt;
				}
			}
			if(!$name){
				if(isset($header['Content-Disposition'])){
					if(is_array($header['Content-Disposition']))$dis = array_pop($header['Content-Disposition']);
					else $dis = $header['Content-Disposition'];
					$i = strpos($dis,"filename=");
					if($i!==false){
						$name = substr($dis,$i+9);
					}
				}
				if(!$name){
					$name = $this->get_basename($url);
				}
			}
			unset($header);
		}
		$path = system_path($this->do_path($path));
		if(!is_dir($path)){
			$rt['error'] = '文件目录不存在';
			return $rt;
		}
		if(!is_writable($path)){
			$rt['error'] = '当前目录不可写';
			return $rt;
		}
		$fn = $path."/".system_path($this->do_path($name));
		if(file_exists($fn)){
			$rt['error'] = '目标文件已存在,请自定义其他文件名';
			return $rt;
		}
		$rt['name'] = $name;
		$max = get_config('MaxDlSize');
		$fp = @fopen($fn,'w');
		if(!$fp){
			$rt['error'] = '打开文件开始写入失败！';
			return $rt;
		}
		$dp = @fopen($url,'rb');
		if (!$dp){
			$rt['error'] = '开始下载失败！';
			unlink($fn);
			return $rt;
		}
		for ($size = 0; !feof($dp); $size += 1024) {
			$s = fread($dp,1024);
			if($s==false){
				fclose($dp);
				fclose($fp);
				unlink($fn);
				$rt['error'] = '网络读取错误！终止！';
				return $rt;
			}
			$ok = fwrite($fp,$s);
			if($ok==false){
				fclose($dp);
				fclose($fp);
				unlink($fn);
				$rt['error'] = '文件写入错误！终止！';
				return $rt;
			}
			if ($size > $max) {
				fclose($dp);
				fclose($fp);
				unlink($fn);
				$rt['error'] = '文件写入过大！终止！';
				return $rt;
			}
		}
		fclose($dp);
		fclose($fp);
		$rt['status'] = true;
		$rt['size'] = $size;
		$rt['time'] = $time->get_second().'秒';
		return $rt;
	}
	public function move_upload_file($path,$file){
		$rt = array('status'=>false,'error'=>'');
		if(!$file || !isset($file['error'])){
			$rt['error'] = '上传文件不存在';
			return $rt;
		}
		if($file['error']>0){
			$rt['error'] = '错误代码 '.$file['error'];
			return $rt;
		}
		$path = system_path($this->do_path($path."/".$file['name']));
		if(file_exists($path)){
			$rt['error'] = '目标文件已存在';
			return $rt;
		}
		if(!move_uploaded_file($file['tmp_name'],$path)){
			$rt['error'] = '移动文件失败';
			return $rt;
		}
		$rt['status'] = true;
		return $rt;
	}
	public function download_info($path){
		$rt = array('status'=>false,'error'=>'','name'=>$this->get_basename($path),'length'=>'','path'=>'');
		$path = system_path($this->do_path($path));
		if(!is_file($path)){
			$rt['error'] = '文件不存在';
			return $rt;
		}
		$rt['status']=true;
		$rt['length'] = get_core('LyFile')->file_size($path);
		$rt['path'] = $path;
		return $rt;
	}
	public function change_perms($path,$new_perms){
		$oct = octdec($new_perms);
		$rt = array('status'=>false,'error'=>'');
		$path = system_path($this->do_path($path));
		if(!file_exists($path)){
			$rt['error'] = '文件或文件夹不存在';
			return $rt;
		}
		if(!chmod($path,$oct)){
			$rt['error'] = '权限修改失败';
			return $rt;
		}else{
			$rt['status'] = true;
			return $rt;
		}
	}
	public function file_to_mail($path,$list,$more,$email,$method){
		set_time_limit(0);
		ob_start();
		$rt = array('status'=>false,'error'=>'','data'=>'');
		$mail = get_core()->load_c_lib('CLibMail');
		$mail->set_config(get_config('mail'));
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
			$rt['error'] = "错误的邮箱地址";
			return $rt;
		}
		$mail->AddAddress($email);
		if(empty($list) || !is_array($list)){
			$rt['error'] = "附件不存在";
			return $rt;
		}
		$mail->set_method($method);
		if($method=='smtp'){
			$mail->set_from(get_config('mailForm','add'),get_config('mailForm','name'));
		}
		$mail->get_mailer()->Subject = "PHP文件管理邮件发送";
		if(!$mail->AddAttachment($this->conv_path_to_system($path,$list),50000000)){
			$rt['error'] = "附件不存在或文件过大接近 50'0000'000 B";
			return $rt;
		}
		$mail->body(get_core('LyPost')->get('more')."\n<p>附件邮件,时间:".date('Y-m-d H:i:s')."</p>\n<p>".implode("<br />\n",get_core('LyPost')->get('list'))."</p>");
		$status = $mail->send();
		$rt['data'] = ob_get_contents();
		ob_clean();
		ob_end_flush();
		if($status===true){
			$rt['status'] = true;
		}else{
			if($status===false){
				$rt['error'] = "未知异常";
			}else{
				$rt['error'] = $status;
			}
		}
		return $rt;
	}
	public function change_more_perms($path,$list,$file="0644",$dir="0755",$re='false'){
		$path = system_path($this->do_path($path));
		$rt = array('status'=>false,'error'=>'');
		$file = octdec($file);
		$dir = octdec($dir);
		if(!file_exists($path)){
			$rt['error'] = '请求的文件夹不存在';
			return $rt;
		}
		foreach($list as $v){
			$v2 = system_path($this->do_path($v));
			if(is_file($path."/".$v2)){
				if(!chmod($path."/".$v2,$file)){
					$rt['error'] = $v.' 文件权限任务失败，导致部分任务失败';
					return $rt;
				}
			}else if(is_dir($path."/".$v2)){
				if($re=='false'){
					if(!chmod($path."/".$v2,$file)){
						$rt['error'] = $v.' 文件夹权限任务失败，导致部分任务失败';
						return $rt;
					}
				}else{
					$ex = get_core('LyFile')->recursion_change_perms($path."/".$v2,$file,$dir);
					if($ex!==false){
						$rt['error'] = $ex." 任务失败，导致部分任务异常";
						return $rt;
					}
				}
			}else{
				$rt['error'] = $v.' 不存在，部分任务失败';
			}
		}
		$rt['status'] = true;
		return $rt;
	}
	public function get_window_dirve(){
		$arr = array('status'=>false,'error'=>'','list'=>array());
		if(strtolower(get_core()->get_os())!='win'){
			$arr['error'] = '非Window文件系统无法使用该功能';
			return $arr;
		}
		for($i=ord('A');$i<=ord('Z');++$i){
			if(is_readable(chr($i).":")){
				array_push($arr['list'],chr($i).":");
			}
		}
		$arr['status'] = true;
		return $arr;
	}
	public function change_charset($path,$old_char,$new_char){
		$path = system_path($this->do_path($path));
		$rt = array('status'=>false,'error'=>'');
		if(!is_file($path)){
			$rt['error'] = '这不是一个文件';
			return $rt;
		}
		if(!is_readable($path)){
			$rt['error'] = '文件不可读';
			return $rt;
		}
		if(!is_writable($path)){
			$rt['error'] = '文件不可写入';
			return $rt;
		}
		$size = filesize($path);
		if($size>20971520 || $size<0){
			$rt['error'] = '文件大小限制在20M，避免内存泄露';
			return $rt;
		}
		@file_put_contents($path,@mb_convert_encoding(file_get_contents($path),$new_char,$old_char));
		$rt['status'] = true;
		return $rt;
	}
	public function conv_path_to_system($path,$arr){
		foreach($arr as $id => $v){
			$arr[$id] = system_path($this->do_path($path."/".$v));
		}
		return $arr;
	}
	private function detect_encoding($string,&$charset,$encoding = 'UTF-8'){
		//编码转换
		$charset = 'ASCII';
		foreach($this->file_char_set as $v){
			if($string==mb_convert_encoding(mb_convert_encoding($string,'UTF-8',$v),$v,'UTF-8')){
				$charset = $v;
				break;
			}
		}
		if(strtoupper($encoding)!=$charset){
			return mb_convert_encoding($string,$encoding,$charset);
		}else{
			return $string;
		}
	}
}
?>