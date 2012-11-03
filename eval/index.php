<?php

	header("Access-Control-Allow-Origin: *");
	
	$code = $_POST['code'];
	// $result = eval($code);
	eval($code);
	
	// error_log("Eval Result: $result");
	
	// HTML Responses
	// $OK = 200;
	// $BAD_CODE = 400;
	// // Result to be returned to the caller
	// $res = array('response' => '', 'output' => '');
	
	// // Nothing to return
	// if (is_null($result)) {
	// 	$res['response'] = $OK;
	// }
	
	// // Error generated
	// else if(! $result) {
	// 	// Bad request
	// 	$res['response'] = $BAD_CODE;
	// }
	
	// else {
	// 	$res['response'] = $OK;
	// 	$res['output'] = $result;
	// }
	// echo json_encode($res);
?>