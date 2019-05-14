/** Miscellaneous */
var misc = {};

/** Formatted output */
misc.output = out => {
  if (out) {
    $('.term-input').before('<div class="term-history">' + out);
  }
};

/** Call given command  */
misc.callCmd = (cmd, args = '') => {
  if (cmd) {
    cmdHist.push(cmd + ' ' + args);

    return cmd in commands
      ? commands[cmd](args)
      : cmd + ' not found in commands';
  }
};

/** Init the history for a given input */
misc.initHistory = input => {
  input.onkeydown = evt => {
    // UP => most recent to oldest entry
    var arrowUp = evt.keyCode === 38;
    // DOWN => oldest to most recent
    var arrowDwn = evt.keyCode === 40;

    if ((arrowUp || arrowDwn) && cmdHist.length > 0) {
      evt.preventDefault();

      // Only allows to go up to enter history entries
      if (input.value === '') {
        histIndex = arrowUp ? cmdHist.length : cmdHist.length - 1;
      }

      if (arrowUp && histIndex !== 0) {
        input.value = cmdHist[--histIndex];
      } else if (arrowDwn && histIndex !== cmdHist.length - 1) {
        input.value = cmdHist[++histIndex];
      }
    }
  };
};

/** Commands that can be use in terminal */
var commands = {};

/** Commands history */
var cmdHist = ['a', 'b', 'c'];

/** History index */
var histIndex;

/** Clear terminal entries */
commands.clear = () => {
  if ($('.term-history')) {
    $('.term-history').remove();
  }
};

/** Print help in terminal */
commands.help = () => {
  console.log('help');
};

/** Open a module */
commands.open = module => {
  console.log('open module ' + module);
};

/** Login player */
commands.login = () => {
  console.log('login');
};

/** Print history in terminal */
commands.history = () => {
  console.log('login');
};
