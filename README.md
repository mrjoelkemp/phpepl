# PHPepl [![npm](http://img.shields.io/npm/v/phpepl.svg)](https://npmjs.org/package/phpepl) [![npm](http://img.shields.io/npm/dm/phpepl.svg)](https://npmjs.org/package/phpepl)

> The PHP Repl

### Motivation

I simply wanted an online repl that allowed me to play with *multiline* php scripts.
There's already a console-based repl `php -a`, but it and many other
console-based repls are not great for multiline snippets.

Folks have even been using `eval/index.php` as a sandboxed, php eval script to power their own services. Pretty awesome!

### Sandboxing

The online version of PHPepl is sandboxed. The exposed `eval` is sandboxed at the server configuration layer
plus some blacklisting of methods at the application level via [PHP-Sandbox](https://github.com/fieryprophet/php-sandbox).

This has, of course, crippled the tool a bit – as you can't run code that has blacklisted methods.
**For an unsandboxed experience, I recommend serving this app locally.**

*Big thanks to [Elijah Horton](https://twitter.com/ElijahHorton), creator of PHP-Sandbox, for his great sandbox
and assistance in maintaining PHPepl.*

### Running it locally

#### Vagrant

If you use vagrant, you can `vagrant up` within the phpepl root. This will spawn a virtual machine serving phpepl
at the `http://phpepl.dev` address.

You can also do `vagrant plugin install vagrant-hostsupdater` if you need to fetch the hostname from `/etc/hosts` or another host file.

#### Docker

If you use Docker, you can run `./docker-bootstrap` to start a container that serves the app using PHP5 and Apache.

To view the served app, visit the IP address of the host. Note, if you're using boot2docker, you need to visit the ip
found via the `boot2dock ip` command.

#### Manually

To serve this application locally, you'll need any php-capable web server:

* Mac: [MAMP](http://www.mamp.info/en/index.html)
* Windows: [WAMP](http://www.wampserver.com/en/)
* Or your own web server and php installation

Grab the source code for phpepl: fork this repo, download the source as a zip, or install via npm `npm install phpepl`.

You can then point your web server to serve files from the `phpepl/` root folder

* Namely, you should be able to visit the index page (`phpepl/index.html`) from `http://localhost` (include a custom port if necessary)
 * Ex: `http://localhost:8000/index.html` or simply `http://localhost:8000`, assuming your server is configured to listen to port 8000.

You'll then have free reign to execute any commands.

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

`js/phpepl.js` is the main script for the website. This gets built into a hashed `dist/phpepl.js`
which is referenced by `index.html`.

The php evaluation code is in `eval/index.php`.

That endpoint checks for the existence of a `PHPEPL_PROD` environment variable
(which is set on the production hosts) for sandboxing. Locally, you won't
have that set, so you'll have the unsandboxed version by default.

* With grunt running, that change should rebuild the app and you can just refresh the page.

### License: MIT

Copyright (C) 2014 by Joel Kemp <joel@mrjoelkemp.com> and others

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
