<?php

namespace Demo;

// Include the autoloader
require_once __DIR__.'/../vendor/autoload.php'

use FunctionParser\FunctionParser;

class Math
{
    public function square($num)
    {
        return $num * $num;
    }
}

$parser = FunctionParser::fromCallable('Demo\\Math::square');

echo "METHOD:" . PHP_EOL;
echo $parser->getClass()->getName() . '::' . $parser->getName() . '()' . PHP_EOL;
echo PHP_EOL;

echo "INNER CODE:" . PHP_EOL;
echo trim($parser->getBody()) . PHP_EOL;
echo PHP_EOL;
