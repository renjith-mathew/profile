function setUpAISystem() {
	let enterTriggerElements = [['chatInput', webGpuTokens], ['calcInput', mathWebGpuTokens], ['archPromptInput', archWebGpuTokens]]
	enterTriggerElements.forEach(function (pair) {
		var elementTrigger = document.getElementById(pair[0]);
		if (elementTrigger) {
			elementTrigger.addEventListener('keypress', function (event) {
				if (event.key === 'Enter') {
					pair[1]();
				}
			});
		}
	});
}

async function initProfileChatTransformersPipeline() {
	if ('ort_inference_session' in window) {
		return;
	}
	//ort-wasm.wasm, ort-wasm-simd.wasm, ort-wasm-simd-threaded.wasm, ort-wasm-threaded.wasm
	ort_inference_session = await ort.InferenceSession.create('models/pmodel.onnx');
	document.getElementById('chatInput').removeAttribute('disabled');
	document.getElementById('archPromptInput').removeAttribute('disabled');
	document.getElementById('calcInput').removeAttribute('disabled');
	document.getElementById("pchatonnxwaitalert").remove();
	document.getElementById("achatonnxwaitalert").remove();
	document.getElementById("mchatonnxwaitalert").remove();
}


BPE_VOCAB_LIST = ['<unk>', '<s>', '</s>', ' ', ',', 's', ' and', 'ing', ' the', 'e', 'is', ' in', 'w', 'y', 'are', ' a', ' web',
	' soft', ' of', 't', 'l', ' java', ' engineer', 'for', ' th', ' skills', 'op', ' experience', 'c', 'o', 'at', ' j',
	'ch', 'd', ' develop', 'site', 'g', ' data', 'ment', ' application', ' with', 'ed', 'es', 'er', 'm', ' to',
	'lar', 'me', ' ha', ' proficien', ' are', ' sp', ' wh', ' framework', ' dev', ' enterprise', ' technologi',
	'script', 'se', 'ial', 'p', ' b', ' management', 'do', 'ring', 'r', ' profil', 'f', ' bi', ' so', ' serv',
	'ge', ' sq', ' boot', ' tool', 'le', ' cl', ' design', ' build', ' use', 'ure', ' co', ' i', 'ly', 'db',
	'a', 'rac', 'ent', ' git', ' service', 'has', 'ess', 'angu', 'sq', 'ut', ' system', 'v', 'al', ' abo', ' mo',
	' pl', 'x', ' ma', ' c', 'lab', 'ud', ' language', ' pyt', ' hi', ' developer', ' expert', ' you', 'h',
	'ark', ' work', 'ce', ' su', ' de', ' vari', 'ke', 'ons', 'ad', 'fo', ' test', ' scal', ' platform',
	'port', 'lio', 'bil', ' performan', 'on', ' o', 'or', 'onal', ' hav', ' as', ' showcase', 'ise', 'ous',
	' database', ' fro', 'ie', ' process', ' includ', ' highl', ' et', ' maintain', ' da', 'sp', ' it',
	'query', 'z', 're', ' manag', 'ation', ' li', 'cal', 'ate', 'ee', ' milli', ' skill', ' product',
	' client', ' do', ' wide', 'ro', 'cp', ' importan', 'ion', 'ou', ' list', 'ct', 'u', ' intelli',
	'base', 'ot', 'n', ' techni', 'pil', 'let', ' json', 'gree', ' lin', ' sw', 'bern', ' learn', 'pers',
	' al', ' model', 'ake', ' team', ' ecosystem', 'id', 'now', 'illi', ' comple', ' whi', ' per', ' lo',
	'orm', ' continuous', 'able', ' ke', ' di', ' balancer', ' shell', ' n', 'ir', 'so', 'own', 'verse',
	'ka', ' architect', ' manage', 'de', ' teams', ' sy', ' exadata', 'struct', ' other', 'ht', 'tron',
	' programm', ' volume', ' analy', 'infra', ' on', 'ml', ' st', 'ema', ' visual', 'ition', 'ear', 'en', ' he',
	' set', 'fin', 'sona', ' transform', ' cluster', ' suit', 'udi', 'ter', 'source', ' main', ' wi', 'veral',
	' resource', ' time', ' inter', ' app', 'sel', 'cli', ' am', ' ti', 'it', ' g', ' function', ' inform',
	' respons', 'rtific', 'ow', 'um', 'ind', 'ven', 'ers', 'eni', ' cs', 'ence', ' be', 'tru', ' timelines',
	'stra', ' industr', ' leve', 'stri', 'sion', ' wel', ' assembly', ' require', 'cond', 'ic', 'sh', ' not',
	'ance', ' request', 'can', ' make', 'shar', ' ka', 'view', ' abilit', ' maint', ' buil', 'j', 'ker', 'ira',
	'ord', ' onboard', 'oth', ' reac', 'here', 'est', 'ine', 'auth', ' train', 'us', ' deploy', ' showcas', 'ange',
	'rec', 'up', ' provide', 'q', ' kerberos', ' project', ' interact', ' servic', ' popular', ' resu', ' m',
	' script', ' dec', ' primar', ' mentoring', 'i', ' comm', ' certifi', 'ck', ' kube', ' sc', 'rne',
	'communication', ' conta', ' effective', 'ub', ' ai', 'bo', 'main', 'frame', ' environment',
	' methodolog', 'mat', 'tes', 'vel', 'ache', ' handl', 'elec', 'ay', ' allow', 'ep', ' secur', ' financ',
	' coll', 'use', 'racti', ' tra', ' include', ' configur', 'alth', 'ma', ' education', ' analytic',
	'ference', 'sure', 'bra', ' focus', ' highlight', 'et', ' inv', ' ap', 'all', ' bec', 'cul', ' purpose',
	'two', ' enable', 'ue', 'ional', ' additional', ' va', 'nd', ' an', 'cation', ' back', 'lla', 'ces',
	' prof', 'cru', 'abilit', 'cial', ' demonstrat', ' describe', ' any', ' te', 'size', ' or', ' re',
	' automat', 'round', ' its', ' manipulati', 'ques', ' man', ' by', 'lp', 'tin', ' ensur', ' relation',
	' sm', ' availab', 'cap', ' know', 'tom', 'work', 'ld', 'cus', ' relat', ' high', ' increasing', 'ough',
	'lu', 'set', 'led', ' deliver', ' cont', 'end', ' amount', 'sive', 'ask', ' page', 'rn', 'in', 'ribut',
	' po', 'ng', ' ac', 'ip', ' collaborat', ' will', ' qualit', ' thr', ' interactiv', ' perform',
	' extensive', ' mode', 'fu', 'but', 'ution', 'ecom', 'ext', 'iven', ' ne', ' sol', 'nt', ' fe',
	' mak', 'ight', ' containeriz', ' bas', ' problem', ' efficient', 'ar', ' k', 'ase', 'qui', 'tenti',
	' deployment', 'olv', ' improv', ' specialize', ' extract', ' agil', 'age', ' stor', ' technolog',
	' encompass', ' streamlin', ' detail', ' relevan', 'ption', ' help', ' leader', ' pa', 'curi',
	' integr', ' comput', 'ibilit', ' lead', ' role', ' need', 'ication', ' creat', 'k', ' addition',
	' connect', ' facilitat', ' simplif', ' success', ' under', ' part', 'mber', 'bal', ' ensure',
	'fie', ' enabl', ' quali', 'compl', ' private', ' specific', 'b', '.'];
