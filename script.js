function read(e) {
  if (e.keyCode === 13) {
    var command = $('#command').val();
    if (command != '') {
      readConsole(command);
      $('#command').val('');
    }
  }
}

function readConsole(command) {
  writeConsole(command);
}

function writeConsole(command) {
  document.querySelector('.term-output').innerHTML = '<span class="output">' + command + '</span>';
}
