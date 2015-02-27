<?php

namespace Demo;

// Include the autoloader
require_once __DIR__.'/../vendor/autoload.php'

use FunctionParser\FunctionParser;
use ReflectionFunction;

$foo = 2;
$closure = function($bar) use($foo) {
    return $foo + $bar;
};

$parser = new FunctionParser(new ReflectionFunction($closure));

echo "CODE:" . PHP_EOL;
echo $parser->getCode() . PHP_EOL;
echo PHP_EOL;

echo 'PARAMETERS:' . PHP_EOL;
var_dump($parser->getParameters());
echo PHP_EOL;

echo 'CLOSURES:' . PHP_EOL;
var_dump($parser->getContext());
echo PHP_EOL;
