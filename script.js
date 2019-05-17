/** Commands that can be use in terminal */
var commands = {};

/** Commands history */
var cmdHist = ['modules open Login'];

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
var modules = [
  new Module(
    'Login',
    '/login',
    [
      new Download('Login core', '0.56 (beta)'),
      new Download('Watchdog', '4.75'),
      new Download('Form database', '3.1.42')
    ],
    'help for module <i>Login</i>'
  )
];

/** Active module */
var activeModule = null;

/** Miscellaneous */
var misc = {};

/** Write formatted output in terminal */
misc.output = out => {
  if (out) {
    $('.term-input').before(`<div class="term-history">${out}`);
  }
};

/** Call given command  */
misc.callCmd = async (cmd, args) => {
  if (cmd) {
    cmdHist.push(`${cmd}${args ? ' ' + args.join(' ') : ''}`);

    return cmd in commands
      ? await commands[cmd](args)
      : `${cmd} not found in commands`;
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

/** Clear terminal entries */
commands.clear = () => {
  if ($('.term-history')) {
    $('.term-history').remove();
  }
};

/** Print help in terminal */
commands.help = module => {
  commands.clear();
  $('.term-input').before('<div class="term-history help">');

  // Typewriting effect
  new TypeIt('.help', {
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

/** Print history in terminal */
commands.history = () => {
  commands.clear();
  cmdHist.slice(0, cmdHist.length - 1).forEach(hist => misc.output(hist));
};

/** Login player */
commands.login = () => {
  if (activeModule && activeModule.name === 'Login') {
    window.location.replace('https://www.github.com/Ptit-Biscuit/CSSTerm');
  } else {
    misc.output("Module 'Login' not open");
  }
};

/** Modules relative commands */
commands.modules = async args => {
  switch (args[0]) {
    // List all modules available
    case 'list':
      modules.forEach(mod => misc.output(mod.name));
      break;
    // Open a module
    case 'open':
    case 'activate':
      var module = args[1];

      if (!module) {
        misc.output('Module name is required');
        break;
      }

      if (modules.map(mod => mod.name).includes(module)) {
        var mod = modules.find(mod => mod.name === module);
        await mod.install();
        activeModule = mod;
      } else {
        misc.output(`Module '${module}' cannot be found`);
      }
      break;
    // Close the active module
    case 'close':
    case 'deactivate':
      activeModule = null;
      break;
    // Help by default
    case 'help':
    default:
      commands.help('');
      break;
  }
};
