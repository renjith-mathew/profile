function checkIfExists(varName) {
	if (varName in window) {
		window[varName].winbox_win_obj.minimize(false);
		return true;
	}
	return false;
}

function openTerminal() {
	if (checkIfExists("rmx_terminal_obj")) {
		return;
	}
	rmx_terminal_obj = new Terminal({
		cursorBlink: true
	});
	rmx_terminal_obj.command = '';
	rmx_terminal_obj.onData(e => {
		if (e === '\r') {
			executeTerminalCommand();
		} else if (e === '\x7F') {
			if (rmx_terminal_obj.command.length > 0) {
				rmx_terminal_obj.write('\b \b');
				rmx_terminal_obj.command = rmx_terminal_obj.command.slice(0, -1);
			}
		} else {
			rmx_terminal_obj.write(e);
			rmx_terminal_obj.command += e;
		}
	});
	rmx_terminal_obj.open(document.getElementById('rmx_terminal'));
	writeNewTerminalLine();
	rmx_terminal_obj.current_dir = '/';
	rmx_terminal_obj.winbox_win_obj = new WinBox("Terminal",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("rmx_terminal"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			height: "446px",
			onclose: function (force) {
				rmx_terminal_obj.dispose();
				delete rmx_terminal_obj;
			},
			oncreate: function (options) {
				rmx_terminal_obj.focus();
			},
			class: ["no-full", "no-max"],
			icon: "images/terminal.svg"
		});
}

function openAbout() {
	if (checkIfExists("rmx_profile_obj")) {
		return;
	}
	rmx_profile_obj = new Object();
	rmx_profile_obj.winbox_win_obj = new WinBox("About",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("profile_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_profile_obj;
			}
		});
}

function openSettings() {
	if (checkIfExists("rmx_settings_obj")) {
		return;
	}
	rmx_settings_obj = new Object();
	rmx_settings_obj.winbox_win_obj = new WinBox({
		title: "Settings",
		html: "<table><tr><td>Theme</td><td><a class='nav-link' href='#' onclick='toggleTheme()'><i class='bi bi-toggles2'></i></a></td></tr></table>",
		x: "center",
		y: "center",
		background: rmxwinbox_backgroundColor,
		class: ["no-full", "no-max"],
		onclose: function (force) {
			delete rmx_settings_obj;
		}
	});
}

function openWebBrowser() {
	if (checkIfExists("rmx_web_browser_obj")) {
		return;
	}
	rmx_web_browser_obj = new Object();
	rmx_web_browser_obj.winbox_win_obj = new WinBox("Web Browser",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("web_browser_content"),
			x: "10%",
			y: "10%",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_web_browser_obj;
			}
		});
}

function openFileBrowser() {
	if (checkIfExists("rmx_file_browser_obj")) {
		return;
	}
	rmx_file_browser_obj = new Object();
	rmx_file_browser_obj.winbox_win_obj = new WinBox("File Browser - Local IndexedDB",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("file_browser_content"),
			x: "20%",
			y: "20%",
			background: rmxwinbox_backgroundColor,
			oncreate: function (options) {
				loadFilePath();
			},
			onclose: function (force) {
				delete rmx_file_browser_obj;
			}
		});
}

function openChat() {
	if (checkIfExists("rmx_ai_chat_obj")) {
		return;
	}
	rmx_ai_chat_obj = new Object();
	rmx_ai_chat_obj.winbox_win_obj = new WinBox("AI Chat",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("chat_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_ai_chat_obj;
			},
			icon: "images/chat.svg"
		});
}

function openEditor() {
	if (checkIfExists("rmx_code_editor_obj")) {
		return;
	}
	rmx_code_editor_obj = new Object();
	rmx_code_editor_obj.winbox_win_obj = new WinBox("Code Editor",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("theia_ide_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_code_editor_obj;
			}
		});
}

function openTextEditor() {
	if (checkIfExists("rmx_text_editor_obj")) {
		return;
	}
	rmx_text_editor_obj = new Object();
	rmx_text_editor_obj.winbox_win_obj = new WinBox("Text Editor",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("text_editor_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_text_editor_obj;
			}
		});
}

