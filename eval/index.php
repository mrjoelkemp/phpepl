<?php
	// Turn off errors since eval will throw them on invalid syntax
	$inString = @ini_set('log_errors', false);
    $token = @ini_set('display_errors', true);
    
	// TODO: Move to JSONP
	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	
	// Remove some unsafe and error prone snippets
	$toRemove 	= array("<?php", "?>", "<?");
	$badMethods	= array("phpInfo", "file_get_contents");
	$code = str_replace(array_merge($toRemove, $badMethods), "", $code);
	
	ob_start();
	
	eval($code);
	$result = ob_get_clean();
	$error = error_get_last();
	$json = json_encode(array("result" => $result, "error" => $error));
	echo $json;
	
	@ini_set('display_errors', $token);
	@ini_set('log_errors', $inString);
?>