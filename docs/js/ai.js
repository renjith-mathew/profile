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
	clearChat();
}

async function initAgentChatTransformersPipeline() {
	if ('ort_agent_inference_session' in window) {
		return;
	}
	//ort-wasm.wasm, ort-wasm-simd.wasm, ort-wasm-simd-threaded.wasm, ort-wasm-threaded.wasm
	ort_agent_inference_session = await ort.InferenceSession.create('models/tmodel.onnx');
	document.getElementById('calcInput').removeAttribute('disabled');	
	clearArchChat();
	clearMathChat();
	Viz.instance()
		.then(viz => {
			viz_instance = viz;
			document.getElementById('archPromptInput').removeAttribute('disabled');
		})
		.catch(error => {
			console.error(error);
		});
}

BPE_VOCAB_LIST = JSON.parse(atob(
	'WyI8dW5rPiIsIjxzPiIsIjwvcz4iLCIsIiwiICIsImFuZCIsIi4iLCJpcyIsIiBpbiIsIiB0aGUiLCIgc29mdHdhcmUiLCJpbmci' +
	'LCIgb2YiLCJzIiwiIGEiLCIgZm9yIiwiIGVuZ2luZWVyIiwiIHNraWxscyIsIiBzIiwiIGV4cGVyaWVuY2UiLCJ5IiwiIFRoZSIs' +
	'IiBhcmUiLCIgd2Vic2l0ZSIsIiB3aXRoIiwiIGFwcGxpY2F0aW9ucyIsIiBTIiwiY2giLCJ0IiwiIHRvIiwiZWQiLCIgZW50ZXJw' +
	'cmlzZSIsImUiLCIgdGVjaG5vbG9naWVzIiwiYXQiLCIgVGgiLCIgaGFzIiwiIEphdmEiLCIgSmF2YVNjcmlwdCIsIiBTcHJpbmci' +
	'LCIgd2giLCIgZnJhbWV3b3JrcyIsIiBEZXZPcHMiLCIgZGV2ZWxvcG1lbnQiLCIgZGF0YSIsIiBiIiwic2UiLCIgSGFkb29wIiwi' +
	'IFdlYiIsIiB0b29scyIsIiBtYW5hZ2VtZW50IiwiIHByb2ZpY2llbiIsIiB3ZWIiLCIgdGgiLCIgSSIsImdlIiwiIFNRTCIsIiB1' +
	'c2VkIiwiIEJpZyIsIiBwcm9maWxlIiwiIEFuZ3VsYXIiLCJvbWUiLCJhbCIsIiBCb290IiwiIE9yYWNsZSIsImVyIiwiIERhdGEi' +
	'LCIgTSIsIiBldGMiLCIgZXNzZW50aWFsIiwibHkiLCIgc3lzdGVtcyIsIiBhcyIsIiBDIiwibGFyIiwiIENsb3VkIiwiIFBMU1FM' +
	'IiwiIGRldmVsb3BlciIsIiBkZXZlbG9waW5nIiwiIFNraWxsIiwiIFZpcyIsIiBwb3J0Zm9saW8iLCIgeW91IiwiIHZhcmkiLCIg' +
	'c2hvd2Nhc2UiLCJtIiwiIGRlc2lnbiIsIiB0aGF0Iiwib25hbCIsIiBKYXZhRUUiLCIgaW5jbHVkIiwiIEEiLCIgRXhwZXJ0Iiwi' +
	'b3VzIiwiaWFsIiwicnRpZmljIiwiIEpTT04iLCJwZXJzIiwiIEFXUyIsIiBDb3BpbG90IiwiIHNjYWxlIiwiIHdpZGUiLCIgSlNQ' +
	'IiwiIENVREEiLCIgbGlzdCIsIiBrZSIsIiBmcm8iLCIgQXp1cmUiLCIgbWFpbnRhaW4iLCIgbWFuYWciLCIgYWJvdXQiLCJsIiwi' +
	'dmUiLCIgaGEiLCIgREIiLCJlcyIsIiBTZXJ2bGV0cyIsIkMiLCIgSkRCQyIsIiBMZWFybmluZyIsIiBsaWtlIiwiIG1pbGxpIiwi' +
	'IFJlIiwiIGxlYXJuaW5nIiwiIEhpYmVybmF0ZSIsIiBTbm93Zmxha2UiLCJOIiwiIEFuZHJvaWQiLCIgRXhhZGF0YSIsIiBHQ1Ai' +
	'LCJkIiwiIGNsaWVudCIsIiBjbG91ZCIsIiBTeWJhc2UiLCJ1YWwiLCIgc2VydmVyIiwiIEV4cGVyaWVuY2UiLCIgUHJvY2VzcyIs' +
	'IiBsYW5ndWFnZXMiLCIgdGVzdGluZyIsIm8iLCJpb24iLCIgT1JNIiwiIFNxb29wIiwiY3QiLCIgSFRNTCIsIiBDU1MiLCIgU3R1' +
	'ZGlvIiwiIHdvcmsiLCIgYnVpbGRpbmciLCIgTG9hZCIsIiBEb2NrZXIiLCJhciIsIiBOIiwiaGVsbCIsImlsbCIsIiBqUXVlcnki' +
	'LCIgR2l0IiwiIHNjcmlwdHMiLCJzbyIsIiBTZXJ2aWNlcyIsIiBTcGFyayIsImlvbnMiLCJhIiwiIG9uIiwiIFRyYW5zZm9ybWVy' +
	'cyIsIiBidWlsZHMiLCIgZGF5IiwiIEdpdGxhYiIsIngiLCIgTGludXgiLCIgV2luZG93cyIsImVtYSIsIiBhbmFseXNpcyIsIiBw' +
	'cm9kdWN0cyIsImljYWwiLCIgZGUiLCIgZWNvc3lzdGVtIiwiIGNvbXBsZSIsIiBkaSIsIiBhbCIsIiBCYWxhbmNlciIsIiB0ZWFt' +
	'cyIsIiB0aGVtIiwiZmljaWVuY3kiLCIgRWNsaXBzZSIsIiBTb25hciIsIiBwbGF0Zm9ybXMiLCJzaW9uIiwiIG93bmVyIiwiY29k' +
	'ZSIsIiBwZXJmb3JtYW5jZSIsIiBQeXRvcmNoIiwidmVyc2UiLCIgTWF2ZW4iLCJpciIsIiBKTWV0ZXIiLCIgaW1wb3J0YW50Iiwi' +
	'IFBybyIsIiBwcm9jZXNzaW5nIiwiaXNlIiwiIHN1IiwiIGRlc2NyaWJlIiwiIEFzc2VtYmx5Iiwib2JpbGUiLCIgU2VsZW5pdW0i' +
	'LCIgbiIsIm9yIiwiIHZvbHVtZXMiLCJ0cnUiLCIgUHl0aG9uIiwiTCIsInIiLCIgaW50ZWxsaWdlbmNlIiwiIEthZmthIiwiIHdo' +
	'aSIsIiBoaWdobCIsIiBJdCIsIiBEZWZpbml0aW9uIiwiIFQiLCJUaCIsInNvdXJjZSIsIiBNYW5hZ2VtZW50IiwiIHNraWxsIiwi' +
	'IGFtIiwiIEpJUkEiLCIgV2lyZVNoYXJrIiwiIG1vYmlsZSIsIiBtYW5hZ2UiLCIgdGkiLCIgcGVyZm9ybWFuIiwiIGFwcGxpY2F0' +
	'aW9uIiwiIGluZm9ybWF0aW9uIiwib3VyY2UiLCIgdGltZSIsIiBNYSIsImluZSIsIiBsZXZlIiwiIGVuZ2luZWVyaW5nIiwiYW5n' +
	'ZSIsIiBJbmZyYXN0cnVjdHVyZSIsIiBKVk0iLCJ1Y2giLCIgZSIsIiBzZXJ2aWNlIiwiIHBlciIsIiBhcmNoaXRlY3QiLCIgYm9v' +
	'dHN0cmFwIiwiIHRpbWVsaW5lcyIsImN5IiwiaWciLCJhbiIsIiBhZ3JlZW1lbnRzIiwiIG1haW50ZW5hbmNlIiwic3RyaSIsIiBy' +
	'ZXNwb25zIiwiY29uZCIsIlMiLCJ1ciIsIiByIiwiYXJ5IiwidmVyYWwiLCIgSiIsIiBtYWtlIiwiIGNvbnRpbnVvdXMiLCIgbWEi' +
	'LCIgQXBhY2hlIiwiIFJlYWN0IiwiY2FuIiwiIGZyYW1ld29yayIsIiByZSIsIiBleHBlcnRpc2UiLCIgRSIsIiByZXF1aXJlbWVu' +
	'dHMiLCJUIiwiU09BIiwiZWVwIiwiIHNob3djYXMiLCIgTGFuZ3VhZ2UiLCIgVGVzdCIsIiBBSSIsIk0iLCJWIiwiIGJ1aWx0Iiwi' +
	'IGFpIiwib25zIiwiIGRhdGFiYXNlcyIsIiBEZXYiLCIgU3dpbmciLCIgUHJvZ3JhbW1pbmciLCIgU1dUIiwiIHByb2dyYW1taW5n' +
	'IiwiUCIsImNvciIsInRpb24iLCIgYnVpbGQiLCJsbyIsIiBDb21wdXQiLCIgYm90aCIsInRsYWIiLCJpbmZvciIsInJlZSIsInVz' +
	'c2kiLCIgYmUiLCJpdGgiLCIgQWxnIiwidm9sdSIsIm9naWMiLCIgTmV0d29ya3MiLCJhdHVyIiwiYyIsIiBOZSIsIm1zIiwiIG90' +
	'aGVyIiwiZHMiLCJhcmNoIiwiV1QiLCIgcHJvdmlkZSIsIiBMIiwiIEtlcmJlcm9zIiwiIFByb2ZpbGluZyIsIm9udGUiLCIgc2V0' +
	'dXAiLCIgY2x1c3RlciIsIiBkZXNpZ25lZCIsImxlIiwiZXAiLCIgbWUiLCIgU2UiLCIgQ3NoYXJwIiwiIEQiLCIgU0MiLCIgaW50' +
	'ZXJhY3QiLCIgQ29ib2wiLCIgSGlnaCIsIiBJbnRlbGxpSiIsIiBUZWFtIiwiIGNvbmZpZ3VyYXRpb24iLCJ1cyIsIiBzZXJ2aWMi' +
	'LCIgcG9wdWxhciIsIiBLdWJlcm5ldGVzIiwiIFRlY2huIiwiIHJlc3VtZSIsIiBtIiwiIHByaW1hciIsIiB3ZWwiLCJjYWwiLCIg' +
	'UkFDIiwiIGNlcnRpZmkiLCIgYWxnZWJyYSIsIiBwcm9qZWN0cyIsImxpbmUiLCIgTWFpbmZyYW1lIiwiYXV0aCIsImN1bCIsInVp' +
	'dCIsIm50ZXJ2aWV3cyIsIiBzZSIsIiBNUSIsIiBpbmR1c3RyaWVzIiwiIGJlYyIsIiByZXF1ZXN0cyIsIm9udGludW91cyIsIiBP' +
	'bmJvYXJkaW5nIiwiIHllYXJzIiwiIENWUyIsIiBpdCIsIm5nIiwiIG9yIiwiIHNlcnYiLCIgc2hvdyIsIiBEYXRhYmFzZSIsIiBG' +
	'dW5jdGlvbmFsIiwiIFRyYWluIiwiIGRhdGFiYXNlIiwiIGNvbnRhIiwid29ya2luZyIsImdyZWUiLCIgZWZmZWN0aXZlbHkiLCJz' +
	'dCIsImljcyIsImVtZW50IiwiIFByb2ZpY2llbiIsImxlY3Ryb24iLCIgTWVudG9yaW5nIiwiIGluZnJhc3RydWN0dXJlIiwiIGZ1' +
	'bmN0aW9uYWwiLCIgc2VydmljZXMiLCIgZGVjIiwiIEFwcCIsIiBtZXRob2RvbG9naWVzIiwiaHViIiwiIGFsbG93IiwiIGhhbmRs' +
	'IiwiIHF1ZXJ5aW5nIiwiIHRlY2huIiwiIGNvbGwiLCIgZGVwbG95aW5nIiwiIGxhbmd1YWdlIiwiIFBsYXRmb3JtIiwiIHByYWN0' +
	'aWNlcyIsIiB0cmF2ZWwiLCIgQ2x1c3RlcnMiLCJiaWxpdHkiLCIgU09BIiwiIGhlYWx0aCIsIiBub3QiLCIgZCIsIiBkb21haW5z' +
	'IiwiIGVkdWNhdGlvbiIsInRoZXIiLCIgaGUiLCIgY29tbWVyY2UiLCJoZXJlIiwiIGZvY3VzIiwiIGhpZ2hsaWdodCIsIiBkbyIs' +
	'ImRlcyIsIiBpbmNsdWRlIiwiIFN1cmUiLCJhdXMiLCIgaW52ZXN0bWVudCIsIiBmaW5hbmNpYWwiLCIgamF2YSIsIiByZWZlcmVu' +
	'Y2VzIiwiIERhIiwiIEdvIiwiIHByb2Zlc3Npb25hbCIsIiBtb3JlIiwidHdvIiwiIGFwcHMiLCIgZW5naW5lZXJzIiwiIHRlYW0i' +
	'LCIgZW5hYmxlIiwiIERldmVsb3AiLCIgRW5naW5lZXIiLCIgc2V0IiwibWVudCIsIiBoaSIsImNlIiwiIEFkZGl0aW9uYWwiLCJj' +
	'YXRpb25zIiwibiIsInRybyIsImFibGUiLCIgcHJvZ3JhbW0iLCIgdGUiLCIgaSIsIm5kIiwiIGFuIiwiIHBsYXRmb3JtIiwiYWJp' +
	'bGl0eSIsIiBGcmFtZXdvcmsiLCJjcnUiLCJjaWFsIiwiIGFueSIsImxlY29tbXVuaWNhdGlvbnMiLCIgZGVzaWduaW5nIiwiZ2xl' +
	'IiwiZXciLCIgYW5hbHl0aWNzIiwiIGJhc2UiLCJsZWQiLCJheSIsIiBhbW91bnQiLCIgdGVjaG5pcXVlcyIsIiByZWxhdGlvbiIs' +
	'IiB3IiwiIHByb2Nlc3MiLCIgaGlnaCIsImFkIiwiIGF1dG9tYXQiLCIgYmFja2dyb3VuZCIsIiBlbnN1ciIsIiBHaXRIdWIiLCIg' +
	'YXZhaWxhYiIsIiBrbm93IiwiIHByb2Nlc3NlcyIsIiBtYW4iLCJldCIsIiBoIiwiIHZhbHVhYmxlIiwiIGluZHVzdHJ5Iiwib24i' +
	'LCJlbmQiLCJvbSIsIm91Z2giLCIgaW5jcmVhc2luZyIsIiBzZWN1cml0eSIsImVsbCIsIml0IiwiIHJlc291cmNlIiwib2Z0d2Fy' +
	'ZSIsImJ1dCIsIiBmIiwiIEJvb3RzdHJhcCIsIiBjYXBhYmlsaXRpZXMiLCIgc2hhciIsIiBjb21tdW5pY2F0aW9uIiwibXBvcnRh' +
	'bmNlIiwiR2l0bGFiIiwiIGRldmVsb3AiLCIgcmVxdWVzdCIsImFiIiwib2IiLCIgdGVhbXdvcmsiLCIgZGF0YXNldHMiLCIgYXJj' +
	'aGl0ZWN0dXJlIiwiIHBhZ2UiLCIgdGhyIiwiIHN0ciIsIm9uZyIsImNyIiwiREIiLCIgZGVwbG95IiwiZWN1cml0eSIsIiBhcHAi' +
	'LCIgcmVsYXQiLCIgZG90TkVUIiwiIGVudmlyb25tZW50Iiwia2kiLCIgc2NhbGFibGUiLCIgZGV2Iiwic2l2ZSIsIiB3aWxsIiwi' +
	'IERlIiwiIGNsaWVudHMiLCIgaW50ZXJhY3RpdiIsInJuIiwidWwiLCIgbW9kZSIsImVjaG5vbG9naWVzIiwiIHVwIiwiIEFtYXpv' +
	'biIsIiBleHRlbnNpdmUiLCIgcXVhbGl0eSIsIiBwbyIsIm9zcyIsInN1cmUiLCIgY2x1c3RlcnMiLCIgcHJvIiwiQmFsYW5jZXIi' +
	'LCJHaXQiLCJEYXRhIiwic2VydmljZXMiLCIgSGF2IiwiIFB5VG9yY2giLCIgZGVmaW5pdGlvbiIsIiBpbnNpZ2h0cyIsIiBzb2x1' +
	'dGlvbnMiLCIgbWFpbiIsImVudGlhbCIsInUiLCIgbWFzIiwiIHZhIiwiIHdvIiwiIHByb2ZpbCIsIiBtYW5pcHVsYXRpIiwiIHF1' +
	'YWxpIiwiIHRhc2tzIiwiIG1ha2luZyIsIiBpbnRlcnZpZXdzIiwiIGNvbnQiLCIgcmVzb3VyY2VzIiwiIHNldHMiLCIgbWFuYWdl' +
	'ciIsImljIiwiIHBlcmZvcm0iLCJ0aCIsIm9zdCIsIiBSdWJ5IiwiIFVuIiwiIHJvbGUiLCJmaWNhdGlvbnMiLCIgZGVwbG95bWVu' +
	'dCIsIiB0cmFpbmluZyIsIiBkZWxpdmVyeSIsInVuIiwiIEluIiwiY2EiLCJpZiIsImYiLCIgcHJvYmxlbSIsIiB1cyIsIml2ZW4i' +
	'LCIgZ2wiLCJvb2xzIiwiIGNvbW0iLCIgQ29kZSIsIiBxdWlja2x5IiwiIHNwZWNpYWxpemUiLCIgZXh0cmFjdCIsIiBvbmJvYXJk' +
	'aW5nIiwiIGoiLCJpdHkiLCIgTWFuYWdlIiwiIE5vZGUiLCIgZW5jb21wYXNzIiwiIGhlbHAiLCIgc3RyZWFtbGluIiwiIHRlY2hu' +
	'b2xvZ3kiLCJ0ZXN0IiwicHRpb24iLCJnaXQiLCIgaXRzIiwicmUiLCJyaWJ1dCIsImVsIiwiIGJhIiwiIGNvbiIsIiBmcm9udCIs' +
	'IkF1dGgiLCJ0b3AiLCIgcmVsZXZhbiIsIiBjb2xsYWJvcmF0b3JzIiwiY3VyaSIsIiBtYW5pcHVsYXRpb24iLCIgc29sdmluZyIs' +
	'ImluIiwiaWxlIiwiQSIsIiBWaSIsImgiLCJhdGUiLCIgbGEiLCIgQ3BwIiwiIEhlIiwiIFN3aWZ0IiwiIExlYWQiLCIgY3JlYXQi' +
	'LCIgdGV4dCIsIiBsZWFkIiwiIGNvbXB1dGluZyIsIiBkZXRhaWxzIiwiIG5lZWQiLCJwbGUiLCIgSlMiLCIgY2hhdCIsImFtIiwi' +
	'aWVzIiwiaWx5IiwiIGNvbnRhaW5lcml6IiwicHl0IiwiIEFQSSIsIiBGbG93IiwiIEtvdGxpbiIsIiBNQVRMQUIiLCIgUnVzdCIs' +
	'IiBUeXBlU2NyaXB0IiwiIGNvbm5lY3QiLCIgY3BwIiwiIGZpZWxkIiwiIGZ1bGxzdGFjayIsIiBpbnRlcmVzdGVkIiwiIHVuZGVy' +
	'IiwiIHNwZWNpYWxpc3QiLCIgT3ZlcmFsbCIsIiBTQVMiLCIgbGVhZGVyc2hpcCIsIiBTY2FsYSIsIiBCYXNpYyIsImRkaXRpb24i' +
	'LCIgVlMiLCIgZWZmaWNpZW50bHkiLCIgRGkiLCIgbWVudG9yaW5nIiwiIGp1IiwiIGVuYWJsIiwiIHNlcnZlIiwiIHNraWxsc2V0' +
	'IiwiIGludGVyIiwiIHRoZXJlIiwiYXNlIiwidHJpYnV0IiwiIGZyIiwiIGVuc3VyZSIsIiBsZWFybiIsIiBpbnRlZ3IiLCJ3YSIs' +
	'Im9yayIsInNrIiwiIEFuYWx5dGljcyIsIiBhY2NvbXBsaXNobWVudHMiLCIgc2VjdXJlIiwiIHNwZWNpZmljIiwiIHRoYW5rIiwi' +
	'IGFnaWxlIiwiY29udGFpbmVyaXphdGlvbiIsImZ1bCIsIiBiYWNrIiwiIHN0b3IiLCIgZWNvc3lzdGVtcyIsIiByZWFjaCIsImFj' +
	'dCIsIiBBbiIsIiBubyIsIiB0ZWNoIiwiIHNjcmlwdCIsImdldCIsIiBwIiwiIGltcHJvdiIsIiBBZCIsIiBJbXBvcnRhbiIsImVu' +
	'IiwiYmlsaXRpZXMiLCIgdG9vbCIsIiBkZWxpdmVyIiwiIGVmZmljaWVudCIsIiBmaW5hbmMiLCIgcmVzcG9uc2kiLCIgcGFydCIs' +
	'IiBvcGUiLCIgZW1waGFzaSIsIiBtZW1iZXJzIiwiIHB1cnBvc2UiLCIgdGFsayIsIiBNVkMiLCIgbmV0d29yayIsIiBsZXZlcmFn' +
	'IiwidW5pIiwiIHJlbGlhYmxlIiwiIGNvbGxhYm9yYXRpb24iLCIgaW1wb3J0YW5jZSIsInRhY2siLCJ2ZXJ5IiwiIGVhc2kiLCJl' +
	'YXNlIiwidWUiLCJpdGUiLCIgbW8iLCJhcmQiLCIgc3lzdGVtIiwiYWdlIiwicmlldCIsIiBpbXByb3ZlIiwicmVhcyIsIiBzaGVs' +
	'bCIsImciLCJ1YiIsIiBtZW50b3IiLCIgY28iLCIgYW5hbHl0aWMiLCIgcHJvamVjdCIsIiBzaW1wbGlmIiwiaWQiLCJlbnQiLCJq' +
	'ZWN0IiwiIFdpIiwiIHByb3AiLCJ5dGhvbiIsIiBBZ2lsZSIsIiBDaGF0R1BUIiwiIERldm9wcyIsIiBhbmFseXoiLCIgaW1wbGVt' +
	'ZW50IiwiIHByaW5jaXBsZXMiLCIgU2VydmVyIiwiIFNvbGFyaXMiLCIgSmlyYSIsIiBzaWRlIiwiIG5lY2VzcyIsImZsb3ciLCIg' +
	'Y29uZHVjdCIsIiBzdG9yYWdlIiwiIHJldHJpZXZhbCIsIiBjb21wbGV0ZWQiLCIgcHJpdmF0ZWx5IiwiIHJlc3BvbnNpdmUiLCIg' +
	'bW9kZWwiLCJmYWNlIiwiIGRhdCIsInRlbiIsIiBwcm92aWQiLCIgYWxsIiwib290IiwiIG5lIiwiIGZhY2lsaXRhdGUiLCIgcGEi' +
	'LCJ2ZXIiLCJzY3JpcHQiLCJ0aW1lIiwic3lzdGVtIiwiZGF5IiwiIG9uZSIsInlzdGVtIiwiIFNlcnZsZXQiLCJwcGxpY2F0aW9u' +
	'IiwiaWVudCIsIndhcmUiLCIgcGwiLCIgRW5naW5lIiwiZHVjdCIsIm50ZXJhY3QiLCJ3ZXIiLCIgc3VjY2VzcyIsIiBleHAiLCJ1' +
	'c2luZXNzIiwiIE92ZXIiLCIgQW5zaWJsZSIsIiBCaWdRdWVyeSIsIiBCbG9ja2NoYWluIiwiIENvbmZsdWVuY2UiLCIgR0NDIiwi' +
	'IEdyYWRsZSIsIiBJREVBIiwiIE1ha2UiLCIgTWF0cml4IiwiIE1vbmdvREIiLCIgTXlTUUwiLCIgTnVtUHkiLCIgT3BlbkdMIiwi' +
	'IE9wZW5jdiIsIiBQb2RtYW4iLCIgUG9zdGdyZVNRTCIsIiBTUWUiLCIgU2lnbmFsIiwiIFNvbHV0aW9uIiwiIFRlbnNvckZsb3ci' +
	'LCIgVlNDb2RlIiwiIFhjb2RlIiwiIGFkbWluaXN0cmF0IiwiIGVtcGxveWVycyIsIiBmZWF0dXJlcyIsIiBpT1MiLCIgbWVzc2Fn' +
	'ZSIsIiBucG0iLCIgc21vb3RoIiwiIGFib3ZlIiwiIGRldmljZXMiLCIgSlNUTCIsIiBpbnZvbHYiLCIgUGFuZGFzIiwiIGluZmVy' +
	'ZW5jZSIsIiBlZmZpY2llbmN5IiwiIFZlbG9jaXR5IiwiIHNwZWVkIiwiIENoYXQiLCIgb2JqZWN0IiwiIE1lZXQiLCIgcmVsaWFi' +
	'aWxpdHkiLCIgc3VjY2Vzc2Z1bCIsIiBkb2N1bWVudCIsIiBzY2FsYWJpbGl0eSIsIiB3cml0IiwiIGZyb250ZW5kIiwibmVzcyIs' +
	'ImZpYyIsIiBTY2llbnRpc3QiLCIgY2hhbGxlbmdlcyIsIiBxdWVzdGlvbnMiLCJuY2UiLCIgRWxlY3Ryb24iLCIgZW5nIiwiIHRy' +
	'IiwiYmxlcyIsInRlIiwiZXgiLCJzdGFuZCIsImV2IiwiYW50IiwiIGNyIiwiIHN0YSIsIiB2Iiwic2kiLCIgZmFjaWxpdGF0Iiwi' +
	'IHJlZHVjIiwiRSIsImkiLCJqIiwiY29tbWVyY2UiLCJzc2lvbmEiLCIgdGltZXMiLCIgZWFzIiwiIFNvZnQiLCJ3aW5nIiwiIGlu' +
	'Zm8iLCJsb3ciLCIgY29udGludSIsIiBjb2xsYWJvcmF0IiwiIGNvbW11bmljYXQiLCIgQmFzIiwiaXphdGlvbiIsInJrZSIsInJh' +
	'cCIsIiBIUEMiLCIgU2NyaXB0IiwiIFdoIiwiIGNvbXBvbmVudCIsIiBmb3VuZGF0aW9uIiwiIGxhbmRzY2FwZSIsIiBwYXJ0aWN1' +
	'bGFyIiwiIHBvc3Nlc3MiLCIgcm9idXN0IiwiIGJ1ZyIsImdybyIsIiBidXNpbmVzc2VzIiwiIG51bSIsIiBjb3N0cyIsImhvbGQi' +
	'LCIgdmlzdWFsIiwib3V0IiwiIGdvIiwiIHBvd2VyIiwiIFNvbCIsImFtcGxlIiwiIGN1ciIsIiBhc3NldCIsIiBzdXBwb3J0Iiwi' +
	'IExpc3QiLCJhdGl2ZSIsImFpbiIsIiBvcGVyYXRpb24iLCIgaW50ZWdyYXQiLCIgc2ltcGxpZnkiLCIgZ2l2ZSIsIiBOb3QiLCJs' +
	'aWVudCIsIlNUIiwiIGFiaWxpdGllcyIsInJvdSIsIiBkZXZlbG9wZXJzIiwiZW50bHkiLCIgYWxsbyIsIiBTdGEiLCJhc3RlciIs' +
	'IiBkZW0iLCIgZnUiLCIgTWFuYWciLCIgc2NhbCIsIiBzZWUiLCJhdGlvbnMiLCJsZXQiLCJhcyIsInJpdmUiLCJvcnQiLCJvcmQi' +
	'LCJybSIsInZlcnMiLCJyaWUiLCJpdmUiLCIgYWltIiwiYXBwIiwiaWwiLCJ2YSIsImlsaSIsIiBvcmdhbml6YXRpb24iLCIgb25i' +
	'b2FyZCIsIiB0cmFpbiIsIiBQcm9ncmFtbSIsIiBxdWVzdGlvbiIsIiBkZXRhaWwiLCJsbG93IiwiIHByaXZhdGUiLCIgZnVuY3Rp' +
	'b24iLCJzc2VtYmx5IiwiIGVmZmVjdGl2ZSIsIm5ndWxhciIsInR3IiwiIGV4cGVydCIsIiBjb21wIiwiaWNhdGlvbiIsImNlc3Np' +
	'IiwiZWFkZXJzaGlwIiwiIG1ldGhvZG9sb2ciLCJlcXUiLCJpbGl0eSIsIiBjb25maWd1ciIsIiBpbmRlcGVuZGVudCIsImJlciIs' +
	'IiBDb2xsYWJvcmF0IiwiIEpOREkiLCIgYWN0aXZpdGllcyIsIiBjb25zdWx0aW5nIiwiIGRldm9wcyIsIiBleGVjdXQiLCIgaWRl' +
	'bnRpZnkiLCIgaW5kaXNwZW5zYWJsZSIsIiBtb3RpdmF0IiwiIG9wdGltaXplIiwiIHByb2NlZHVyZXMiLCIgcHJvdG9jb2xzIiwi' +
	'IHN0YWtlaG9sZGVycyIsIiBzdW1tYXJ5IiwiIFBsYW5uIiwiIGZpeCIsImlwIiwiIEtub3ciLCIgSlRBIiwiIGdhaW4iLCIgcHJv' +
	'cGVybHkiLCIgY29udHJvbCIsInBvcnRpbmciLCIgQ29tcCIsIiBleGNoYW5nIiwiIGFkb3B0IiwiIGRlc2NyaXB0aW9uIiwicHJp' +
	'bmciLCJmZXJlbiIsImluaXRpIiwiYmplY3QiLCIgUmVsYXQiLCJ2IiwiSSIsIkQiLCJKIiwiWiIsIlgiLCJGIiwiVSIsInoiLCJL' +
	'IiwicSIsIlIiLCJHIiwiUSIsIkgiLCJXIiwiQiIsIk8iLCJrIiwiYiIsInciLCJwIl0='));
