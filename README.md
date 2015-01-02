# PHPepl [![npm](http://img.shields.io/npm/v/phpepl.svg)](https://npmjs.org/package/phpepl) [![npm](http://img.shields.io/npm/dm/phpepl.svg)](https://npmjs.org/package/phpepl)

> The PHP Repl

### Motivation

I simply wanted an online repl that allowed me to play with *multiline* php scripts.
There's already a console-based repl `php -a`, but it and many other
console-based repls are not great for multiline snippets.

I've used this quick hack a ton since building it. I hope you get some use out of it as well.

### Sandboxing

The online version of PHPepl is sandboxed. The exposed `eval` is sandboxed at the server configuration layer
plus some blacklisting of methods at the application level via [PHP-Sandbox](https://github.com/fieryprophet/php-sandbox).

This has, of course, crippled the tool a bit – as you can't run code that has blacklisted methods.
**For an unsandboxed experience, I recommend serving this app locally.**

### Running it locally

To serve this application locally, you'll need any php-capable web server:

* Mac: [MAMP](http://www.mamp.info/en/index.html)
* Windows: [WAMP](http://www.wampserver.com/en/)
* Or your own web server and php installation

Grab the source code for phpepl: fork this repo, download the source as a zip, or install via npm `npm install phpepl`.

You can then point your web server to serve files from the `phpepl/` root folder

* Namely, you should be able to visit the index page (`phpepl/index.html`) from `http://localhost` (include a custom port if necessary)
 * Ex: `http://localhost:8000/index.html` or simply `http://localhost:8000`, assuming your server is configured to listen to port 8000.

**You then need to disable sandboxing** by toggling the `$sandbox_me` var in `src/eval/index.php` to disable the sandbox locally.
You'll then have free reign to execute any commands.

#### Vagrant

If you use vagrant, you can `vagrant up` within the phpepl root. This will spawn a virtual machine serving phpepl
at the `http://phpepl.dev` address.

You can also do `vagrant plugin install vagrant-hostsupdater` if you need to fetch the hostname from `/etc/hosts` or another host file.

### Contact Me

If you hit any errors or if someone hacked the repl and it goes down, give
me a shout on Twitter: [@mrjoelkemp](https://twitter.com/mrjoelkemp)

Close to 100 people use this REPL every day; don't ruin it for them. Please play nice.

### Contribute

This app uses Browserify for bundling and Grunt for task running.

If you'd like to tinker around with the code, you can do the following:

* Clone the repo
* `npm install` in the root directory
* `grunt`
* Point your browser to your localhost (assuming you have the app being [served locally](#running-it-locally))

`src/phpepl.js` is the main script for the website. This gets built into `dist/phpepl.js`
which is referenced by `phpepl/index.html`.

The php evaluation code is in `src/eval/index.php`. That endpoint is sandboxed by default,
so toggle the `$sandbox_me` var in `src/eval/index.php` to disable the sandbox locally.

* With grunt running, that change should rebuild the app and you can just refresh the page.

### License

MIT
