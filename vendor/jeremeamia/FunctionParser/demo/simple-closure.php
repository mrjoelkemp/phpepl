<?php

// Include the autoloader
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . '.composer'
    . DIRECTORY_SEPARATOR . 'autoload.php';

use FunctionParser\FunctionParser;

$foo = 2;
$closure = function($bar) use($foo) {
    return $foo + $bar;
};

$parser = new FunctionParser(new \ReflectionFunction($closure));

echo "CODE:" . PHP_EOL;
echo $parser->getCode() . PHP_EOL;
echo PHP_EOL;

echo 'PARAMETERS:' . PHP_EOL;
var_dump($parser->getParameters());
echo PHP_EOL;

echo 'CLOSURES:' . PHP_EOL;
var_dump($parser->getContext());
echo PHP_EOL;