function openMathAssistant() {
	if (checkIfExists("rmx_MathAssistant_obj")) {
		return;
	}
	rmx_MathAssistant_obj = new Object();
	rmx_MathAssistant_obj.winbox_win_obj = new WinBox("Math Model - This is a simple test model. Do not rely on the output.",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("MathAssistant_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			class: ["no-full", "no-max"],
			onclose: function (force) {
				delete rmx_MathAssistant_obj;
			}
		});
}

function openArchitectureDesigner() {
	if (checkIfExists("rmx_arch_diagram_obj")) {
		return;
	}
	rmx_arch_diagram_obj = new Object();
	rmx_arch_diagram_obj.winbox_win_obj = new WinBox("Architecture Designer- This is a simple test model. Do not deploy to prod.",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("arch_diagram_content"),
			x: "center",
			y: "center",
			background: rmxwinbox_backgroundColor,
			onclose: function (force) {
				delete rmx_arch_diagram_obj;
			}
		});
}

function writeNewTerminalLine() {
	rmx_terminal_obj.write('\n\r $ ');
}

function writeTerminalLine(str_message) {
	rmx_terminal_obj.write('\n\r ' + str_message);
	writeNewTerminalLine();
}

function buildPathBrowser(root_path,new_path) {  //basic with no wildcard expansion
	if (new_path === '.') {
		return root_path;
	} else if (new_path === '..') {
		parent_path = root_path.substr(0, root_path.lastIndexOf('/'));
		if (parent_path == 0) {
			parent_path = "/";
		}
		return parent_path;
	} else if (root_path==='/' && new_path==='/') {
		return root_path;
	}
	if (new_path.startsWith('/')) {
		return new_path;
	} else {
		let curr_path = root_path;
		if (curr_path.endsWith('/')) {
			return curr_path + new_path;
		} else {
			return curr_path + '/' + new_path;
		}
	}
}

function buildPathTerminal(new_path) {
	return buildPathBrowser(rmx_terminal_obj.current_dir,new_path);
}

async function checkForValidPath(new_path) {
	try {
		new_path = buildPathBrowser('',new_path);
		const statResult = await rmx_fs.promises.stat(new_path);
		return statResult['type'];
	} catch (e) {
		return '';
	}
}

async function checkForValidTermPath(new_path) {
	try {
		new_path = buildPathTerminal(new_path);
		const statResult = await rmx_fs.promises.stat(new_path);
		return statResult['type'];
	} catch (e) {
		return '';
	}
}

function checkForValidTermDirectoryPath(new_path, fexeccb) {
	checkForValidTermPath(new_path)
		.then((pathType) => {
			if (pathType === 'dir') {
				fexeccb();
			} else {
				writeTerminalLine(new_path + ' No such directory');
			}
		});
}

function checkForValidTermFilePath(new_path, fexeccb) {
	checkForValidTermPath(new_path)
		.then((pathType) => {
			if (pathType === 'file') {
				fexeccb();
			} else {
				writeTerminalLine(new_path + ' No such file');
			}
		});
}

