<?php
        // Turn off errors since eval will throw them on invalid syntax
        $inString       = @ini_set('log_errors', false);
        $token          = @ini_set('display_errors', true);

        // CORS support
        header("Access-Control-Allow-Origin: *");
        header("Content-type: application/json");

        $code = $_POST['code'];

        // Remove error prone snippets
        $toRemove = array("<?php", "?>", "<?");

        $code = str_replace($toRemove, "", $code);

        // Simple output buffering to capture
        // error messages and send them to the user
        ob_start();

        eval($code);
        $result = ob_get_clean();
        $error = error_get_last();

        echo getJsonOutput(array(
                'result' => $result,
                'error' => $error
        ));

        @ini_set('display_errors', $token);
        @ini_set('log_errors', $inString);

        function getJsonOutput($options) {
                $result = $options['result'];
                $error         = $options['error'];
                return json_encode(array("result" => $result, "error" => $error));
        }
?>