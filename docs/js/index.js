function checkIfExists(varName) {
	if (varName in window) {
		window[varName].winbox_win_obj.minimize(false);
		return true;
	}
	return false;
}

function openTerminal() {
	const winboxWindowId = "rmx_terminal_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
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
	return winboxWindowId;
}

function openAbout() {
	const winboxWindowId = "rmx_profile_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_profile_obj = new Object();
	rmx_profile_obj.winbox_win_obj = new WinBox("About",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("profile_content"),
			x: "center",
			y: "center",
			oncreate: function (options) {
				document.getElementById('profile_content_iframe').src = 'profile.pdf';
			},
			onclose: function (force) {
				delete rmx_profile_obj;
			}
		});
	return winboxWindowId;
}

function openSettings() {
	const winboxWindowId = "rmx_settings_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_settings_obj = new Object();
	rmx_settings_obj.winbox_win_obj = new WinBox({
		title: "Settings",
		html: ` <table class="table table-sm">
		<tr>
		  <td>Change Theme</td>
		  <td><a class='nav-link' href='#' onclick='toggleTheme()'><i class='bi bi-toggles2'></i></a></td>
		</tr>
		<tr>
		  <td>View Profile</td>
		  <td><a class="dropdown-item" href="profile.pdf" target="_blank"><i class="bi bi-window-plus"></i></a></td>
		</tr>
		<tr><td>Language Model Settings</td><td>temperature: default, top_k: default, top_p: default</td></tr>	
		<tr><td>About</td><td>This is a UI prototype | Not for real use</td></tr>	
	  </table>`,
		x: "center",
		y: "center",
		class: ["no-full", "no-max"],
		onclose: function (force) {
			delete rmx_settings_obj;
		}
	});
	return winboxWindowId;
}

function openWebBrowser() {
	const winboxWindowId = "rmx_web_browser_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_web_browser_obj = new Object();
	rmx_web_browser_obj.winbox_win_obj = new WinBox("Web Browser - Not for real use",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("web_browser_content"),
			x: "10%",
			y: "10%",
			oncreate: function (options) {
				document.getElementById('web_browser_content_iframe').src = 'pages/terms.html';
			},
			onclose: function (force) {
				delete rmx_web_browser_obj;
			}
		});
	return winboxWindowId;
}

function openFileBrowser() {
	const winboxWindowId = "rmx_file_browser_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_file_browser_obj = new Object();
	rmx_file_browser_obj.winbox_win_obj = new WinBox("File Browser - Local IndexedDB",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("file_browser_content"),
			x: "20%",
			y: "20%",
			oncreate: function (options) {
				loadFilePath();
			},
			onclose: function (force) {
				delete rmx_file_browser_obj;
				closeNewFileBrowser();
			}
		});
	return winboxWindowId;
}

function openChat() {
	const winboxWindowId = "rmx_ai_chat_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_ai_chat_obj = new Object();
	rmx_ai_chat_obj.winbox_win_obj = new WinBox("AI Chat - This is a simple tiny test model of ~0.3M parameters",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("chat_content"),
			x: "center",
			y: "center",
			oncreate: function (options) {
				initProfileChatTransformersPipeline();
			},
			onclose: function (force) {
				delete rmx_ai_chat_obj;
			},
			icon: "images/chat.svg"
		});
	return winboxWindowId;
}

function openEditor() {
	const winboxWindowId = "rmx_code_editor_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_code_editor_obj = new Object();
	rmx_code_editor_obj.winbox_win_obj = new WinBox("Code Editor",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("theia_ide_content"),
			x: "center",
			y: "center",
			oncreate: function (options) {
				document.getElementById('theia_content_iframe').src = 'pages/ide/';
			},
			onclose: function (force) {
				delete rmx_code_editor_obj;
			}
		});
	return winboxWindowId;
}

function openTextEditor() {
	const winboxWindowId = "rmx_text_editor_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_text_editor_obj = new Object();
	rmx_text_editor_obj.winbox_win_obj = new WinBox("Text Editor",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("text_editor_content"),
			x: "center",
			y: "center",
			oncreate: function (options) {
				document.getElementById('monaco_editor_content_iframe').src = 'pages/editor.html';
			},
			onclose: function (force) {
				delete rmx_text_editor_obj;
			}
		});
	return winboxWindowId;
}

