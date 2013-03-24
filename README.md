PHPepl
======

[The PHP Repl](http://phpepl.cloudcontrolled.com/)

Created by: [@mrjoelkemp](http://www.twitter.com/mrjoelkemp)

### Purpose

I simply wanted an online repl that allowed me to
play with multiline scripts that explored various PHP apis. There's already a console-based repl `php -a`, but it (and many other console-based repls) is not so great for multiline snippets.

I've used this quick hack a ton since building it. I hope other people get some use out of it as well.

### Sandboxing

The exposed `eval` is sandboxed at the server configuration layer plus some blacklisting of methods at the application level.

Please play nice.
