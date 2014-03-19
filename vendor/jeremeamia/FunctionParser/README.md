# FunctionParser

The PHP Function Parser library by Jeremy Lindblom.

[![Build Status][travis-ci-status]][travis-ci]

## Purpose

The PHP FunctionParser provides the ability to parse and retrieve the code defining an existing function as a string.
This can be used in clever ways to generate documentation or example code or even to [serialize a closure][super-closure].

The class also allows you to get information about the function like the parameter names and the names and values of
variables in the `use` statement of a closure.

## General Use

The FunctionParser relies on the Reflection API and also on the PHP tokenizer (`token_get_all()`), so PHP must be
compiled with the `--enable-tokenizer` flag in order for the tokenizer to be available.

Here is a small example of how it works:
```php
use FunctionParser\FunctionParser;

$foo = 2;
$closure = function($bar) use($foo) {
    return $foo + $bar;
};

$parser = new FunctionParser(new \ReflectionFunction($closure));
$code   = $parser->getCode();
```
You can also use the `fromCallable` factory method as a convenient way to generate the reflected function automatically
from any PHP callable:
```php
$parser = FunctionParser::fromCallable(function($foo) {echo $foo . 'bar';});
$parser = FunctionParser::fromCallable('Foo::bar');
$parser = FunctionParser::fromCallable(array('Foo', 'bar'));
```
## Installation

The FunctionParser relies on the Reflection API and also on the PHP tokenizer (`token_get_all()`), so PHP must be
compiled with the `--enable-tokenizer` flag in order for the tokenizer to be available.

Requirements:

- **PHP 5.3.2+**
- **PHPUnit** for tests
- **Composer** for consuming FunctionParser as a dependency

To install FunctionParser as a dependency of your project using Composer, please add the following to your
`composer.json` config file.
```javascript
{
    "require": {
        "jeremeamia/FunctionParser": "*"
    }
}
```
Then run `php composer.phar install --install-suggests` from your project's root directory to install the FunctionParser.

## Building

There is a `buid.xml` file that you can use to generate test coverage reports, documenation, and code analytics. The
current file is designed to be used with `ant`, but I will be migrating this to `phing` sometime soon. More on this later.

The test suite and code coveage report are currently setup to run in Travis CI. [See FunctionParser on Travis CI]
[travis-ci]

## Links

- [FunctionParser on Travis CI][travis-ci]
- [FunctionParser on Packagist][packagist]
- [FunctionParser on Ohloh][ohloh]



[travis-ci-status]: https://secure.travis-ci.org/jeremeamia/FunctionParser.png?branch=master
[travis-ci]:        http://travis-ci.org/jeremeamia/FunctionParser
[super-closure]:    https://github.com/jeremeamia/super_closure
[packagist]:        http://packagist.org/packages/jeremeamia/FunctionParser
[ohloh]:            https://www.ohloh.net/p/php-function-parser