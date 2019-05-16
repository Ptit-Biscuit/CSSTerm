/** Commands that can be use in terminal */
var commands = {};

/** Commands history */
var cmdHist = ['modules install plop'];

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

/** Fake download */
class Download {
  constructor(name, version) {
    this.id = Math.random()
      .toString(36)
      .slice(2);
    this.name = name;
    this.version = version;
    this.speed = parseFloat(100 * (1 + Math.random()));
  }

  go = () => {
    var percent = 0;

    $('.term-input').before(
      `<div class="term-history download">` +
        `<div id="${this.id}">${this.name} ${this.version}`
    );

    setInterval(() => {
      var done = new Array(Math.floor(percent / 5) + 1).join('#');
      var toDo = new Array(Math.ceil((100 - percent) / 5) + 1).join('-');

      if (percent <= 100) {
        if ($(`.download-progress#${this.id}`)) {
          $(`.download-progress#${this.id}`).remove();
        }

        $(`.download #${this.id}`).after(
          `<div class="download-progress" id="${this.id}">` +
            `${this.speed.toFixed(1)} Msec/t ` +
            `[${done}${toDo}] ` +
            `${percent++}%`
        );
      } else {
        clearInterval();
      }
    }, this.speed);
  };
}

/** A module */
class Module {
  constructor(name, path, downloads = [], help = '') {
    this.name = name;
    this.path = path;
    this.downloads = downloads;
    this.help = help;
    this.installed = false;
  }

  install = () => {
    this.downloads.forEach(dl => dl.go());
    this.installed = true;
  };
}

/** Modules available */
var modules = [
  new Module(
    'plop',
    '/plop',
    [
      new Download('Plop plop', '0.56 (beta)'),
      new Download('Foo', '4.75'),
      new Download('Bar', '3.1.42')
    ],
    'help for module <i>plop</i>'
  )
];

/** Active module */
var activeModule = null;

/** Miscellaneous */
var misc = {};

/** Write formatted output in terminal */
misc.output = out => {
  if (out) {
    $('.term-input').before('<div class="term-history">' + out);
  }
};

/** Call given command  */
misc.callCmd = (cmd, args) => {
  if (cmd) {
    cmdHist.push(cmd + (args ? ' ' + args.join(' ') : ''));

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
  console.log('login');
};

/** Modules relative commands */
commands.modules = args => {
  switch (args[0]) {
    // List all modules available
    case 'list':
      modules.forEach(mod => misc.output(mod.name));
      break;
    // Install a module
    case 'install':
      var module = args[1];

      if (!module) {
        misc.output('Module name is required');
      }

      if (modules.map(mod => mod.name).includes(module)) {
        modules.find(mod => mod.name === module).install();
        activeModule = null;
      } else {
        misc.output("Module '" + module + "' cannot be found");
      }
    // Open a module
    case 'open':
    case 'activate':
      var module = args[1];

      if (!module) {
        misc.output('Module name is required');
      }

      if (modules.map(mod => mod.name).includes(module)) {
        var mod = modules.find(mod => mod.name === module);

        if (mod.installed) {
          activeModule = mod;
        } else {
          misc.output("Module '" + module + "' needs to be installed");
        }
      } else {
        misc.output("Module '" + module + "' cannot be found");
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