BPE_VOCAB_MAP = new Map(BPE_VOCAB_LIST.map((tokenstring, tokenindex) => [tokenstring, tokenindex]));

AGENT_BPE_VOCAB_LIST = JSON.parse(atob(
'WyI8dW5rPiIsICI8cz4iLCAiPC9zPiIsICI8YWdlbnRxPiIsICI8L2FnZW50cT4iLCAiPGFnZW50dz4iLCAiPC9hZ2VudHc+Iiwg'+
'IjxhZ2VudGE+IiwgIjwvYWdlbnRhPiIsICI8YXJjaHE+IiwgIjwvYXJjaHE+IiwgIjxhcmNodD4iLCAiPC9hcmNodD4iLCAiPGFy'+
'Y2hhPiIsICI8L2FyY2hhPiIsICI8YTFhbm4+IiwgIjxhMWFwcD4iLCAiPGEybWxwPiIsICI8YTJjbm4+IiwgIjxhMnJubj4iLCAi'+
'PGEydGZyPiIsICI8YTJudGllcj4iLCAiPGEyY2xvdWQ+IiwgIjxhMm1jbG91ZD4iLCAiPGEyb25wcmVtd2ViPiIsICI8bTF3MT4i'+
'LCAiPG0xdzI+IiwgIjxtMXczPiIsICI8bTF3ND4iLCAiPG0xdzU+IiwgIjxtMXc2PiIsICI8bTJocj4iLCAiPG0yd3I+IiwgIjxt'+
'MmZ3PiIsICI8bTJmbz4iLCAiPG0yZmw+IiwgIjxtMnRsPiIsICI8bTJ0dz4iLCAiPG0ydG8+IiwgIjxtMnZhbm4+IiwgIjxtMnZh'+
'cHA+IiwgIiAiLCAiZSIsICIgYSIsICJzIiwgIiByIiwgImgiLCAiYWwiLCAiLSIsICJwIiwgIm0iLCAiIG4iLCAiIGkiLCAidXIi'+
'LCAiYW5kIiwgIm93IiwgIiBuZXR3b3JrIiwgIm9tIiwgInRoIiwgImluIiwgIiBhbiIsICIgcSIsICIgZiIsICIgeCIsICIgeSIs'+
'ICIgaiIsICIgYiIsICIgdCIsICIgayIsICIgZyIsICJ1IiwgIiBjIiwgIiB3IiwgIiBuZSIsICJpcyIsICIgbyIsICJ2IiwgIiBs'+
'IiwgInoiLCAiaSIsICIgZCIsICIgdiIsICIgeiIsICJuZSIsICIgdSIsICIgbSIsICIgcCIsICJkIiwgImdlIiwgIiBzIiwgImNs'+
'b3VkIiwgIiBoIiwgIiBtb2RlbCIsICJ0ZSIsICJyYSIsICJsaXN0IiwgInJlIiwgImFwcCIsICIgdGVybWluYWwiLCAiIGZpbGVz'+
'IiwgIiB3ZWIiLCAibGF5IiwgImVyIiwgIiBvbiIsICIgbXVsdGkiLCAidGkiLCAiIGRpYWdyYW0iLCAiIGJyb3dzZXIiLCAiYSIs'+
'ICJhZ2UiLCAiIGUiLCAiciIsICJuIiwgInQiLCAibCIsICJkaSIsICJvIiwgImMiLCAidyIsICJmIiwgImciLCAiYiIsICJ5Iiwg'+
'ImsiLCAiaiIsICJsaSIsICJ4IiwgInEiLCAibWEiLCAiYW4iLCAiY29udm9sdXRpb25hbCIsICJ0cmFuc2Zvcm1lciIsICJyZWN1'+
'cnJlbnQiLCAiY25uIiwgInJubiIsICJpdGUiLCAicmMiLCAibmV0d29yayIsICIgYXBwbGljYXRpb24iLCAidGVybWluYWwiLCAi'+
'dXJlIiwgImJyb3dzZXIiLCAiZmlsZXMiLCAiZ2NwIiwgIm9uIiwgInZlIiwgInBsIiwgImVuIiwgIiBhenVyZSIsICIgYXdzIiwg'+
'Im1vZGVsIiwgIndlYiIsICJzaW5nIiwgImRpYWdyYW0iLCAiIGZpbGUiLCAibXVsdGkiLCAibmQiLCAiYXkiLCAiaWwiLCAiLCJd'));
AGENT_BPE_VOCAB_MAP = new Map(AGENT_BPE_VOCAB_LIST.map((tokenstring, tokenindex) => [tokenstring, tokenindex]));


