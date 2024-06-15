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