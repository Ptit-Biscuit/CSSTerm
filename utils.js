/** Fake download */
class Download {
  constructor(name, version) {
    this.id = `dl${Math.random()
      .toString(36)
      .slice(4)}`;
    this.name = name;
    this.version = version;
    this.speed = parseFloat(100 * (1 + Math.random()));
    this.percent = 0;
    this.complete = false;
  }

  /** Start fake download */
  go = () => {
    if (!this.complete) {
      $('.term-input').before(
        `<div class="term-history download">` +
          `<div id="${this.id}">${this.name} ${this.version}`
      );

      this.update();
    }
  };

  /** Update progress bar */
  update = () => {
    var interval = setInterval(() => {
      var done = new Array(Math.floor(this.percent / 5) + 1).join('#');
      var toDo = new Array(Math.ceil((100 - this.percent) / 5) + 1).join('-');

      if (this.percent <= 100) {
        if ($(`.download-progress#${this.id}`)) {
          $(`.download-progress#${this.id}`).remove();
        }

        $(`.download #${this.id}`).after(
          `<div class="download-progress" id="${this.id}">` +
            `${this.speed.toFixed(1)} ms/t ` +
            `[${done}${toDo}] ` +
            `${this.percent++}%`
        );
      } else {
        this.complete = true;
        clearInterval(interval);
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

  /** Install process for module */
  install = async () => {
    if (!this.installed) {
      this.downloads.forEach(dl => dl.go());
      await this.allDownloadsComplete();

      this.installed = true;
      misc.output(
        `Downloads complete. Module '${this.name}' successfully installed`
      );
    }
  };

  /** Check downloads completeness */
  allDownloadsComplete = async () =>
    new Promise(resolve => {
      var res = setInterval(() => {
        if (!this.downloads.find(dl => !dl.complete)) {
          clearInterval(res);
          resolve();
        }
      });
    });
}
