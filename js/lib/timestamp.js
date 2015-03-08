/**
 * Returns a pretty timestamp (only time)
 * @return {String}
 */
module.exports = function() {
  var now = new Date();
  var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
  var suffix = time[0] < 12 ? 'AM' : 'PM';

  // Convert hour from military time
  time[0] = time[0] < 12 ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
  time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = '0' + time[i];
    }
  }

  return time.join(':') + ' ' + suffix;
}