function executeTerminalCommand() {
	const input = rmx_terminal_obj.command.trim();
	rmx_terminal_obj.command = '';
	const args = input.split(' ');
	const command = args[0];
	const params = args.slice(1).join(' ');
	switch (command) {
		case 'echo':
			writeTerminalLine(params);
			break;
		case 'pwd':
			writeTerminalLine(rmx_terminal_obj.current_dir);
			break;
		case 'cd':
			const cdDirectory = buildPathTerminal(args[1]);
			checkForValidTermDirectoryPath(cdDirectory, () => {
				rmx_terminal_obj.current_dir = cdDirectory;
				writeNewTerminalLine();
			});
			break;
		case 'mv':
		case 'rename':
			const mvPath1 = buildPathTerminal(args[1]);
			const mvPath2 = buildPathTerminal(args[2]);
			rmx_fs.promises.rename(mvPath1, mvPath2).then((value) => {
				writeNewTerminalLine();
			}).catch((error) => {
				writeTerminalLine(`error: ${error}`);
			});
			break;
		case 'mkdir':
			const newTargetDirectory = buildPathTerminal(args[1]);
			rmx_fs.promises.mkdir(newTargetDirectory).then((value) => {
				writeNewTerminalLine();
			}).catch((error) => {
				writeTerminalLine(`error: ${error}`);
			});
			break;
		case 'rmdir':
			const rmTargetDirectory = buildPathTerminal(args[1]);
			checkForValidTermDirectoryPath(rmTargetDirectory, () => {
				rmx_fs.promises.rmdir(rmTargetDirectory).then((value) => {
					writeNewTerminalLine();
				}).catch((error) => {
					writeTerminalLine(`error: ${error}`);
				});
			});
			break;
		case 'touch':
			const fileNameTouch = buildPathTerminal(args[1]);
			rmx_fs.promises.writeFile(fileNameTouch, new Date().toISOString()).then((value) => {
				writeNewTerminalLine();
			}).catch((error) => {
				writeTerminalLine(`error: ${error}`);
			});
			break;
		case 'rm':
			const fileNameDel = buildPathTerminal(args[1]);
			checkForValidTermFilePath(fileNameDel, () => {
				rmx_fs.promises.unlink(fileNameDel).then((value) => {
					writeNewTerminalLine();
				})
			});
			break;
		case 'ls':
			var targetDirectory = rmx_terminal_obj.current_dir;
			if (args.length > 1 && args[1].length > 0) {
				targetDirectory = args[1];
			}
			checkForValidTermDirectoryPath(targetDirectory, () => {
				rmx_fs.promises.readdir(targetDirectory, '').then((value) => {
					writeTerminalLine(value.join('\r\n '));
				})
			});
			break;
		case 'cat':
			const fileNameCat = buildPathTerminal(args[1]);
			checkForValidTermFilePath(fileNameCat, () => {
				rmx_fs.promises.readFile(fileNameCat, 'utf8').then((value) => {
					writeTerminalLine(value);
				})
			});
			break;
		case 'clear':
			for (var i = 0; i < 7; i++) { rmx_terminal_obj.write('\b \b'); }
			rmx_terminal_obj.clear();
			writeNewTerminalLine();
			break;
		default:
			writeTerminalLine(`Command not found: ${command}`);
	}

}

function setupSystem() {
	rmxwinbox_backgroundColor = "#ffffff";
	try {
		var clockDisplay = document.getElementById('clockDisplay');
		function clickTicker() {
			let dateStr = new Date().toString();
			clockDisplay.textContent = dateStr.slice(16, 21) + " " + dateStr.slice(4, 10);
		}
		clickTicker();
		setInterval(clickTicker, 30000);//approx
	} catch (e) { console.log(e); }
	try {
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
	} catch (e) { console.log(e); }
	if (window.addEventListener) {
		document.getElementById('dock').addEventListener('mouseover', addPrevClass, false);
	}
	try {
		window.rmx_fs = new LightningFS('rmx_fs_indexed_db');
	} catch (e) { console.log(e); }
	let enterTriggerElements = [['chatInput', webGpuTokens], ['calcInput', mathWebGpuTokens], ['archPromptInput', archWebGpuTokens], ['urlInput', loadUrl], ['filePathInput', loadFilePath]]
	enterTriggerElements.forEach(function (pair) {
		document.getElementById(pair[0]).addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				pair[1]();
			}
		});
	});
	try {
		Viz.instance().then(function (viz) {
			document.getElementById("arch_diagram_Output").appendChild(viz.renderSVGElement("digraph { source -> sink }"));
		});
	} catch (e) { console.log(e); }
}

function toggleTheme() {
	let htmlElm = document.documentElement;
	let winBodyElements = document.getElementsByClassName("wb-body");
	if (htmlElm.getAttribute("data-bs-theme") === "light") {
		htmlElm.setAttribute("data-bs-theme", "dark");
		rmxwinbox_backgroundColor = "rgb(33, 37, 41)";
	} else {
		htmlElm.setAttribute("data-bs-theme", "light");
		rmxwinbox_backgroundColor = "#ffffff";
	}
	for (let i = 0; i < winBodyElements.length; i++) {
		winBodyElements[i].style.backgroundColor = rmxwinbox_backgroundColor;
	}
}

