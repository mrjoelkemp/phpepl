<?php

	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	
	// Remove some unsafe and error prone snippets
	$toRemove = array("<?php", "?>", "<?", "phpInfo()", "file_get_contents");
	$code = str_replace($toRemove, "", $code);
	
	// TODO: Need to prevent the parse error from bade code.
	eval($code);
?>