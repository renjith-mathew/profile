function openTerminal() {	
	if ('xloc_terminal_obj' in window) {
		window.xloc_terminal_obj.winbox_terminal_obj.minimize(false);
		return;
	}
	window.xloc_terminal_obj = new Terminal({
		cursorBlink: true, rows:21
	});


	window.xloc_terminal_obj.command = '';
	window.xloc_terminal_obj.onData(e => {
		if (e === '\r') {
			executeTerminalCommand();
		} else if (e === '\x7F') {
			if (window.xloc_terminal_obj.command.length > 0) {
				window.xloc_terminal_obj.write('\b \b');
				window.xloc_terminal_obj.command = window.xloc_terminal_obj.command.slice(0, -1);
			}
		} else {
			window.xloc_terminal_obj.write(e);
			window.xloc_terminal_obj.command += e;
		}
	});	

	window.xloc_terminal_obj.open(document.getElementById('xloc_terminal'));
	writeNewTerminalLine();

	window.xloc_terminal_obj.winbox_terminal_obj = new WinBox("Terminal",
		{
			root: document.getElementById('xloc_workspace'),
			mount: document.getElementById("xloc_terminal"),
			x: "center",
    		y: "center",
			onclose: function(force){
				window.xloc_terminal_obj.dispose();
				delete window.xloc_terminal_obj;
			},
			oncreate: function(options){
				window.xloc_terminal_obj.focus();
			},
			class: ["no-full"],
			icon: "images/terminal.svg"
		});
}

function openAbout() {
	new WinBox({
		title: "About",
		html: "<h1>&nbsp;About</h1><div>&nbsp;<a href='https://github.com/***REMOVED***' target='_blank'>github.com/***REMOVED***</a></div>",
		x: "center",
		y: "center",
		width: 200,
		height: 200,
		border: "0.3em",
		background: "#808080",
		class: ["no-full","no-max"],
	});
}

function openSettings() {

}

function openWebBrowser() {

}

function openFileBrowser() {

}

function openChat() {

}

function openEditor() {

}

function writeNewTerminalLine() {
	window.xloc_terminal_obj.write('\n\r $ ');
}

function executeTerminalCommand() {	
	const input = window.xloc_terminal_obj.command.trim();
	window.xloc_terminal_obj.command = '';
    const args = input.split(' ');
    const command = args[0];
    const params = args.slice(1).join(' ');

    switch (command) {
        case 'echo':
            window.xloc_terminal_obj.write('\n\r '+ params);
			writeNewTerminalLine()
            break;
        case 'clear':
            window.xloc_terminal_obj.clear();
			writeNewTerminalLine()
            break;
        default:
            window.xloc_terminal_obj.write(`\n\r Command not found: ${command}`);
			writeNewTerminalLine();
    }
}