BPE_VOCAB_MAP = new Map(BPE_VOCAB_LIST.map((tokenstring, tokenindex) => [tokenstring, tokenindex]));

function approxBPE(inputText) {
	const tokens = [];
	let remainingText = " " + inputText.trim();
	let attempts = 0;
	while (remainingText.length > 0) {
		for (let i = remainingText.length; i > 0; i--) {
			let token = BPE_VOCAB_MAP.get(remainingText.substring(0, i));
			if (token !== undefined) {
				remainingText = remainingText.slice(i);
				tokens.push(token);
				break;
			}
		}
		attempts++;
		if (attempts > inputText.length) {
			return tokens;
		}
	}
	return tokens;
}


function temp_argmax(logits) {
	let maxIndex = 0;
	let maxValue = logits[0];
	for (let i = 1; i < logits.length; i++) {
		if (logits[i] > maxValue) {
			maxValue = logits[i];
			maxIndex = i;
		}
	}
	return maxIndex;
}

function temp_sample_TemperatureAndRepetitionPenalty(logits, temperature, repetitionPenalty, previousTokens) {
	if(temperature<0.1){
		temperature = 0.1;
	}
	if(repetitionPenalty<1){
		repetitionPenalty = 1.0;
	}
	//apply temp
	const probabilities = logits.map(logit => Math.exp(logit / temperature) /
		logits.reduce((sum, value) => sum + Math.exp(value / temperature), 0));
	//apply rep penalty
	if (repetitionPenalty > 1.0 && previousTokens.length > 0) {
		for (let i = 0; i < probabilities.length; i++) {
			if (previousTokens.includes(i)) {
				probabilities[i] = probabilities[i] ** (1 / repetitionPenalty);
			}
		}
	}
	const total = probabilities.reduce((sum, value) => sum + value, 0);
	const randomValue = Math.random() * total;
	let accumulated = 0;
	for (let i = 0; i < probabilities.length; i++) {
		accumulated += probabilities[i];
		if (accumulated >= randomValue) {
			return i;
		}
	}
	return temp_argmax(logits);
}

