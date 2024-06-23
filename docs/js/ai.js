function setUpAISystem(){
    let enterTriggerElements = [['chatInput', webGpuTokens], ['calcInput', mathWebGpuTokens], ['archPromptInput', archWebGpuTokens]]
	enterTriggerElements.forEach(function (pair) {
        var elementTrigger = document.getElementById(pair[0]);
        if(elementTrigger){
            elementTrigger.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    pair[1]();
                }
            });
        }		
	});
	transformers_env = __webpack_exports__env;
	transformers_pipeline = __webpack_exports__pipeline;
	window.addEventListener("message", function(event) {
		if (typeof event.data === "object") {
		  var messageType = event.data.messageType;
		  if (messageType==='toggleTheme'){
			toggleTheme();
		  }
		}
	  });
}

function startProfileChat(elm){
	let inputContent = elm.textContent;
	clearChat();
	document.getElementById("chatInput").value = inputContent;
	webGpuTokens();
}

function startAgentChat(elm){
	let inputContent = elm.textContent;
	clearMathChat();
	document.getElementById("calcInput").value = inputContent;
	mathWebGpuTokens();
}

function startArchChat(elm){
	let inputContent = elm.textContent;
	clearArchChat();
	document.getElementById("archPromptInput").value = inputContent;
	archWebGpuTokens();
}

function webGpuTokens() {
	let inputContent = document.getElementById("chatInput").value;
	document.getElementById("chatInput").value = "Waiting for neural network results ...";
	var chatResponse = "Not implemented yet";
	document.getElementById("chatInput").value = "";
	document.getElementById("chatHistory").innerHTML = document.getElementById("chatHistory").innerHTML+"<div><i class='bi bi-file-person'></i> " + inputContent + "</div><div><i class='bi bi-cpu'></i> " + chatResponse + "</div>" ;
	document.getElementById("chatHistory").scrollTop = document.getElementById("chatHistory").scrollHeight;
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
	document.getElementById("MathAssistantOutput").innerHTML = document.getElementById("MathAssistantOutput").innerHTML+"<div><i class='bi bi-file-person'></i> " + inputContent + "</div><div><i class='bi bi-robot'></i> " + chatResponse + "</div>";
	document.getElementById("MathAssistantOutput").scrollTop = document.getElementById("MathAssistantOutput").scrollHeight;
}

function clearMathChat() {
	document.getElementById("calcInput").value = "";
	document.getElementById("MathAssistantOutput").innerHTML = "";
}

function archWebGpuTokens() {
	let inputContent = document.getElementById("archPromptInput").value;
	var chatResponse = "Not implemented yet";
	document.getElementById("arch_prompt_q").textContent = inputContent;
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_prompt_graphviz").textContent =  chatResponse;
	document.getElementById("arch_diagram_Output").scrollTop = document.getElementById("arch_diagram_Output").scrollHeight;
}

function clearArchChat() {
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_prompt_q").innerHTML = "&nbsp;";
	document.getElementById("arch_prompt_graphviz").innerHTML = "&nbsp;";
}