function openMathAssistant() {
	const winboxWindowId = "rmx_MathAssistant_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_MathAssistant_obj = new Object();
	rmx_MathAssistant_obj.winbox_win_obj = new WinBox("Agent Model - This is a simple agentic workflow test model. Do not rely on the output.",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("MathAssistant_content"),
			x: "center",
			y: "center",
			class: ["no-full", "no-max"],
			oncreate: function (options) {
				initAgentChatTransformersPipeline();
			},
			onclose: function (force) {
				delete rmx_MathAssistant_obj;
			}
		});
	return winboxWindowId;
}

function openArchitectureDesigner() {
	const winboxWindowId = "rmx_arch_diagram_obj";
	if (checkIfExists(winboxWindowId)) {
		return winboxWindowId;
	}
	rmx_arch_diagram_obj = new Object();
	rmx_arch_diagram_obj.winbox_win_obj = new WinBox("Architecture Generator - This is a simple RAG test model. Do not deploy to prod.",
		{
			root: document.getElementById('rmx_workspace'),
			mount: document.getElementById("arch_diagram_content"),
			x: "center",
			y: "center",
			oncreate: function (options) {
				initAgentChatTransformersPipeline();
			},
			onclose: function (force) {
				delete rmx_arch_diagram_obj;
			}
		});
	return winboxWindowId;
}

function writeNewTerminalLine() {
	rmx_terminal_obj.write('\n\r $ ');
}

function writeTerminalLine(str_message) {
	rmx_terminal_obj.write('\n\r ' + str_message);
	writeNewTerminalLine();
}

function buildPathBrowser(root_path, new_path) {  //basic with no wildcard expansion
	if (new_path === '.') {
		return root_path;
	} else if (new_path === '..') {
		parent_path = root_path.substr(0, root_path.lastIndexOf('/'));
		if (parent_path == 0) {
			parent_path = "/";
		}
		return parent_path;
	} else if (root_path === '/' && new_path === '/') {
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
	return buildPathBrowser(rmx_terminal_obj.current_dir, new_path);
}

function rmx_fs_exec_stat(check_path) {
	return localStorage.getItem('rmx_fs/item_type' + check_path);
}

function rmx_fs_exec_readdir(check_path) {
	let keyStart = 'rmx_fs/item_type' + (check_path.endsWith('/')?check_path:check_path+'/');
	let keysAll = Object.keys(localStorage);
	let result = []
	for(let k=0;k<keysAll.length;k++){
		let key = keysAll[k];
		let suffix = key.replace(keyStart, '');
		if(key.startsWith(keyStart) && suffix.length > 0 && suffix.indexOf('/') == -1){
			result.push(suffix);
		}
	}
	return result;
}

function rmx_fs_exec_mkdir(check_path) {
	localStorage.setItem('rmx_fs/item_type' + check_path, 'dir');
}

function rmx_fs_exec_rmdir(check_path){
	if(check_path=='/'){
		return;
	}
	let keyStart = 'rmx_fs/item_type' + check_path;
	let fileKeyStart = 'rmx_fs/item_content' + check_path;
	let keysAll = Object.keys(localStorage);
	for(let k=0;k<keysAll.length;k++){
		let key = keysAll[k];
		if(key===keyStart || key.startsWith(keyStart+'/')
			|| key.startsWith(fileKeyStart+'/')){
			localStorage.removeItem(key);
		}
	}
	
}

function rmx_fs_exec_writeFile(check_path,file_content){
	localStorage.setItem('rmx_fs/item_type' + check_path, 'file');
	localStorage.setItem('rmx_fs/item_content' + check_path, file_content);
}

function rmx_fs_exec_readFile(check_path) {
	return localStorage.getItem('rmx_fs/item_content' + check_path);
}
function rmx_fs_exec_unlink(check_path) {
	localStorage.removeItem('rmx_fs/item_type' + check_path);
	localStorage.removeItem('rmx_fs/item_content' + check_path);
}

function checkForValidPath(new_path) {
	new_path = buildPathBrowser('', new_path);
	return rmx_fs_exec_stat(new_path);
}

function checkForValidTermPath(new_path) {
	new_path = buildPathTerminal(new_path);
	return rmx_fs_exec_stat(new_path);
}

function checkForValidTermDirectoryPath(new_path, fexeccb) {
	let pathType = checkForValidTermPath(new_path);
	if (pathType === 'dir') {
		fexeccb();
	} else {
		writeTerminalLine(new_path + ' No such directory');
	}
}

function checkForValidTermFilePath(new_path, fexeccb) {
	let pathType = checkForValidTermPath(new_path);
	if (pathType === 'file') {
		fexeccb();
	} else {
		writeTerminalLine(new_path + ' No such file');
	}
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
			rmx_fs_exec_rename(mvPath1, mvPath2);
			writeNewTerminalLine();
			break;
		case 'mkdir':
			const newTargetDirectory = buildPathTerminal(args[1]);
			rmx_fs_exec_mkdir(newTargetDirectory);
			writeNewTerminalLine();
			break;
		case 'rmdir':
			const rmTargetDirectory = buildPathTerminal(args[1]);
			checkForValidTermDirectoryPath(rmTargetDirectory, () => {
				rmx_fs_exec_rmdir(rmTargetDirectory);
				writeNewTerminalLine();
			});
			break;
		case 'touch':
			const fileNameTouch = buildPathTerminal(args[1]);
			rmx_fs_exec_writeFile(fileNameTouch, new Date().toISOString());
			writeNewTerminalLine();
			break;
		case 'rm':
			const fileNameDel = buildPathTerminal(args[1]);
			checkForValidTermFilePath(fileNameDel, () => {
				rmx_fs_exec_unlink(fileNameDel);
				writeNewTerminalLine();
			});
			break;
		case 'ls':
			var targetDirectory = rmx_terminal_obj.current_dir;
			if (args.length > 1 && args[1].length > 0) {
				targetDirectory = args[1];
			}
			checkForValidTermDirectoryPath(targetDirectory, () => {
				let lsListItems = rmx_fs_exec_readdir(targetDirectory, '');
				if(lsListItems.length>0){
					writeTerminalLine(lsListItems.join('\r\n '));
				} else {
					writeNewTerminalLine();
				}
			});
			break;
		case 'cat':
			const fileNameCat = buildPathTerminal(args[1]);
			checkForValidTermFilePath(fileNameCat, () => {
				let fileContents = rmx_fs_exec_readFile(fileNameCat);
				writeTerminalLine(fileContents);
			});
			break;
		case 'clear':
			for (var i = 0; i < 7; i++) { rmx_terminal_obj.write('\b \b'); }
			rmx_terminal_obj.clear();
			writeNewTerminalLine();
			break;
		case 'date':
			writeTerminalLine(new Date().toString());
			break;
		case 'exit':
			rmx_terminal_obj.winbox_win_obj.close();
			break;
		default:
			writeTerminalLine(`Command not found: ${command}`);
	}

}

