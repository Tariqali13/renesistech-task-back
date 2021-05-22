const appRoot = require('app-root-path');

module.exports = {
  calculateApiTime: async (time) => {
    let milliseconds = parseInt((time % 1000) / 100);
     let seconds = Math.floor((time / 1000) % 60);
    let minutes = Math.floor((time / (1000 * 60)) % 60);
      minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    const duration = minutes + 'm' + ':' + seconds + 's' + ':' + milliseconds + 'ms';
    return duration;
  },
}
