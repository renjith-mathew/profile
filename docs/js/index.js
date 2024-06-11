function checkIfExists(varName) {
	if (varName in window) {
		window[varName].winbox_win_obj.minimize(false);
		return true;
	}
	return false;
}

function openTerminal() {
	if (checkIfExists("xloc_terminal_obj")) {
		return;
	}
	xloc_terminal_obj = new Terminal({
		cursorBlink: true
	});
	xloc_terminal_obj.command = '';
	xloc_terminal_obj.onData(e => {
		if (e === '\r') {
			executeTerminalCommand();
		} else if (e === '\x7F') {
			if (xloc_terminal_obj.command.length > 0) {
				xloc_terminal_obj.write('\b \b');
				xloc_terminal_obj.command = xloc_terminal_obj.command.slice(0, -1);
			}
		} else {
			xloc_terminal_obj.write(e);
			xloc_terminal_obj.command += e;
		}
	});
	xloc_terminal_obj.open(document.getElementById('xloc_terminal'));
	writeNewTerminalLine();
	xloc_terminal_obj.winbox_win_obj = new WinBox("Terminal",
		{
			root: document.getElementById('xloc_workspace'),
			mount: document.getElementById("xloc_terminal"),
			x: "center",
			y: "center",
			height: "446px",
			onclose: function (force) {
				xloc_terminal_obj.dispose();
				delete xloc_terminal_obj;
			},
			oncreate: function (options) {
				xloc_terminal_obj.focus();
			},
			class: ["no-full"],
			icon: "images/terminal.svg"
		});
}

function openAbout() {
	new WinBox({
		title: "About",
		html: "<div>&nbsp;Visit the github url</div>",
		x: "center",
		y: "center",
		class: ["no-full", "no-max"],
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

function openTextEditor() {

}

function openCalculator() {
	
}

function openArchitectureDesigner(){

}

function writeNewTerminalLine() {
	xloc_terminal_obj.write('\n\r $ ');
}

function executeTerminalCommand() {
	const input = xloc_terminal_obj.command.trim();
	xloc_terminal_obj.command = '';
	const args = input.split(' ');
	const command = args[0];
	const params = args.slice(1).join(' ');

	switch (command) {
		case 'echo':
			xloc_terminal_obj.write('\n\r ' + params);
			writeNewTerminalLine()
			break;
		case 'clear':
			xloc_terminal_obj.clear();
			writeNewTerminalLine()
			break;
		default:
			xloc_terminal_obj.write(`\n\r Command not found: ${command}`);
			writeNewTerminalLine();
	}
}

function setupSystem() {
	var clockDisplay = document.getElementById('clockDisplay');
	function clickTicker() {
		clockDisplay.textContent = new Date().toISOString().slice(11, 19);
	}
	clickTicker();
	setInterval(clickTicker, 1000);
	const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
	popoverList.map((popEl) => {
		let popConfig = {
			animation: false
		}
		if (popEl.hasAttribute('data-bs-target-html')) {
			popConfig.content = document.getElementById(popEl.getAttribute('data-bs-target-html'));
			popConfig.html = true;
		}
		new bootstrap.Popover(popEl, popConfig);
	});
	if (window.addEventListener) {
		document.getElementById('dock').addEventListener('mouseover', addPrevClass, false);
	}	
}

function addPrevClass (e) {
	var target = e.target;
	if(target.getAttribute('type')==='button') { 
		var li = target.parentNode.parentNode;
		var prevLi = li.previousElementSibling;
		if(prevLi) {
			prevLi.className = 'prev';
		}
	
		target.addEventListener('mouseout', function(){
			if(prevLi) {
				prevLi.removeAttribute('class');
			}
		}, false);
	}
}