function toggleTheme() {
	let htmlElm = document.documentElement;
	if (htmlElm.getAttribute("data-bs-theme") === "light") {
		htmlElm.setAttribute("data-bs-theme", "dark");
	} else {
		htmlElm.setAttribute("data-bs-theme", "light");
	}
}

function loadUrl() {
	document.getElementById("web_browser_content_iframe").src = document.getElementById("urlInput").value;
}

function getFolderHtml(folder_name) {
	return ` 
	<div ondblclick="ctxOpenFile()"><input type="radio" class="btn-check" name="file_list" id="${folder_name}" autocomplete="off" data-bs-item-ftype='dir'>
  <label class="btn btn-outline-secondary border-0" for="${folder_name}"><i class="bi bi-folder2"></i> ${folder_name}</label></div>
  `;
}


function getFileHtml(file_name) {
	let fileTypeIcon = '';
	if (file_name.includes('.')) {
		fileTypeIcon = 'bi-filetype-' + file_name.split('.').pop();
	}
	return `<div ondblclick="ctxOpenFile()"><input type="radio" class="btn-check" name="file_list" id="${file_name}" autocomplete="off" data-bs-item-ftype='file'>	
	<label class="btn btn-outline-secondary border-0" for="${file_name}"><i class="bi bi-file-earmark ${fileTypeIcon}"></i> ${file_name}</label></div>`;
}

function loadParentFilePath() {
	let parentPath = buildPathBrowser(document.getElementById('filePathInput').value, '..');
	document.getElementById('filePathInput').value = parentPath;
	loadFilePath();
}

