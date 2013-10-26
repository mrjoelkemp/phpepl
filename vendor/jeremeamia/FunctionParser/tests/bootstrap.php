<?php

error_reporting(-1);

// Ensure that composer has installed all dependencies
if (!file_exists(dirname(__DIR__) . DIRECTORY_SEPARATOR . 'composer.lock')) {
    die("Dependencies must be installed using composer:\n\ncomposer.phar install --install-suggests\n\n"
        . "See https://github.com/composer/composer/blob/master/README.md for help with installing composer\n");
}

require_once 'PHPUnit/TextUI/TestRunner.php';

// Include the composer autoloader
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . '.composer' . DIRECTORY_SEPARATOR . 'autoload.php';
