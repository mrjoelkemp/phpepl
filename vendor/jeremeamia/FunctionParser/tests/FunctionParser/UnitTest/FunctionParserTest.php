<?php

namespace FunctionParser\UnitTest;

use FunctionParser\FunctionParser;

class FunctionParserTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \FunctionParser\FunctionParser The function parser instance
     */
    public $functionParser;

    public function setup()
    {
        $iterations = 0;
        $function = function($multiplier) use(&$iterations) {
            return $multiplier * $iterations++;
        };

        $this->functionParser = FunctionParser::fromCallable($function);
    }

    /**
     * Data provider for testFromCallableAcceptsAnyCallableType
     */
    public function dataFromCallableAcceptsAnyCallableType()
    {
        return array(
            array(array('\FunctionParser\FunctionParser', 'fromCallable')),
            array('\FunctionParser\FunctionParser::fromCallable'),
            array('\FunctionParser\UnitTest\foo'),
            array(function() {return true;}),
        );
    }

    /**
     * @covers FunctionParser\FunctionParser::fromCallable
     * @covers FunctionParser\FunctionParser::__construct
     * @dataProvider dataFromCallableAcceptsAnyCallableType
     */
    public function testFromCallableAcceptsAnyCallableType($callable)
    {
        if (!function_exists('\FunctionParser\UnitTest\foo'))
        {
            function foo() {return true;}
        }

        $parser = FunctionParser::fromCallable($callable);
        $this->assertInstanceOf('\FunctionParser\FunctionParser', $parser);
    }

    /**
     * Data provider for testFromCallableThrowsExceptionForInvalidArgs
     */
    public function dataFromCallableThrowsExceptionForInvalidArgs()
    {
        return array(
            array('foobar'),
            array(5),
            array('array_key_exists'),
            array('\SplStack::shift'),
        );
    }

    /**
     * @covers FunctionParser\FunctionParser::fromCallable
     * @covers FunctionParser\FunctionParser::__construct
     * @dataProvider dataFromCallableThrowsExceptionForInvalidArgs
     * @expectedException \InvalidArgumentException
     */
    public function testFromCallableThrowsExceptionForInvalidArgs($callable)
    {
        $parser = FunctionParser::fromCallable($callable);
    }

    /**
     * @covers FunctionParser\FunctionParser::getReflection
     */
    public function testGetReflectionReturnsReflectionFunctionObject()
    {
        $this->assertInstanceOf('\ReflectionFunctionAbstract', $this->functionParser->getReflection());
    }

    /**
     * @covers FunctionParser\FunctionParser::getName
     */
    public function testGetNameReturnsTheFunctionName()
    {
        if (!function_exists('\FunctionParser\UnitTest\foo'))
        {
            function foo() {return true;}
        }

        $parser = FunctionParser::fromCallable('\FunctionParser\UnitTest\foo');

        $this->assertEquals('FunctionParser\UnitTest\foo', $parser->getName());
    }

    /**
     * @covers FunctionParser\FunctionParser::getName
     */
    public function testGetNameReturnsNullIfClosure()
    {
        $this->assertNull($this->functionParser->getName());
    }

    /**
     * @covers FunctionParser\FunctionParser::getParameters
     * @covers FunctionParser\FunctionParser::fetchParameters
     */
    public function testGetParametersReturnsParameterNamesForFunction()
    {
        $this->assertEquals(array('multiplier'), $this->functionParser->getParameters());
    }

    /**
     * @covers FunctionParser\FunctionParser::getTokenizer
     * @covers FunctionParser\FunctionParser::fetchTokenizer
     */
    public function testGetTokenizerReturnsTheTokenzier()
    {
        $this->assertInstanceOf('\FunctionParser\Tokenizer', $this->functionParser->getTokenizer());
    }

    /**
     * @covers FunctionParser\FunctionParser::getCode
     * @covers FunctionParser\FunctionParser::parseCode
     */
    public function testGetCodeReturnsTheActualCode()
    {
        $code = 'function($multiplier) use(&$iterations) {
            return $multiplier * $iterations++;
        }';

        $this->assertEquals($code, $this->functionParser->getCode());
    }

    /**
     * @covers FunctionParser\FunctionParser::parseCode
     * @expectedException \RuntimeException
     */
    public function testGetCodeThrowsExceptionWhenThereAreMultipleFunctionsPerLine()
    {
        $function = function() {return true;};function() {return false;};
        $parser = FunctionParser::fromCallable($function)->getCode();
    }

    /**
     * @covers FunctionParser\FunctionParser::getBody
     * @covers FunctionParser\FunctionParser::parseBody
     */
    public function testGetBodyReturnsOnlyTheInnerPartOfTheCode()
    {
        $code = '            return $multiplier * $iterations++;';

        $this->assertEquals($code, $this->functionParser->getBody());
    }

    /**
     * @covers FunctionParser\FunctionParser::getContext
     * @covers FunctionParser\FunctionParser::parseContext
     */
    public function testGetContextReturnsTheClosuresContext()
    {
        $this->assertEquals(array('iterations'), array_keys($this->functionParser->getContext()));
    }

    /**
     * @covers FunctionParser\FunctionParser::getClass
     */
    public function testGetClassReturnsNullForNonMethods()
    {
        $this->assertNull($this->functionParser->getClass());
    }

    /**
     * @covers FunctionParser\FunctionParser::getClass
     */
    public function testGetClassReturnsTheClassNameForMethods()
    {
        $parser = FunctionParser::fromCallable('\FunctionParser\FunctionParser::getClass');
        $this->assertEquals('FunctionParser\FunctionParser', $parser->getClass()->getName());
    }
}
