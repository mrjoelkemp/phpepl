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
	
	// Parse the code using token_get_all and process the tokens
	// to determine if there's a syntax error. 
	// Eval the code and output buffer to prevent leaking the error msg
	function php_syntax_error($code) {
	    $braces = 0;
	    $inString = 0;

	    // First of all, we need to know if braces are correctly balanced.
	    // This is not trivial due to variable interpolation which
	    // occurs in heredoc, backticked and double quoted strings
	    foreach (token_get_all('<?php ' . $code) as $token) {
	        if (is_array($token)) {
	            switch ($token[0]) {
		            case T_CURLY_OPEN:
		            case T_DOLLAR_OPEN_CURLY_BRACES:
		            case T_START_HEREDOC: ++$inString; break;
		            case T_END_HEREDOC:   --$inString; break;
	            }
	        }
	        else if ($inString & 1) {
	            switch ($token) {
		            case '`':
		            case '"': --$inString; break;
	            }
	        }
	        else {
	            switch ($token) {
		            case '`':
		            case '"': ++$inString; break;

		            case '{': ++$braces; break;
		            case '}':
		                if ($inString) --$inString;
		                else {
		                    --$braces;
		                    if ($braces < 0) break 2;
		                }

		                break;
		            }
	     	   }
	    }

	    // Display parse error messages and use output buffering to catch them
	    $inString = @ini_set('log_errors', false);
	    $token = @ini_set('display_errors', true);
	    ob_start();

	    // If $braces is not zero, then we are sure that $code is broken.
	    // We run it anyway in order to catch the error message and line number.

	    // Else, if $braces are correctly balanced, then we can safely put
	    // $code in a dead code sandbox to prevent its execution.
	    // Note that without this sandbox, a function or class declaration inside
	    // $code could throw a "Cannot redeclare" fatal error.

	    $braces || $code = "if(0){{$code}\n}";

	    if (false === eval($code))
	    {
	        if ($braces) $braces = PHP_INT_MAX;
	        else
	        {
	            // Get the maximum number of lines in $code to fix a border case
	            false !== strpos($code, "\r") && $code = strtr(str_replace("\r\n", "\n", $code), "\r", "\n");
	            $braces = substr_count($code, "\n");
	        }

	        $code = ob_get_clean();
	        $code = strip_tags($code);

	        // Get the error message and line number
	        if (preg_match("'syntax error, (.+) in .+ on line (\d+)$'s", $code, $code))
	        {
	            $code[2] = (int) $code[2];
	            $code = $code[2] <= $braces
	                ? array($code[1], $code[2])
	                : array('unexpected $end' . substr($code[1], 14), $braces);
	        }
	        else $code = array('syntax error', 0);
	    }
	    else
	    {
	        ob_end_clean();
	        $code = false;
	    }

	    @ini_set('display_errors', $token);
	    @ini_set('log_errors', $inString);

	    return $code;
	}
	
	
?>