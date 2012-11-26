<?php
	// Turn off errors since eval will throw them on invalid syntax
	$inString = @ini_set('log_errors', false);
	$token = @ini_set('display_errors', true);
	
	// CORS support
	header("Access-Control-Allow-Origin: *");
	header("Content-type: application/json");
	
	$code = $_POST['code'];
	
	// Naively remove some unsafe and error prone snippets
	$toRemove 	= array("<?php", "?>", "<?");
	$badMethods	= array("phpInfo", "file_get_contents");
	$code = str_replace(array_merge($toRemove, $badMethods), "", $code);
	
	// Simple output buffering to capture
	// error messages and send them to the user
	ob_start();
	
	eval($code);
	$result = ob_get_clean();
	$error = error_get_last();
	$json = json_encode(array("result" => $result, "error" => $error));
	echo $json;
	
	@ini_set('display_errors', $token);
	@ini_set('log_errors', $inString);
?>