function loadFilePath() {
	let selectedPath = document.getElementById('filePathInput').value;
	document.getElementById("file_browser_content_browser").innerHTML = '';
	let pathType = checkForValidPath(selectedPath);
	if (pathType === 'dir') {
		let lsListItems = rmx_fs_exec_readdir(selectedPath, '');
		for (let i = 0; i < lsListItems.length; i++) {
			let itemPath = buildPathBrowser(selectedPath, lsListItems[i]);
			let pathType = checkForValidPath(itemPath);
			if (pathType === 'file') {
				document.getElementById("file_browser_content_browser").innerHTML = document.getElementById("file_browser_content_browser").innerHTML + getFileHtml(lsListItems[i]);
			} else if (pathType === 'dir') {
				document.getElementById("file_browser_content_browser").innerHTML = document.getElementById("file_browser_content_browser").innerHTML + getFolderHtml(lsListItems[i]);
			}
		}
	} else {
		document.getElementById("file_browser_content_browser").innerHTML = '<div class="alert alert-danger" role="alert">Invalid path</div>';
	}
}

function saveNewFileBrowser(isFile) {
	let selectedPath = document.getElementById('filePathInput').value;
	if (isFile) {
		let targetPath = document.getElementById('file_browser_newfile-content_val').value;
		let newTargetFile = buildPathBrowser(selectedPath, targetPath);
		rmx_fs_exec_writeFile(newTargetFile, new Date().toISOString());
		loadFilePath();
	} else {
		let targetPath = document.getElementById('file_browser_newfolder-content_val').value;
		let newTargetDirectory = buildPathBrowser(selectedPath, targetPath);
		rmx_fs_exec_mkdir(newTargetDirectory);
		loadFilePath();
	}
	closeNewFileBrowser();
}

function closeNewFileBrowser() {
	document.getElementById("file_browser_newfile-content-popover").popOverObject.hide();
	document.getElementById("file_browser_newfolder-content-popover").popOverObject.hide();
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

function getSelectedItem() {
	var fileItems = document.getElementsByName('file_list');
	for (let i = 0; i < fileItems.length; i++) {
		if (fileItems[i].checked) {
			return document.getElementById(fileItems[i].id);
		}
	}
}

function ctxOpenFile() {
	let selectedItem = getSelectedItem();
	if (selectedItem) {
		let selectedPath = document.getElementById('filePathInput').value;
		let targetPath = buildPathBrowser(selectedPath, selectedItem.id);
		if (selectedItem.getAttribute('data-bs-item-ftype') === 'dir') {
			document.getElementById('filePathInput').value = targetPath;
			loadFilePath();
		} else {
			openTextEditor();
		}
	}
}

function ctxDeleteFile() {
	let selectedItem = getSelectedItem();
	if (selectedItem) {
		let selectedPath = document.getElementById('filePathInput').value;
		let targetPath = buildPathBrowser(selectedPath, selectedItem.id);
		let pathType = checkForValidPath(targetPath);
		if (pathType === 'dir' || pathType === 'file') {
			if (selectedItem.getAttribute('data-bs-item-ftype') === 'dir') {
				rmx_fs_exec_rmdir(targetPath);
				loadFilePath();
			} else {
				rmx_fs_exec_unlink(targetPath);
				loadFilePath();
			}
		}

	}
}

function setupSystem() {
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
			let popConfig = {}
			if (popEl.hasAttribute('data-bs-target-html')) {
				popConfig.content = document.getElementById(popEl.getAttribute('data-bs-target-html'));
				popConfig.html = true;
			}
			popEl.popOverObject = new bootstrap.Popover(popEl, popConfig);
		});
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	} catch (e) { console.log(e); }
	if (window.addEventListener) {
		document.getElementById('dock').addEventListener('mouseover', addPrevClass, false);
	}
	let enterTriggerElements = [['urlInput', loadUrl], ['filePathInput', loadFilePath]]
	enterTriggerElements.forEach(function (pair) {
		document.getElementById(pair[0]).addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				pair[1]();
			}
		});
	});
	document.getElementById("file_browser_content_browser").addEventListener('contextmenu', function (event) {
		if (getSelectedItem()) {
			event.preventDefault();
			let contextmenu = document.getElementById("file-context-menu");
			contextmenu.style.left = event.pageX + 'px';
			contextmenu.style.top = event.pageY + 'px';
			contextmenu.style.display = "block";
		}
	});

	document.addEventListener("click", function (event) {
		document.getElementById("file-context-menu").style.display = 'none';
	});
	localStorage.setItem('rmx_fs/item_type/', 'dir');
	setUpAISystem();
}