// http://stackoverflow.com/a/1099670/700897
module.exports = function(qs) {
  qs = qs.split('+').join(' ');

  var params = {};
  var tokens;
  var re = /[?&]?([^=]+)=([^&]*)/g;
  var token1;

  tokens = re.exec(qs);

  while (tokens) {
    token1 = decodeURIComponent(tokens[1]);
    params[token1] = decodeURIComponent(tokens[2]);
    tokens = re.exec(qs);
  }

  return params;
};
