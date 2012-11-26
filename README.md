PHPepl
======

[The PHP Repl](http://phpepl.cloudcontrolled.com/)

Created by: [@mrjoelkemp](http://www.twitter.com/mrjoelkemp)

### Purpose

I simply wanted an online repl that allowed me to
play with multiline scripts that explored various PHP apis. There's already a console-based repl `php -a`, but it (and many other console-based repls) is not so great for multiline snippets.

I've used this quick hack a ton since building it. I hope other people get some use out of it as well.

### Sandboxing

The exposed `eval` is sandboxed at the server configuration layer. I really didn't want to spend too much time failing at sandboxing a language that I'm still learning. My hosting provider, cloudcontrolled, does a pretty good job at preventing use of the "dangerous" PHP methods.

### Chrome Plugin

https://chrome.google.com/webstore/detail/phpepl/aklmibnemhffjijocdnnphcifkdjabkc

I really wanted a Chrome extension that I could open by a keyboard shortcut to run a quick snippet within any page. The keyboard shortcut has yet to be implemented, but the rest of the plugin works.

