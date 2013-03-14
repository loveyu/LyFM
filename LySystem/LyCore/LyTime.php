<?php
/*
LyCore
Copyright (c) 2013 loveyu
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
class LyTime{
	private $begin_time;
	private $end_time;
	function __construct(){
		$this->start();
	}
	public function start(){
		$this->begin_time = $this->get_microtime();
		$this->end_time = 0;
	}
	public function get_microtime() 
    { 
        list($usec, $sec) = explode(' ', microtime()); 
        return ((float)$usec + (float)$sec); 
    }
	public function stop(){
		$this->end_time = $this->begin = $this->get_microtime();
	}
	public function get_second(){
		if($this->end_time==0)$this->stop();
		return round($this->end_time-$this->begin_time,5);
	}
	public function get_minute(){
		if($this->end_time==0)$this->stop();
		return round(($this->end_time-$this->begin_time)/60,5);
	}
	public function get_Millisecond(){
		if($this->end_time==0)$this->stop();
		return round(($this->end_time-$this->begin_time)*1000,5);
	}
}
?>