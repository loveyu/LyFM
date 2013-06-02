<?php
class LibMenu{
	private $menu;
	function __construct(){
		$this->menu = array();
	}
	public function set(){
		$args = func_get_args();
		$this->menu = array_merge($args,$this->menu);
	}
	public function the_menu($begin,$end,$all_class,$page_class,$now){
		foreach($this->get_menu() as $v){
			echo $begin,"<a href=\"",$v['url'],"\"",($all_class || $v['page_select'] || $v['now_select'])?(" class=\"".(($all_class)?"$all_class ":"").(($v['page_select'] && $page_class)?"$page_class ":"").(($v['now_select'] && $now)?"$now":"")."\""):"",">",$v['name'],"</a>$end";
		}
	}
	public function get_menu(){
		$path = array_values(get_core('LyUrl')->get_req_list());
		if(empty($path))$path = array('/');
		$rt = array();
		$i = 0;
		foreach($this->menu as $m_id => $v){
			if(!isset($v['url']) && !isset($v['page'])){
				unset($this->menu[$m_id]);
				continue;
			}
			$rt[$i]['name'] = $v['name'];
			$rt[$i]['url'] = (isset($v['url'])?$v['url']:get_url($v['page']));
			$rt[$i]['page_select'] = false;
			$rt[$i]['now_select'] = false;
			$v['page'] = array_values($v['page']);
			$flag = false;
			foreach($v['page'] as $id => $v2){
				if(isset($path[$id]) && $v2==$path[$id]){
					$flag = true;
				}else{
					$flag = false;
					break;
				}
			}
			if($flag){
				$rt[$i]['page_select'] = true;
				if(count($v['page'])==count($path)){
					$rt[$i]['now_select'] = true;
				}
			}
			$i++;
		}
		return $rt;
	}
}
?>