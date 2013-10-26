PHPepl
======

[The PHP Repl](http://phpepl.cloudcontrolled.com/)

Created by: [@mrjoelkemp](http://www.twitter.com/mrjoelkemp)

### Purpose

I simply wanted an online repl that allowed me to
play with multiline scripts that explored various PHP apis. 
There's already a console-based repl `php -a`, but it and many other 
console-based repls are not great for multiline snippets.

I've used this quick hack a ton since building it. I hope you get some use out of it as well.

### Sandboxing

The exposed `eval` is sandboxed at the server configuration layer 
plus some blacklisting of methods at the application level via [PHP-Sandbox](https://github.com/fieryprophet/php-sandbox).

Close to 100 people use this REPL every day; don't ruin it for them. Please play nice.

### Contact Me

If you hit any errors or if someone hacked the repl and it goes down, give
me a shout on Twitter: [@mrjoelkemp](https://twitter.com/mrjoelkemp)


License: MIT