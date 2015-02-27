<?php

namespace FunctionParser\IntegrationTest;

use FunctionParser\FunctionParser;

class FunctionParserTest extends \PHPUnit_Framework_TestCase
{
    public function testParseSimpleFunctionWorksCorrectly()
    {
        $bar = 'baz';
        $doSomething = function($foo) use ($bar)
        {
            for ($i = 0, $n = rand(7, 17); $i < $n; $i++)
            {
                switch ($foo)
                {
                    case 'FOO':
                        echo 'foo';
                    break;

                    case 'BAR';
                        echo $bar;
                    break;

                    default:
                        echo "!!!";
                }
            }

            return (boolean) ($foo . $bar == 'FOOBAR');
        };

        $code = <<< 'CODE'
function($foo) use ($bar)
        {
            for ($i = 0, $n = rand(7, 17); $i < $n; $i++)
            {
                switch ($foo)
                {
                    case 'FOO':
                        echo 'foo';
                    break;

                    case 'BAR';
                        echo $bar;
                    break;

                    default:
                        echo "!!!";
                }
            }

            return (boolean) ($foo . $bar == 'FOOBAR');
        }
CODE;

        $parser = FunctionParser::fromCallable($doSomething);
        $this->assertEquals($code, $parser->getCode());
}

    public function testParseRecursiveFunctionWorksCorrectly()
    {
        $factorial = function($number) use (&$factorial)
        {
            if ($number == 0)
            {
                return 1;
            }
            else
            {
                return $number * $factorial($number - 1);
            }
        };

        $code = <<< 'CODE'
function($number) use (&$factorial)
        {
            if ($number == 0)
            {
                return 1;
            }
            else
            {
                return $number * $factorial($number - 1);
            }
        }
CODE;

        $parser = FunctionParser::fromCallable($factorial);
        $this->assertEquals($code, $parser->getCode());
    }

    /**
     * @expectedException \RuntimeException
     */
    public function testParsingFunctionsWithMultipleFunctionsPerLineThrowsException()
    {
        $a = function(){return 'a';};$b = function(){return 'b';};

        $parser = FunctionParser::fromCallable($a);
    }

    public function testParseFunctionWithNestedFunctionWorksCorrectly()
    {
        $getIncreaseByPercentFunction = function($percent)
        {
            return function($number) use($percent)
            {
                return $number + ($number * $percent / 100);
            };
        };

        $code = <<< 'CODE'
function($percent)
        {
            return function($number) use($percent)
            {
                return $number + ($number * $percent / 100);
            };
        }
CODE;

        $parser = FunctionParser::fromCallable($getIncreaseByPercentFunction);
        $this->assertEquals($code, $parser->getCode());
    }

    public function testParseNestedFunctionWorksCorrectly()
    {
        $getIncreaseByPercentFunction = function($percent)
        {
            return function($number) use($percent)
            {
                return $number + ($number * $percent / 100);
            };
        };

        $code = <<< 'CODE'
function($number) use($percent)
            {
                return $number + ($number * $percent / 100);
            }
CODE;

        $increaseBy50Percent = $getIncreaseByPercentFunction(50);
        $parser = FunctionParser::fromCallable($increaseBy50Percent);
        $this->assertEquals($code, $parser->getCode());
    }

    public function testParseFunctionWithCrazyStringInterpolationWorksCorrectly()
    {
        $doCrazyStringInterpolation = function($a, $b, $c, $d)
        {
            $string = "What are $a doing here? I am {$b} with my friend, ${c}. She has ${${$d}}. ";
            $heredoc = <<< HERE
What are $a doing here? I am {$b} with my friend, ${c}. She has ${${$d}}.
HERE;
            return $string . $heredoc;
        };

        $code = <<< 'CODE'
function($a, $b, $c, $d)
        {
            $string = "What are $a doing here? I am {$b} with my friend, ${c}. She has ${${$d}}. ";
            $heredoc = <<< HERE
What are $a doing here? I am {$b} with my friend, ${c}. She has ${${$d}}.
HERE;
            return $string . $heredoc;
        }
CODE;

        $parser = FunctionParser::fromCallable($doCrazyStringInterpolation);
        $this->assertEquals($code, $parser->getCode());
    }
}
