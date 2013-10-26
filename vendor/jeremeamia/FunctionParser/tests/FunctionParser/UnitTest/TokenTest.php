<?php

namespace FunctionParser\UnitTest;

use FunctionParser\Token;

class TokenTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @covers FunctionParser\Token::__construct
     */
    public function testConstructorAcceptsArrayOrString()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertInstanceOf('FunctionParser\Token', $token);

        $token = new Token('{');
        $this->assertInstanceOf('FunctionParser\Token', $token);
    }

    /**
     * @covers FunctionParser\Token::__construct
     * @expectedException \InvalidArgumentException
     */
    public function testConstructorThrowsExceptionOnBadArguments()
    {
        $token = new Token(array(100));
    }

    /**
     * @covers FunctionParser\Token::getName
     */
    public function testGettingTheNameReturnsAStringForNormalTokens()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertEquals($token->getName(), 'T_FUNCTION');
    }

    /**
     * @covers FunctionParser\Token::getName
     */
    public function testGettingTheNameReturnsNullForLiteralTokens()
    {
        $token = new Token('{');
        $this->assertEquals($token->getName(), null);
    }

    /**
     * @covers FunctionParser\Token::getCode
     */
    public function testGettingTheCodeReturnsStringOfCodeForAnyTokens()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertEquals($token->getCode(), 'function');

        $token = new Token('{');
        $this->assertEquals($token->getCode(), '{');
    }

    /**
     * @covers FunctionParser\Token::getLine
     */
    public function testGettingTheLineReturnsAnIntegerForLiteralTokens()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertEquals($token->getLine(), 2);
    }

    /**
     * @covers FunctionParser\Token::getLine
     */
    public function testGettingTheLineReturnsNullForLiteralTokens()
    {
        $token = new Token('{');
        $this->assertEquals($token->getValue(), null);
    }

    /**
     * @covers FunctionParser\Token::getValue
     */
    public function testGettingTheValueReturnsAnIntegerForLiteralTokens()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertEquals($token->getValue(), T_FUNCTION);
    }

    /**
     * @covers FunctionParser\Token::getValue
     */
    public function testGettingTheValueLineReturnsNullForLiteralTokens()
    {
        $token = new Token('{');
        $this->assertEquals($token->getLine(), null);
    }

    /**
     * @covers FunctionParser\Token::isOpeningBrace
     */
    public function testOpeningBracesAreIdentifiedCorrectly()
    {
        $token = new Token('}');
        $this->assertFalse($token->isOpeningBrace());

        $token = new Token('{');
        $this->assertTrue($token->isOpeningBrace());
    }

    /**
     * @covers FunctionParser\Token::isClosingBrace
     */
    public function testClosingBracesAreIdentifiedCorrectly()
    {
        $token = new Token('{');
        $this->assertFalse($token->isClosingBrace());

        $token = new Token('}');
        $this->assertTrue($token->isClosingBrace());
    }

    /**
     * @covers FunctionParser\Token::isOpeningParenthesis
     */
    public function testOpeningParenthesesAreIdentifiedCorrectly()
    {
        $token = new Token(')');
        $this->assertFalse($token->isOpeningParenthesis());

        $token = new Token('(');
        $this->assertTrue($token->isOpeningParenthesis());
    }

    /**
     * @covers FunctionParser\Token::isClosingParenthesis
     */
    public function testClosingParenthesesAreIdentifiedCorrectly()
    {
        $token = new Token('(');
        $this->assertFalse($token->isClosingParenthesis());

        $token = new Token(')');
        $this->assertTrue($token->isClosingParenthesis());
    }

    /**
     * @covers FunctionParser\Token::isLiteralToken
     */
    public function testLiteralTokensAreIdentifiedCorrectly()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertFalse($token->isLiteralToken());

        $token = new Token('{');
        $this->assertTrue($token->isLiteralToken());
    }

    /**
     * @covers FunctionParser\Token::is
     */
    public function testTokensAreIdentifiedCorrectlyByCodeOrValue()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));

        $this->assertTrue($token->is(T_FUNCTION));
        $this->assertTrue($token->is('function'));
        $this->assertFalse($token->is(T_VARIABLE));
        $this->assertFalse($token->is('foo'));
    }

    /**
     * @covers FunctionParser\Token::serialize
     * @covers FunctionParser\Token::unserialize
     */
    public function testSerializingAndUnserializingDoesNotAlterToken()
    {
        $token        = new Token(array(T_FUNCTION, 'function', 2));
        $serialized   = serialize($token);
        $unserialized = unserialize($serialized);
        $this->assertEquals($token, $unserialized);
    }

    /**
     * @covers FunctionParser\Token::__isset
     * @covers FunctionParser\Token::__get
     * @covers FunctionParser\Token::__set
     */
    public function testGettersAndSettersWorkCorrectly()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertTrue(isset($token->name));
        $this->assertEquals($token->getName(), $token->name);
        $token->name = 'foo';
        $this->assertEquals($token->getName(), 'foo');
    }

    /**
     * @covers FunctionParser\Token::__get
     * @expectedException \OutOfBoundsException
     */
    public function testGetterThrowsExceptionOnBadKey()
    {
        $token = new Token('{');
        $foo = $token->foo;
    }

    /**
     * @covers FunctionParser\Token::__set
     * @expectedException \OutOfBoundsException
     */
    public function testSetterThrowsExceptionOnBadKey()
    {
        $token = new Token('{');
        $token->foo = 'foo';
    }

    /**
     * @covers FunctionParser\Token::__toString
     */
    public function testConvertingToStringReturnsTheTokenCode()
    {
        $token = new Token(array(T_FUNCTION, 'function', 2));
        $this->assertEquals((string) $token, $token->getCode());
    }
}
