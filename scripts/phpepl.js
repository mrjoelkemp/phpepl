(function (window, document, $, undefined) {
	"use strict";
  if (! $) throw new Error('jquery not found');

  var ace = window.ace,
      editor,
      devURL = 'http://localhost:8888/eval/index.php',
      liveURL = 'http://phpepl.cloudcontrolled.com/eval/index.php',
      
      // Set the html of the output div
      setOutput = function (text) {
        $('.output span').html(text);
      },
      
      processCode = function () {
        var code = editor.getValue();
        window._gaq.push(['_trackEvent', 'Run']);
                
        $.ajax({
          type: "POST",
          //url: devURL, 
          url: liveURL, 
          data: {code: code},
          success: function (res) {
            setOutput(res);
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