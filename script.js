function read(e) {
  if (e.keyCode === 13) {
    var command = $("#command").val();
    if (command != "") {
      readConsole(command);
      $("#command").val("");
    }
  }
}

function readConsole(command) {
  switch (command) {
    case "help":
      writeConsole(
        '<span style="color: red;">Command: "' + command + '" not found</span>'
      );
      break;

    default:
      writeConsole(
        '<span style="color: red;">Command: "' + command + '" not found</span>'
      );
  }
}

function writeConsole(command) {
  $("input").html(command);
}
