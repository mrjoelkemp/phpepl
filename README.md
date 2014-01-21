PHPepl
======

[The PHP Repl](http://phpepl.cloudcontrolled.com/)

Created by: [@mrjoelkemp](http://www.twitter.com/mrjoelkemp)

### Purpose

I simply wanted an online repl that allowed me to
play with *multiline* scripts that explored various PHP apis.
There's already a console-based repl `php -a`, but it and many other
console-based repls are not great for multiline snippets.

I've used this quick hack a ton since building it. I hope you get some use out of it as well.

### Running it locally

The online version of PHPepl is sandboxed. The exposed `eval` is sandboxed at the server configuration layer
plus some blacklisting of methods at the application level via [PHP-Sandbox](https://github.com/fieryprophet/php-sandbox).

This has, of course, crippled the tool and makes it not as useful – as whitelisting methods is a pain.
I recommend serving this app locally.

To serve this application locally, you'll need a web server and PHP:

* Mac: [MAMP](http://www.mamp.info/en/index.html)
* Windows: [WAMP](http://www.wampserver.com/en/)

You can then point your apache server to serve files from the `/phpepl` root folder

* Namely, you should be able to visit the app (`/phpepl/index.html`) from `http://localhost` (include a custom port if necessary)

The app will automatically disable the sandbox and give you free reign over the REPL to
execute any commands.

### Contact Me

If you hit any errors or if someone hacked the repl and it goes down, give
me a shout on Twitter: [@mrjoelkemp](https://twitter.com/mrjoelkemp)

Close to 100 people use this REPL every day; don't ruin it for them. Please play nice.

### License

MIT