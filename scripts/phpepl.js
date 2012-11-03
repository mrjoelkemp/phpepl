(function (window, document, $, undefined) {
	
  if (! $) throw new Error('jquery not found');

  var ace = window.ace,
      editor,
      
      processCode = function () {
        var code = editor.getValue();
                
        $.ajax({
          type: "POST",
          url: 'http://localhost:8888/eval/index.php', 
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
  });
})(window, document, window.jQuery);