function sampleOutputToken(results, previousTokens) {
	let logits = results['output'].data;
	try {
		let temperature = document.getElementById('llmtempsetting').value;
		let repetitionPenalty = document.getElementById('llmreppensetting').value;
		if (temperature > 1 || repetitionPenalty > 1) {
			return temp_sample_TemperatureAndRepetitionPenalty(logits, temperature, repetitionPenalty, previousTokens);
		}
	} catch (e) {
		console.log(e);
	}
	return temp_argmax(logits);
}

function startProfileChat(elm) {
	let inputContent = elm.textContent;
	clearChat();
	document.getElementById("chatInput").value = inputContent;
	webGpuTokens();
}

function startAgentChat(elm) {
	let inputContent = elm.textContent;
	clearMathChat();
	document.getElementById("calcInput").value = inputContent;
	mathWebGpuTokens();
}

function startArchChat(elm) {
	let inputContent = elm.textContent;
	clearArchChat();
	document.getElementById("archPromptInput").value = inputContent;
	archWebGpuTokens();
}

function encodeTokens(inputContent) {
	inputContent = inputContent.toLowerCase().replace(/[^a-z,.]+/gi, ' ').replace(/\s+/g, ' ');
	return approxBPE(inputContent);
}


function decodeTokens(token_id) {
	if (token_id > 2 && token_id < BPE_VOCAB_LIST.length) {
		return BPE_VOCAB_LIST[token_id];
	}
	return "";
}

async function webGpuTokens() {
	let inputContent = document.getElementById("chatInput").value;
	document.getElementById("chatInput").value = "";
	document.getElementById("chat_content_progress_bar").style.width = '0%';
	var chatHistoryElement = document.getElementById("chatHistory");
	chatHistoryElement.innerHTML = chatHistoryElement.innerHTML + "<div><i class='bi bi-file-person'></i> " + inputContent + "</div><div><i class='bi bi-cpu'></i><span></span></div> ";
	chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
	try {
		var chatResponseElement = chatHistoryElement.querySelectorAll('.bi-cpu + span')[chatHistoryElement.querySelectorAll('.bi-cpu + span').length-1];
		input_ids = encodeTokens(inputContent);
		generated_tokens = []
		let maxAvailableTokens = 256 /*max sequence length of trained model*/ - input_ids.length;
		const tickToken = () => new Promise(res => setTimeout(res, 0));
		if (input_ids.length > 0 && maxAvailableTokens > 0) {
			for (let count = 0; count < maxAvailableTokens; count++) {	
				let percent = (count / maxAvailableTokens) * 100;
				document.getElementById('chat_content_progress_bar').style.width = percent + '%';
				await tickToken();			
				let bigIntArray = input_ids.map(input_id => BigInt(input_id));
				const feeds = { 'tokens': new ort.Tensor('int64', BigInt64Array.from(bigIntArray), [1, bigIntArray.length]) };
				const results = await ort_inference_session.run(feeds);
				let output_token_id = sampleOutputToken(results,input_ids);				
				input_ids.push(output_token_id);
				if(count>0){
					if (output_token_id == 1 /* bos token id*/ || output_token_id == 2 /* eos token id*/) {
						break;
					}				
				}
				let decodedText = decodeTokens([output_token_id]);
				chatResponseElement.textContent = chatResponseElement.textContent + decodedText;
				chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
			}
		} else {
			document.getElementById("chatHistory").textContent = 'invalid prompt. please enter a short prompt.';
		}
	} catch (e) {
		console.log(e);
		document.getElementById("chatHistory").textContent = 'sorry, chat is not available';
	}	
	document.getElementById("chat_content_progress_bar").style.width = '0%';
	chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
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
	document.getElementById("MathAssistantOutput").innerHTML = document.getElementById("MathAssistantOutput").innerHTML + "<div><i class='bi bi-file-person'></i> " + inputContent + "</div><div><i class='bi bi-robot'></i> " + chatResponse + "</div>";
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
	document.getElementById("arch_prompt_graphviz").textContent = chatResponse;
	document.getElementById("arch_diagram_Output").scrollTop = document.getElementById("arch_diagram_Output").scrollHeight;
}

function clearArchChat() {
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_prompt_q").innerHTML = "&nbsp;";
	document.getElementById("arch_prompt_graphviz").innerHTML = "&nbsp;";
}