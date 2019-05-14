/**
 * HERE GOES COMMANDS
 */
var commands = {};
var cmdHist = ['a', 'b', 'c'];

commands.clear = () => {
  if ($('.term-history')) {
    $('.term-history').remove();
  }
};

commands.help = () => {
  console.log('help');
};

commands.use = (cmd, args = '') => {
  if (cmd) {
    cmdHist.push(cmd);

    return cmd in commands
      ? commands[cmd](args)
      : cmd + ' not found in commands';
  }
};
