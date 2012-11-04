(function (window, document, $, undefined) {
	
  if (! $) throw new Error('jquery not found');

  var ace = window.ace,
      editor,
      devURL = 'http://localhost:8888/eval/index.php',
      liveURL = 'http://phpepl.cloudcontrolled.com/eval/index.php',
      
      processCode = function () {
        var code = editor.getValue();
                
        $.ajax({
          type: "POST",
          url: devURL, 
          data: {code: code},
          success: function (res) {
            $('.output span').html(res);
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
          code   = ! result ? "" : result;
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