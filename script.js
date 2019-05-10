/**
 * HERE GOES COMMANDS
 */
var commands = {};

commands.clear = () => {
  if ($(".term-history")) {
    $(".term-history").remove();
  }
};

commands.help = () => {
  console.log("help");
};

commands.use = (fun, args = "") => {
  if (fun) {
    cmdHist.push(fun);
    if (fun in commands) {
      return commands[fun](args);
    } else {
      return fun + " not found in commands";
    }
  }
};