APP_WINDOW_ACTIONS = JSON.parse(atob(
'eyI8bTF3MT4iOiAib3BlbkFib3V0IiwgIjxtMXcyPiI6ICJvcGVuVGVybWluYWwiLCAiPG0xdzM+IjogIm9wZW5XZWJCcm93c2Vy'+
'IiwgIjxtMXc0PiI6ICJvcGVuRmlsZUJyb3dzZXIiLCAiPG0xdzU+IjogIm9wZW5DaGF0IiwgIjxtMXc2PiI6ICJvcGVuQXJjaGl0'+
'ZWN0dXJlRGVzaWduZXIifQ=='));
APP_WINDOWS_ACTION_LABELS = JSON.parse(atob(
'eyI8bTJocj4iOiAiUmVuZGVyIEhUTUwiLCAiPG0yd3I+IjogIlJlbmRlciBIVE1MIiwgIjxtMmZ3PiI6ICJTYXZlIGEgZmlsZSIs'+
'ICI8bTJmbz4iOiAiT3BlbiBhIGZpbGUiLCAiPG0yZmw+IjogIkxpc3QgZmlsZXMiLCAiPG0ydGw+IjogIkxpc3QgZmlsZXMiLCAi'+
'PG0ydHc+IjogIlNhdmUgYSBmaWxlIiwgIjxtMnRvPiI6ICJEaXNwbGF5IGNvbnRlbnRzIG9mIGEgZmlsZSIsICI8bTJ2YW5uPiI6'+
'ICJEaXNwbGF5IGEgbmV1cmFsIG5ldHdvcmsiLCAiPG0ydmFwcD4iOiAiRGlzcGxheSBhbiBhcHBsaWNhdGlvbiBhcmNoaXRlY3R1'+
'cmUifQ=='));