function loadUrl() {
	document.getElementById("web_browser_content_iframe").src = document.getElementById("urlInput").value;
}

function getFolderHtml(folder_name){
	return ` <div class="col-sm-1 text-center">
	<button type="button" class="btn btn-outline-secondary  btn-sm border-0">
	  <i class="bi bi-folder2"></i>
	</button>
	<p class="mt-2 file_browser_text">${folder_name}</p>
  </div>`;
}

function getFileHtml(file_name){
	return ` <div class="col-sm-1 text-center">
	<button type="button" class="btn btn-outline-secondary  btn-sm border-0">
	  <i class="bi bi-file-earmark"></i>
	</button>
	<p class="mt-2 file_browser_text">${file_name}</p>
  </div>`;
}


function loadFilePath() {
	let selectedPath = document.getElementById('filePathInput').value;
	document.getElementById("file_browser_content_browser").innerHTML = '';
	checkForValidPath(selectedPath)
		.then((pathType) => {
			if (pathType === 'dir') {				
				rmx_fs.promises.readdir(selectedPath, '').then((value) => {
					for(let i=0;i<value.length;i++){
						let itemPath = buildPathBrowser(selectedPath,value[i]);
						checkForValidPath(itemPath)
						.then((pathType) => {
							if (pathType === 'file') {
								document.getElementById("file_browser_content_browser").innerHTML = document.getElementById("file_browser_content_browser").innerHTML+getFileHtml(value[i]);
							} else if (pathType === 'dir') {
								document.getElementById("file_browser_content_browser").innerHTML = document.getElementById("file_browser_content_browser").innerHTML+getFolderHtml(value[i]);
							} 
						});
					}					
				})
			} else {
				document.getElementById("file_browser_content_browser").innerHTML = '<div class="alert alert-danger" role="alert">Invalid path</div>';
			}
		});
}

function saveNewFileBrowser(isFile) {

}

function cancelNewFileBrowser(isFile) {

}

function webGpuTokens() {
	let inputContent = document.getElementById("chatInput").value;
	document.getElementById("chatInput").value = "Waiting for neural network results ...";
	var chatResponse = "Not implemented yet";
	document.getElementById("chatInput").value = "";
	document.getElementById("chatHistory").innerHTML = "<br/>User: " + inputContent + "<br/>Model: " + chatResponse + "<br/>" + document.getElementById("chatHistory").innerHTML;
}
function clearChat() {
	document.getElementById("chatInput").value = "";
	document.getElementById("chatHistory").innerHTML = "";
}

function mathWebGpuTokens() {
	let inputContent = document.getElementById("calcInput").value;
	document.getElementById("calcInput").value = "Waiting for neural network results ...";
	var chatResponse = "Not implemented yet";
	document.getElementById("calcInput").value = "";
	document.getElementById("MathAssistantOutput").innerHTML = "<br/>User: " + inputContent + "<br/>Model: " + chatResponse + "<br/>";
}

function clearMathChat() {
	document.getElementById("calcInput").value = "";
	document.getElementById("MathAssistantOutput").innerHTML = "";
}

function archWebGpuTokens() {
	let inputContent = document.getElementById("archPromptInput").value;
	document.getElementById("archPromptInput").value = "Waiting for neural network results ...";
	var chatResponse = "Not implemented yet";
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_diagram_Output").innerHTML = "<br/>User: " + inputContent + "<br/>Model: " + chatResponse + "<br/>";
}

function clearArchChat() {
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_diagram_Output").innerHTML = "";
}

function addPrevClass(e) {
	var target = e.target;
	if (target.getAttribute('type') === 'button') {
		var li = target.parentNode.parentNode;
		var prevLi = li.previousElementSibling;
		if (prevLi) {
			prevLi.className = 'prev';
		}

		target.addEventListener('mouseout', function () {
			if (prevLi) {
				prevLi.removeAttribute('class');
			}
		}, false);
	}
}