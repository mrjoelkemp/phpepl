<?php

	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	
	// Remove some unsafe and error prone snippets
	$toRemove = array("<?php", "?>", "<?");
	$bad = array("phpInfo", "file_get_contents");
	
	$code = str_replace($toRemove, "", $code);
	$code = str_replace($bad, 'print', $code);
	
	// TODO: Need to prevent the parse error from bade code.
	eval($code);
?>