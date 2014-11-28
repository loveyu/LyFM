<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyFile{
	public function file_list($dir){
		if(substr($dir,-1)=='/' && $dir!='/')$dir = substr($dir,0,-1);
		$rt = array('file'=>array(),'dir'=>array(),'link'=>array(),'path'=>$dir);
		$dir = system_path($dir);
		if(!is_readable($dir))return $rt;
		if(!is_dir($dir))return $rt;
		$handle = opendir($dir);
		if(!$handle)return $rt;
		if($dir=='/')$dir='';
		while ($file = readdir($handle)) {
			if (($file == ".") || ($file == ".."))
			continue;
			if (is_dir("$dir/$file")){
				$rt['dir'][] = 	porgram_path("$dir/$file");
			}else if(is_file("$dir/$file")){
				$rt['file'][] = porgram_path("$dir/$file");
			}
		}
		closedir($handle);
		return $rt;
	}
	public function count_file_list($dir){
		$rt = array('file'=>0,'dir'=>0,'path'=>$dir);
		$dir = system_path($dir);
		if(!is_dir($dir) || !is_readable($dir))return $rt;
		$handle = opendir($dir);
		if(!$handle)return $rt;
		while ($file = readdir($handle)) {
			if (($file == ".") || ($file == ".."))
			continue;
			if (is_dir("$dir/$file")){
				$rt['dir']++;
			}else{
				$rt['file']++;
			}
		}
		closedir($handle);
		return $rt;	
	}
	public function delete_file_dir($path,&$list){
		$system_path = system_path($path);
		if(is_dir($system_path)){
			$handle = opendir($system_path);
			if(!$handle){
				array_push($list,array('status'=>false,'path'=>$path,'type'=>'dir'));
				return false;
			}
			while ($file = readdir($handle)) {
				if(($file == ".") || ($file == ".."))
					continue;
				if(!$this->delete_file_dir($path."/".porgram_path($file),$list)){
					return false;
				}
			}
			closedir($handle);
			$status = @rmdir($system_path);
			array_push($list,array('status'=>$status,'path'=>$path,'type'=>'dir'));
			if(!$status)return false;
		}elseif(is_file($system_path)){
			if(!is_writeable($system_path) || !@unlink($system_path)){
				array_push($list,array('status'=>false,'path'=>$path,'type'=>'file'));
				return false;
			}
		}
		return true;
	}
	public function recursion_change_perms($system_path,$file,$dir){
		//错误时返回 错误路径或信息，否则返回false
		//system path
		if(is_dir($system_path)){
			$handle = opendir($system_path);
			if(!$handle){
				return porgram_path($system_path).' 文件夹打开失败';
			}
			while ($f = readdir($handle)) {
				if(($f == ".") || ($f == ".."))
					continue;
				$this->recursion_change_perms($system_path."/".$f,$file,$dir);
				if(!chmod($system_path."/".$f,$dir)){
					return porgram_path($system_path);
				}
			}
			closedir($handle);
			if(!chmod($system_path,$dir)){
				return porgram_path($system_path);
			}
		}elseif(is_file($system_path)){
			if(!chmod($system_path,$file)){
				return porgram_path($system_path);
			}
		}else{
			return porgram_path($system_path).'文件夹或文件异常';
		}
		return false;
	}
	public function move_dir($path,$new_path){
		if(is_dir($path)){
			if(!file_exists($new_path)){
				if(!mkdir($new_path)){
					return false;
				}
			}else return false;
			$handle = opendir($path);
			if(!$handle){
				return false;
			}
			while ($file = readdir($handle)) {
				if(($file == ".") || ($file == ".."))
					continue;
				if(is_file($path."/".$file)){
					if(!rename($path."/".$file,$new_path."/".$file)){
						return false;
					}
				}elseif(is_dir($path."/".$file)){					
					if(!$this->move_dir($path."/".$file,$new_path."/".$file)){
						return false;
					}
				}
			}
			closedir($handle);
			if(!rmdir($path)){
				return false;
			}			
			return true;
		}else{
			return false;
		}
	}
	public function copy_dir($path,$new_path){
		if(is_dir($path)){
			if(!file_exists($new_path)){
				if(!mkdir($new_path)){
					return false;
				}
			}else return false;
			$handle = opendir($path);
			if(!$handle){
				return false;
			}
			while ($file = readdir($handle)) {
				if(($file == ".") || ($file == ".."))
					continue;
				if(is_file($path."/".$file)){
					if(!copy($path."/".$file,$new_path."/".$file)){
						return false;
					}
				}elseif(is_dir($path."/".$file)){					
					if(!$this->copy_dir($path."/".$file,$new_path."/".$file)){
						return false;
					}
				}
			}
			closedir($handle);		
			return true;
		}else{
			return false;
		}
	}
	public function zip_file($chdir,$path,$zip_file){
		//using system path
		if(!chdir($chdir)){
			return array();
		}
		$zip = new ZipArchive;
		if($zip->open($zip_file, ZipArchive::OVERWRITE) === TRUE){
			$rt = array();
			$arr = array();
			if(!is_array($path)){
				$arr[] = $path;
			}else{
				$arr = $path;
			}
			foreach($arr as $v){
				    if (is_dir($v)){
						array_push($rt,array('path'=>"dir:".porgram_path($v)));
						$this->zip_file_dir($v,$zip,$rt);
					}else{
						$zip->addFile($v);
						array_push($rt,array('path'=>"file:".porgram_path($v)));
					}
			}
			$zip->close();
			return $rt;
		}else{
			return array();
		}
	}
	public function file_size($path){
		//system path
		if(!is_file($path)){
			return -1;
		}
		$size = @filesize($path);
		if($size>=0)return $size;
		if(get_core()->get_os()=='Win'){
			if(function_exists('exec')){
				return exec('for %a in ("'.$path.'") do @echo %~za');
			}else{
				return -1;
			}
		}else{
			if(function_exists('exec')){
				return exec(' ls -l \''.$path.'\' | awk \'{ print $5 }\'');
			}else{
				return -1;
			}
		}
	}
	private function zip_file_dir($path,&$zip,&$list){
		$handle = opendir($path);
		if(!$handle){
			return false;
		}
		while ($file = readdir($handle)) {
			if(($file == ".") || ($file == ".."))
				continue;
			if(is_file($path."/".$file)){
				$zip->addFile($path."/".$file);
				array_push($list,array('path'=>"file:".porgram_path($path."/".$file)));
			}elseif(is_dir($path."/".$file)){	
				array_push($list,array('path'=>"dir:".porgram_path($path."/".$file)));				
				$this->zip_file_dir($path."/".$file,$zip,$list);
			}
		}
		closedir($handle);	
	}
}
?>