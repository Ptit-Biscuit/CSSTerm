/** Miscellaneous */
var misc = {};

/** Write formatted output in terminal */
misc.output = out => {
  if (out) {
    $('.term-input').before('<div class="term-history">' + out);
  }
};

/** Call given command  */
misc.callCmd = (cmd, args = '') => {
  if (cmd) {
    cmdHist.push(cmd + (args !== '' ? ' ' + args : ''));

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

class Module {
  constructor(name, path, help = '') {
    this.name = name;
    this.path = path;
    this.help = help;
    this.isOpen = false;
  }
}

/** Commands that can be use in terminal */
var commands = {};

/** Commands history */
var cmdHist = ['open_module plop'];

/** History index */
var histIndex;

/** Terminal help */
var cmdHelp = [
  'Welcome to <b>plop</b> !',
  '',
  'To clear terminal type <i>clear</i>',
  'To see history type <i>history</i>',
  'To see help type <i>help</i>'
];

/** Modules available */
var modules = [new Module('plop', '/plop', 'help for module <i>plop</i>')];

/** Clear terminal entries */
commands.clear = () => {
  if ($('.term-history')) {
    $('.term-history').remove();
  }
};

/** Print help in terminal */
commands.help = module => {
  commands.clear();
  $('.term-input').before('<div class="term-history">');

  // Typewriting effect
  new TypeIt('.term-history', {
    strings:
      module && modules.map(mod => mod.name).includes(module)
        ? modules.find(mod => mod.name === module).help
        : cmdHelp,
    speed: 50,
    cursor: false,
    html: true,
    waitUntilVisible: true
  }).go();
};

/** List all modules available */
commands.list_modules = () => modules.forEach(mod => misc.output(mod.name));

/** Open a module */
commands.open_module = module => {
  if (modules.map(mod => mod.name).includes(module)) {
    if (modules.find(mod => mod.name === module).isOpen) {
      misc.output("Module '" + module + "' already opened");
    } else {
      modules.find(mod => mod.name === module).isOpen = true;
    }
  } else {
    misc.output("Module '" + module + "' cannot be found");
  }
};

/** Close the active module */
commands.close_module = () => (modules.find(mod => mod.isOpen).isOpen = false);

/** Login player */
commands.login = () => {
  console.log('login');
};

/** Print history in terminal */
commands.history = () => {
  commands.clear();
  cmdHist.slice(0, cmdHist.length - 1).forEach(hist => misc.output(hist));
};