function approxBPE(inputText,bpeVocabMap) {
	const tokens = [];
	let remainingText = " " + inputText.trim();
	let attempts = 0;
	while (remainingText.length > 0) {
		for (let i = remainingText.length; i > 0; i--) {
			let token = bpeVocabMap.get(remainingText.substring(0, i));
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



function startProfileChat(elm) {
	let inputContent = elm.textContent;
	document.getElementById("chatHistory").innerHTML = "";
	document.getElementById("chatInput").value = inputContent;
	webGpuTokens();
}

function startAgentChat(elm) {
	let inputContent = elm.textContent;
	document.getElementById("MathAssistantOutput").innerHTML = "";
	document.getElementById("calcInput").value = inputContent;
	mathWebGpuTokens();
}

function startArchChat(elm) {
	let inputContent = elm.textContent;
	document.getElementById("arch_diagram_Output").innerHTML = "";
	document.getElementById("archPromptInput").value = inputContent;
	archWebGpuTokens();
}


function sampleOutputToken(results, previousTokens) {
	//{logits: Je, argmax_token: Je, temp_argmax_token: Je}
	let argmax_token = results['argmax_token'].data;
	let topk_indices = results['topk_indices'].data;
	let topkSetting = parseInt(document.getElementById('llmtempsetting').value);
	let repPenalty = parseInt(document.getElementById('llmreppensetting').value);
	if (topkSetting > 1) {
		argmax_token = topk_indices[Math.floor(Math.random() * topk_indices.length)];
	} 
	if(repPenalty>1 && previousTokens.length>0 && previousTokens[previousTokens.length-1]==argmax_token){
		for(let i=0;i<topk_indices.length;i++){
			if(topk_indices[i]!=argmax_token){
				argmax_token = topk_indices[i];
				break;
			}
		}
	}
	return argmax_token;
}

async function webGpuTokens() {
	let inputContent = document.getElementById("chatInput").value;
	document.getElementById("chatInput").value = "";
	document.getElementById("chat_content_progress_bar").style.width = '0%';
	var chatHistoryElement = document.getElementById("chatHistory");
	chatHistoryElement.innerHTML = chatHistoryElement.innerHTML + "<div><i class='bi bi-file-person'></i> " + inputContent + "</div><div><i class='bi bi-cpu'></i><span></span></div> ";
	chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
	try {
		var chatResponseElement = chatHistoryElement.querySelectorAll('.bi-cpu + span')[chatHistoryElement.querySelectorAll('.bi-cpu + span').length - 1];
		inputContent = inputContent.toLowerCase().replace(/[^a-z,.]+/gi, ' ').replace(/\s+/g, ' ');
	    let input_ids = approxBPE(inputContent,BPE_VOCAB_MAP);
		generated_tokens = []
		let maxAvailableTokens = 256 /*max sequence length of trained model*/ - input_ids.length;
		const tickToken = () => new Promise(res => setTimeout(res, 0));
		if (input_ids.length > 0 && maxAvailableTokens > 0) {
			for (let count = 0; count < maxAvailableTokens; count++) {
				let percent = (count / maxAvailableTokens) * 100;
				document.getElementById('chat_content_progress_bar').style.width = percent + '%';
				await tickToken();
				let bigIntArray = input_ids.map(input_id => BigInt(input_id));
				let topkValue = parseInt(document.getElementById('llmtempsetting').value);
				let repPenalty = parseInt(document.getElementById('llmreppensetting').value);
				if(topkValue<repPenalty){
					topkValue = repPenalty; //this is not real repetition penalty
				}
				const tensortopk = new ort.Tensor(new BigInt64Array(1), []);
				tensortopk.data[0] = BigInt(topkValue);
				const feeds = {
					'topk': tensortopk,
					'tokens': new ort.Tensor('int64', BigInt64Array.from(bigIntArray), [1, bigIntArray.length])
				};
				const results = await ort_inference_session.run(feeds);
				let output_token_id = sampleOutputToken(results, input_ids);
				input_ids.push(output_token_id);
				if (count > 0) {
					if (output_token_id == 1 /* bos token id*/ || output_token_id == 2 /* eos token id*/) {
						break;
					}
				}
				let decodedText = "";
				if (output_token_id > 2 && output_token_id < BPE_VOCAB_LIST.length) {
					decodedText = BPE_VOCAB_LIST[output_token_id];
				}
				chatResponseElement.textContent = chatResponseElement.textContent + decodedText;
				chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
			}
		} else {
			document.getElementById("chatHistory").textContent = 'invalid prompt. please enter a shorter prompt.';
		}
	} catch (e) {
		console.log(e);
		document.getElementById("chatHistory").textContent = 'sorry, chat is not available';
	}
	document.getElementById("chat_content_progress_bar").style.width = '0%';
	chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

async function evaluateAgentModel(input_text,perfix_tag,suffix_tag){
	input_text = perfix_tag+input_text.toLowerCase().replace(/[^a-z]+/gi, ' ').replace(/\s+/g, ' ')+suffix_tag;
	let input_ids = approxBPE(input_text,AGENT_BPE_VOCAB_MAP);	
	generated_tokens = []
	let maxAvailableTokens = 64 /*max sequence length of trained model*/ - input_ids.length;
	const tickToken = () => new Promise(res => setTimeout(res, 0));
	let decodedText = "";
	if (input_ids.length > 0 && maxAvailableTokens > 0) {
		let lastActionToken = AGENT_BPE_VOCAB_MAP.get('<m2vapp>');
		for (let count = 0; count < maxAvailableTokens; count++) {
			let bigIntArray = input_ids.map(input_id => BigInt(input_id));
			const feeds = {
				'tokens': new ort.Tensor('int64', BigInt64Array.from(bigIntArray), [1, bigIntArray.length])
			};
			const results = await ort_agent_inference_session.run(feeds);
			let output_token_id = results['argmax_token'].data;
			if(output_token_id>lastActionToken){
				let logits = results['logits'].data;
				//TODO pick a valid action tag	
			} else {
				input_ids.push(output_token_id);
			}							
			if (count > 0) {
				if (output_token_id == 1 /* bos token id*/ || output_token_id == 2 /* eos token id*/) {
					break;
				}
			}			
			if (output_token_id > 2 && output_token_id <= lastActionToken /* use only valid tags*/) {
				decodedText = decodedText + AGENT_BPE_VOCAB_LIST[output_token_id];
			}			
		}
	}
	return decodedText;
}

function clearChat() {
	document.getElementById("chatInput").value = "";
	document.getElementById("chatHistory").innerHTML = document.getElementById("pchatonnxsamplecard").innerHTML;
}

function generateImageUsingDiffusionModel() {
	const canvas = document.getElementById('workspaceCanvas');
	const ctx = canvas.getContext('2d');
	for (let i = 0; i < 10; i++) {
	  ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
	  ctx.beginPath();
	  const shapeType = Math.random();
	  if (shapeType < 0.33) {
		ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20, 0, 2 * Math.PI);
	  } else if (shapeType < 0.66) {
		ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 50, Math.random() * 50);
	  } else {
		ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
		ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
		ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
		ctx.closePath();
	  }
	  ctx.fill();
	}  
	const dataURL = canvas.toDataURL('image/png');
	return dataURL;
}

async function mathWebGpuTokens() {
	let inputContent = document.getElementById("calcInput").value;
	document.getElementById("calcInput").value ='';
	var chatResponse = '<div class="spinner-border spinner-border-sm" role="status"></div>';
	document.getElementById("calcInput").value = "";
	let personQuestionMessage =  "<div><i class='bi bi-file-person'></i> " + inputContent + "</div>";
	document.getElementById("MathAssistantOutput").innerHTML = personQuestionMessage + "<div><i class='bi bi-robot'></i> " + chatResponse + "</div>";
	try{		
		let agentResponse = await evaluateAgentModel(inputContent,'<agentq>','</agentq>');
		const agentActions = [];
		const regex = /<agentw>(.*?)<\/agentw><agenta>(.*?)<\/agenta>/g;
		let actionMatches;
		while((actionMatches=regex.exec(agentResponse))){
			if (APP_WINDOW_ACTIONS[actionMatches[1]] in window) {
				agentActions.push([actionMatches[1],actionMatches[2]]);
			}
		}
		if(agentActions.length>0){
			let agentActionHtml = '<span>Agent Steps</span><ol class="list-group list-group-flush list-group-numbered">';
			for(let i=0;i<agentActions.length;i++){			
				let winowIdKey = APP_WINDOW_ACTIONS[agentActions[i][0]];
				if(winowIdKey){
					let winboxIdText = winowIdKey.replace('open','Open ');
					let agentActionText = APP_WINDOWS_ACTION_LABELS[agentActions[i][1]];
					agentActionHtml += '<li class="list-group-item" id=agentStepnWindow'+i+'>'+winboxIdText+'</li>';
					if(agentActionText){
						agentActionHtml += '<li class="list-group-item" id=agentActionWindow'+i+'>'+agentActionText+'</li>';
					}
				}	
			}
			agentActionHtml += '</ol><button id="agentActionExecuteAll" type="button" class="btn btn-sm btn-outline-secondary"><i class="bi bi-filetype-exe"></i> Click here to execute all the steps</button>';
			document.getElementById("MathAssistantOutput").innerHTML = personQuestionMessage + "<div><i class='bi bi-robot'></i> " + agentActionHtml + "</div>";
			document.getElementById("agentActionExecuteAll").onclick = function() {
				let agentChatWindow = 	window['rmx_MathAssistant_obj'].winbox_win_obj;
				let x_translate = agentChatWindow.x;
				let y_translate = agentChatWindow.y;
				for(let i=0;i<agentActions.length;i++){	
					const winboxOpenFn = APP_WINDOW_ACTIONS[agentActions[i][0]];
					if (winboxOpenFn in window) {
						const winboxWindowId = window[winboxOpenFn]();							
						x_translate+=100;
						y_translate+=100;
						const targetNewlyOpenedWindow = window[winboxWindowId].winbox_win_obj;
						targetNewlyOpenedWindow.x = x_translate;
						targetNewlyOpenedWindow.y = y_translate;
						targetNewlyOpenedWindow.move();
						const agentExecAction = agentActions[i][1];
						if(agentExecAction === '<m2hr>'||agentExecAction === '<m2wr>'){
							document.getElementById('urlInput').value = 'data:text/plain;charset=us-ascii,agent';
							document.getElementById('web_browser_content_iframe').src=generateImageUsingDiffusionModel();
						} else if(agentExecAction === '<m2fw>'){
							//TODO
						} else if(agentExecAction === '<m2fo>'){
							//TODO
						} else if(agentExecAction === '<m2fl>'){
							//no action required
						} else if(agentExecAction === '<m2tl>'){
							rmx_terminal_obj.write('ls');
							rmx_terminal_obj.command = "ls";
							executeTerminalCommand();
						} else if(agentExecAction === '<m2tw>'){
							rmx_terminal_obj.write('touch test.txt');
							rmx_terminal_obj.command = "touch test.txt";
							executeTerminalCommand();
						} else if(agentExecAction === '<m2to>'){
							rmx_terminal_obj.write('cat test.txt');
							rmx_terminal_obj.command = "cat test.txt";
							executeTerminalCommand();
						} else if(agentExecAction === '<m2vann>'||agentExecAction === '<m2vapp>'){
							document.getElementById("arch_diagram_Output").innerHTML = "";
							document.getElementById("archPromptInput").value = 
								agentExecAction === '<m2vapp>'?"Show an n-tier on-prem webapp":"Visualize a random neural network";
							archWebGpuTokens();
						}
					}
				}
				document.getElementById("agentActionExecuteAll").remove();
				document.getElementById("MathAssistantOutput").innerHTML = document.getElementById("MathAssistantOutput").innerHTML + "<div><i class='bi bi-robot'></i> Executed all the steps</div>";
			};
		} else {
			document.getElementById("MathAssistantOutput").innerHTML = "Unable to determine the agent steps. Please try a different prompt.";
		}		
	} catch (e) { console.log(e); document.getElementById("arch_diagram_Output").textContent = 'error in agent task'; }
	document.getElementById("MathAssistantOutput").scrollTop = document.getElementById("MathAssistantOutput").scrollHeight;
}

function clearMathChat() {
	document.getElementById("calcInput").value = "";
	document.getElementById("MathAssistantOutput").innerHTML = document.getElementById("mchatonnxsamplecard").innerHTML;
}


async function archWebGpuTokens() {
	let inputContent = document.getElementById("archPromptInput").value;
	document.getElementById("arch_diagram_Output").innerHTML = '<div class="spinner-border" role="status"></div>';
	document.getElementById("arch_diagram_Output").scrollTop = document.getElementById("arch_diagram_Output").scrollHeight;
	try{
		let graphResponse = "digraph { prompt -> error }";
		let agentResponse = await evaluateAgentModel(inputContent,'<archq>','</archq>');
		//TODO model will eventually be trained to produce the graph directly
		let annArch = '<archt><a1ann></archt>';
		let appArch = '<archt><a1app></archt>';
		if(agentResponse===annArch+'<archa><a2mlp></archa>'){
			graphResponse = randNNGraph('mlp');
		} else if(agentResponse===annArch+'<archa><a2cnn></archa>'){
			graphResponse = randNNGraph('cnn');
		} else if(agentResponse===annArch+'<archa><a2rnn></archa>'){
			graphResponse = randNNGraph('rnn');
		} else if(agentResponse===annArch+'<archa><a2tfr></archa>'){
			graphResponse = randNNGraph('tfr');
		} else if(agentResponse===appArch+'<archa><a2ntier></archa>'){
			graphResponse = randAppGraph('ntier');
		} else if(agentResponse===appArch+'<archa><a2cloud></archa>'){
			graphResponse = randAppGraph('cloud');
		} else if(agentResponse===appArch+'<archa><a2mcloud></archa>'){
			graphResponse = randAppGraph('mcloud');
		} else if(agentResponse===appArch+'<archa><a2onpremweb></archa>'){
			graphResponse = randAppGraph('webapp');
		} else {
			graphResponse = randNNGraph('mlp');
		}
		document.getElementById("arch_diagram_Output").innerHTML = '';
		document.getElementById("arch_diagram_Output").appendChild(viz_instance.renderSVGElement(graphResponse));
		document.getElementById("archPromptInput").value = '';
	} catch (e) { console.log(e); document.getElementById("arch_diagram_Output").textContent = 'error generating the diagram'; }
}

function clearArchChat() {
	document.getElementById("archPromptInput").value = "";
	document.getElementById("arch_diagram_Output").innerHTML = document.getElementById("archchatonnxsamplecard").innerHTML;
}

function getRandomHexColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

function genMLP(){
	const minValue = 1;
	const maxValue = 2;
	const numOutputs = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
	const numInputs = numOutputs + 1;
	const numHidden = numInputs + 1;
	let inputNodes = [];
	for(let i=0;i<numInputs;i++){
		inputNodes.push('input'+i);
	}
	let hiddenNodes = [];
	for(let i=0;i<numHidden;i++){
		hiddenNodes.push('hidden'+i);
	}
	let outputNodes = [];
	for(let i=0;i<numOutputs;i++){
		outputNodes.push('output'+i);
	}
	let input_to_hidden_edges = '';
	for(let i=0;i<numInputs;i++){
		for(let j=0;j<numHidden;j++){
			input_to_hidden_edges+=(inputNodes[i]+' -> '+hiddenNodes[j]+'\n');
		}
	}
	let hidden_to_output_edges = '';
	for(let i=0;i<numHidden;i++){
		for(let j=0;j<numOutputs;j++){
			hidden_to_output_edges+=(hiddenNodes[i]+' -> '+outputNodes[j]+'\n');
		}
	}
	return `digraph G {
			rankdir=LR
			splines=line
			node [fixedsize=true, label=""];

			subgraph cluster_0 {
				color=white;
				node [style=solid,color="${getRandomHexColor()}", shape=circle];
				${inputNodes.join(' ')};
				label = "Input layer";
			}

			subgraph cluster_1 {
				color=white;
				node [style=solid,color="${getRandomHexColor()}", shape=circle];
				${hiddenNodes.join(' ')};
				label = "Hidden layer";
			}

			subgraph cluster_2 {
				color=white;
				node [style=solid,color="${getRandomHexColor()}", shape=circle];
				${outputNodes.join(' ')};
				label="Output layer";
			}

			${input_to_hidden_edges}
			${hidden_to_output_edges}

	}`;
}

function randNNGraph(nnType){
	let nnGraph = 'digraph { input -> output }';
	if(nnType==='mlp'){
		nnGraph = genMLP();
	} else if(nnType==='cnn'){
		nnGraph = genMLP();
	} else if(nnType==='rnn'){
		nnGraph = genMLP();
	} else if(nnType==='tfr'){
		nnGraph = genMLP();
	}
	return nnGraph;
}

function randAppGraph(archType){
	let resolution = parseInt(document.getElementById('gvizresolsetting').value);
	let appGraph = 'digraph { client -> server \n server -> client }';
	if(archType==='mcloud'){
		appGraph = `digraph multi_cloud {
					graph [rankdir="LR" resolution=${resolution}];

					# Load Balancer
					load_balancer [label="Load Balancer" style=filled color="${getRandomHexColor()}"];

					# AWS resources
					subgraph cluster_aws {
						label="AWS";style=filled;color="#ff9900";
						compute_aws [label="EC2 Instance"];
						storage_aws [label="S3 Bucket"];
					}

					# GCP resources
					subgraph cluster_gcp {
						label="GCP";style=filled;color="#c5e6ce";
						compute_gcp [label="Compute Engine"];
						storage_gcp [label="Cloud Storage"];
					}

					# Azure resources
					subgraph cluster_azure {
						label="Azure";style=filled;color="#0078d4";
						compute_azure [label="VM Instance"];
						storage_azure [label="Blob Storage"];
					}

					load_balancer -> compute_aws;
					load_balancer -> compute_gcp;
					load_balancer -> compute_azure;

					compute_aws -> storage_aws;
					compute_gcp -> storage_gcp;
					compute_azure -> storage_azure;

					}`;
	} else if(archType==='cloud' || archType==='webapp'||archType==='ntier'){
		appGraph = `digraph multi_tier_web_app {
						graph [rankdir="LR" compound=true resolution=${resolution}];
						browser [label="Client" style=filled color="${getRandomHexColor()}"];

						# CDN
						cdn [label="CDN" style=filled color="${getRandomHexColor()}"];

						# Load Balancer
						load_balancer [label="Load Balancer" style=filled color="${getRandomHexColor()}"];

						# Web Server Cluster
						subgraph cluster_web_server {
							label="Web Server Cluster";style=filled;color="${getRandomHexColor()}";
							web_server1 [label="WebServer1"];
							web_server2 [label="WebServer2"];
						}

						# App Server Cluster
						subgraph cluster_app_server {
							label="App Server Cluster";style=filled;color="${getRandomHexColor()}";
							app_server1 [label="AppServer1"];
							app_server2 [label="AppServer2"];
							app_server3 [label="AppServer3"];
						}

						# Messaging Cluster
						subgraph cluster_messaging {
							label="Messaging Cluster";style=filled;color="${getRandomHexColor()}";
							message_broker1 [label="Broker1"];
							message_broker2 [label="Broker2"];
						}

						# Database Cluster
						subgraph cluster_database {
							label="Database Cluster";style=filled;color="${getRandomHexColor()}";
							database1 [label="Node1"];
							database2 [label="Node2"];
						}

						# Connections
						browser -> cdn;
						browser -> load_balancer;
						load_balancer -> web_server1 [lhead=cluster_web_server];
						web_server1 -> app_server1 [ltail=cluster_web_server lhead=cluster_app_server];
						app_server1 -> database1 [ltail=cluster_app_server lhead=cluster_database];
						app_server1 -> message_broker1 [ltail=cluster_app_server lhead=cluster_messaging];
						}
						`;
	}
	return appGraph;
}