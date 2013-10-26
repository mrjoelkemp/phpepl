<?php
	// require_once('../vendor/autoload.php');
	// Turn off errors since eval will throw them on invalid syntax
	$inString = @ini_set('log_errors', false);
	$token = @ini_set('display_errors', true);
	
	// CORS support
	header("Access-Control-Allow-Origin: *");
	header("Content-type: application/json");
	
	$code = $_POST['code'];
	
	// Naively remove some unsafe and error prone snippets
	$toRemove 	= array("<?php", "?>", "<?");
	$badMethods	= array("phpinfo", "file_get_contents", "exec", "passthru", 
						"system", "shell_exec", "`", "popen", "proc_open", 
						"pcntl_exec", "eval", "assert", "create_function", 
						"include", "include_once", "require", "require_once", "$_GET", 
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
						"get_meta_tags"
				);
	
	foreach ($badMethods as $baddie) {
		// If the code contains a bad word		
		if (strpos($code, $baddie) !== false) {
			echo getJsonOutput(array(
				'error' => array(
					'message' 	=> "The use of $baddie is not allowed."
				)
			));
			exit;
		}
	}
	
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
		$error 	= $options['error'];
		return json_encode(array("result" => $result, "error" => $error));
	}
?>