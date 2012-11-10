(function (window, document, $, undefined) {
	"use strict";
  if (! $) throw new Error('jquery not found');

  var ace = window.ace,
      editor,
      devURL = 'http://localhost:8888/eval/index.php',
      liveURL = 'http://phpepl.cloudcontrolled.com/eval/index.php',
      
      // Set the html of the output div
      // TODO: allow flag to set error class
      setOutput = function (text) {
        var isError = !! arguments[1],
            $output = $('.output span');
        
        // Remove error classes if any
        $output.html(text).removeClass('error');
        
        if (isError) {
          $output.addClass('error');
        }
      },
      
      // Highlights the line in the gutter with the error
      showLineError = function (line) {

        // Find the dom element in the ace gutter
        $('.ace_gutter-cell').each(function (idx) {
          // If the cell's line number matches the error line
          if (Number($(this).html()) === line) {
            // Make the background red
            $(this).addClass('error-gutter');
            return;
          }
        });
      },
      
      processCode = function () {
        var code = editor.getValue();
        
        if (! code.length) {
          setOutput("Please supply some code...");
          return;  
        }
        
        $.ajax({
          type: "POST",
          // url: devURL,
          url: liveURL, 
          data: {code: code},
          dataType: 'json',
          success: function (res) {
            if (! res) return;
            
            var result  = res.result,
                error   = res.error,
                errorMsg;

            if (error) {
              // Show the line in red
              showLineError(error.line);
              // Show the error message
              errorMsg = "Line " + error.line + ": " + error.message;
              setOutput(errorMsg, true);
              return;
            }
            setOutput(result);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            setOutput("Whoopsie daisies!"); 
          }
        }); 
      };
      
  $(function () {
    editor = ace.edit('editor');
    editor.setTheme('ace/theme/textmate');
    editor.getSession().setMode('ace/mode/php');
    
    $('.submit button').click(function () {
      processCode();
    });
    
    $(document).keydown(function (e) {    
      if(e.which === 13 && (e.ctrlKey || e.metaKey)) {        
        processCode();
        e.preventDefault();
      }
    });
  
    // Preload where you last left off
    if (window.localStorage) {
      var result = localStorage.getItem('code'),
          code   = ! result ? 'echo "PHPepl";' : result;
      editor.setValue(code);
    }
    
    $(window).unload(function () {
      // Remember your last code
      if (window.localStorage) {
        var code = editor.getValue();
        localStorage.setItem('code', code);
      }
    });
  });
})(window, document, window.jQuery);