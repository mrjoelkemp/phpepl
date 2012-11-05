<?php

	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	
	// Remove some unsafe and error prone snippets
	$toRemove = array("<?php", "?>", "<?");
	$bad = array("phpInfo", "file_get_contents");
	
	$code = str_replace($toRemove, "", $code);
	
	foreach ($bad as $badword) {
		$pos = strpos($code, $badword);
		if (! pos) {
			$code = 'echo "Butts";';
		}
	}
	
	// TODO: Need to prevent the parse error from bade code.
	eval($code);
?>