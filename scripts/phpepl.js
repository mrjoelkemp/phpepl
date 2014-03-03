(function (window, document, $, moment) {
  'use strict';

  var
      // Detect the port that localhost is running on
      port        = window.location.host.split(':')[1] || '80',
      origin      = (window.location.origin.indexOf(':') !== -1 ?
                    window.location.origin :
                    window.location.origin + ':' + port),
      // No sandbox on your local server
      devUnsafe   = origin + '/eval/unsafe.php',
      // Sanboxed on your local server (really only for testing live-env locally)
      dev         = origin + '/eval/index.php',
      // Sandboxed on the remote (online) server
      live        = 'http://phpepl.cloudcontrolled.com/eval/index.php',

      // Safeguard to always use the live eval on the remote server
      // and the unsafe dev version otherwise.
      isLiveEnv   = window.location.host === 'phpepl.cloudcontrolled.com',
      evalURL     = isLiveEnv ? live : devUnsafe,

      mixpanel    = window.mixpanel || {},
      editor;

  // HELPERS
  var
      // Set the html of the output div
      setOutput = function (text) {
        var isError = !! arguments[1],
            $output = $('.output span');

        // Remove error classes if any
        $output.html(text).removeClass('error');

        if (isError) $output.addClass('error');

        // Turn off the spinner
        $('.spinner').fadeOut('fast');
        // Set the timestamp
        $('.timestamp').find('span').html(moment(new Date().getTime()).format('h:mm a'));
      },

      // Highlights the line in the gutter with the error
      showLineError = function (line) {
        // Find the dom element in the gutter
        $('.CodeMirror-linenumber').each(function () {
          // If the cell's line number matches the error line
          if (Number($(this).html()) === line) {
            // Make the background red
            $(this).addClass('error-gutter');
            return;
          }
        });
      },

      // Helper to show the fatal errors nicely
      // Returns a list of the error text and line number that
      // generated the error.
      // Note: Implementation is fairly naive but works
      getPrettyFatalErrorMessage = function (responseText) {
        if (! responseText.length) return;

        var text = responseText,
            tokensToReplace = ['\n', /<br \/>/g, /<b>/g,
                                /<\/b>/g, /(Fatal error: +)/g],
            splitTokens, err, line, lineNum;

        // If the error message doesn't contain 'fatal error',
        // then just print it
        if (! responseText.toLowerCase().indexOf('fatal error')) {
          return [responseText, 1];
        }

        $.each(tokensToReplace, function (idx, val) {
          text = text.replace(val, '');
        });

        splitTokens = text.split('in');
        err = splitTokens[0].trim();
        splitTokens = text.split('on');
        line = splitTokens[1].trim();

        text = (err + ' on ' + line).trim();

        lineNum = line.split(' ');
        lineNum = Number(lineNum[1]);

        return [text, lineNum];
      },

      sendingCode = function (code) {
        return $.ajax({
          type: 'POST',
          url: evalURL,
          data: { code: code },
          dataType: 'json'
        });
      },

      // Handles the sending of the code to the eval server
      processCode = function () {
        var code = editor.getValue();

        if (! code.length) {
          setOutput('Please supply some code...');
          return;
        }

        $('.spinner').fadeIn('fast');

        // Track it
        mixpanel.track('Code Run', {'code': code});

        sendingCode(code)
          .done(function (res) {
            if (! res) return;

            var result    = res.result,
                error     = res.error,
                errorMsg  = '';

            if (error) {
              if (error.line && error.message) {
                // Show the line in red
                showLineError(error.line);

                // Show the error message
                errorMsg = 'Line ' + error.line + ': ';
              }

              errorMsg += error.message;

              setOutput(errorMsg, true);
              return;
            }

            setOutput(result);
          })
          .fail(function (error) {
            if (! error) return;

            var textLine = getPrettyFatalErrorMessage(error.responseText);

            setOutput(textLine[0], true);
            showLineError(textLine[1]);
            mixpanel.track('Error', {'error' : error.responseText});
          });
      };

  // Local storage helpers
  var
      saveCode = function () {
        if (window.localStorage) {
          var code = editor.getValue();
          localStorage.setItem('code', code);

          // Show the saved message
          $('.timestamp')
            .find('span')
              .html('Code Saved!');

          mixpanel.track('Code Saved');
        }
      },
      loadSavedCode = function () {
        // Preload where you last left off
        if (window.localStorage) {
          var greeting = 'echo "We\'re running php version: " . phpversion();',
              result = localStorage.getItem('code'),
              code   = ! result ? greeting : result;
          editor.setValue(code);
        }
      };

  // Set up the editor
  editor = window.CodeMirror($('#editor')[0], {
    lineNumbers: true,
    matchBrackets: true,
    mode: 'text/x-php',
    indentUnit: 2,
    tabSize: 2,
    autofocus: true,
    autoCloseBrackets: true
  });

  loadSavedCode();

  $('.submit button').click(processCode);

  $(document).keydown(function (e) {
    // CMD + Enter or CTRL + Enter to run code
    if (e.which === 13 && (e.ctrlKey || e.metaKey)) {
      processCode();
      e.preventDefault();
    }

    // CMD + S or CTRL + S to save code
    if (e.which === 83 && (e.ctrlKey || e.metaKey)) {
      saveCode();
      e.preventDefault();
      mixpanel.track('Save Shortcut');
    }
  });

  // Remember the code in the editor
  // before navigating away
  $(window).unload(saveCode);

})(window, document, window.jQuery, window.moment);