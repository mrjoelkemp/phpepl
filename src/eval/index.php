<?php
	// Only production environments will have this set – turning on sandboxing
	// DEP_VERSION is for cloud control
	$sandbox_me = isset($_ENV['PHPEPL_PROD']) || isset($_ENV['DEP_VERSION']);
	require_once('../../vendor/autoload.php');

	// Turn off errors since eval will throw them on invalid syntax
	@ini_set('log_errors', false);
	@ini_set('display_errors', true);

	//set time limit to avoid long-running scripts killing our server process
	set_time_limit(1);

	// CORS support
	header("Access-Control-Allow-Origin: *");
	header("Content-type: application/json");

	// No need for the open and close php tags
	$toRemove 	= array("<?php", "?>", "<?");
	$code = str_replace($toRemove, "", $_POST['code']);

	// Brilliant method for even catching fatal_errors
	register_shutdown_function("on_script_finish");

	// Output buffering to catch the results and errors
	ob_start();
	echo $sandbox_me? php_execute_sandboxed($code):php_execute_raw($code);
	// output is captured in on_script_finished as script shuts down
	// END MAIN


	// Handler that executes on script completion
	function on_script_finish() {
		// http://stackoverflow.com/a/2146171/700897
		$result = ob_get_clean();
		$error = error_get_last();

		echo json_encode(array("result" => $result, "error" => $error));
	}

	function php_execute_sandboxed($code) {
		// Blacklist
		$blackList	= array("phpinfo", "file_get_contents", "exec", "passthru",
							"system", "shell_exec", "`", "popen", "proc_open",
							"pcntl_exec", "eval", "assert", "create_function",
							"include", "include_once", "require", "require_once",
							"ReflectionFunction", "posix_mkfifo", "posix_getlogin", "posix_ttyname", "getenv",
							"get_current_user", "proc_get_status", "get_cfg_var", "disk_free_space", "disk_total_space",
							"diskfreespace", "getcwd", "getlastmo", "getmygid", "getmyinode", "getmypid", "getmyuid",
							"extract", "parse_str", "putenv", "ini_set", "mail", "header", "proc_nice", "proc_terminate",
							"proc_close", "pfsockopen", "fsockopen", "apache_child_terminate", "posix_kill",
							"posix_mkfifo", "posix_setpgid", "posix_setsid", "posix_setuid", "fopen", "tmpfile", "bzopen",
							"gzopen", "SplFileObject", "chgrp", "chmod", "chown", "copy", "file_put_contents",
							"lchgrp", "lchown", "link", "mkdir", "move_uploaded_file", "rename", "rmdir", "symlink",
							"tempnam", "touch", "unlink", "imagepng", "imagewbmp", "image2wbmp", "imagejpeg", "imagexbm",
							"imagegif", "imagegd", "imagegd2", "iptcembed", "ftp_get", "ftp_nb_get", "file_exists",
							"file_get_contents", "file", "fileatime", "filectime", "filegroup", "fileinode", "filemtime",
							"fileowner", "fileperms", "filesize", "filetype", "glob", "is_dir", "is_executable", "is_file",
							"is_link", "is_readable", "is_uploaded_file", "is_writable", "is_writeable", "linkinfo", "lstat",
							"parse_ini_file", "pathinfo", "readfile", "readlink", "realpath", "stat", "gzfile",
							"readgzfile", "getimagesize", "imagecreatefromgif", "imagecreatefromjpeg", "imagecreatefrompng",
							"imagecreatefromwbmp", "imagecreatefromxbm", "imagecreatefromxpm", "ftp_put", "ftp_nb_put",
							"exif_read_data", "read_exif_data", "exif_thumbnail", "exif_imagetype", "hash_file", "hash_hmac_file",
							"hash_update_file", "md5_file", "sha1_file", "highlight_file", "show_source", "php_strip_whitespace",
							"get_meta_tags", "set_time_limit", "call_user_func", "call_user_func_array"
					);

		$whiteList = array('print_r', 'preg_match', 'preg_replace', 'preg_match_all');

		$sandbox = new \PHPSandbox\PHPSandbox();
		$sandbox->blacklist_func($blackList);
		// $sandbox->whitelist_func($whiteList);
		$sandbox->allow_functions = true;
		$sandbox->allow_closures = true;
		$sandbox->allow_constants = true;
		$sandbox->allow_aliases = true;
		$sandbox->allow_interfaces = true;
		$sandbox->allow_casting = true;
		$sandbox->allow_classes = true;
		$sandbox->error_level = false;

		//rewrite preg_replace function to override attempts to use PREG_REPLACE_EVAL
		$sandbox->define_func('preg_replace', function($pattern, $replacement, $subject, $limit = -1, &$count = null){
		    if(is_array($pattern)){
		    	foreach($pattern as $_pattern){
			    if(strtolower(substr($_pattern, -1)) == 'e'){
			        throw new Exception("Can not use PREG_REPLACE_EVAL!");
			    }
		    	}
		    } else if(strtolower(substr($pattern, -1)) == 'e'){
		        throw new Exception("Can not use PREG_REPLACE_EVAL!");
		    }
		    return preg_replace($pattern, $replacement, $subject, $limit, $count);
		});

		$sandbox->execute($code);
	}

	function php_execute_raw($code) {
		eval($code);
	}
