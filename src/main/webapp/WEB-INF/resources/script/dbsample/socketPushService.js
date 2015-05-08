'use strict';
function SocketPushService() {
	var service = {};
	//callback�p
	var pendingCallbacks = [];
	var ws = new WebSocket("ws://172.31.122.33:8080/sample/websocket/createTable");
	var preConnectionRequests = [];
	var connected = false;

	//�R�l�N�V�����I�[�v��
	ws.onopen = function () {
		connected = true;
		if (preConnectionRequests.length === 0) return;

		console.log('Sending (%d) requests', preConnectionRequests.length);
		for (var i = 0, c = preConnectionRequests.length; i < c; i++) {
			ws.send(JSON.stringify(preConnectionRequests[i]));
		}
		preConnectionRequests = [];
	};

	//��M
	ws.onmessage = function (message) {
		console.log("########### ws.onmessage ##########", message);
		listener(JSON.parse(message.data));
	};

	//Callback�̓o�^
	function bindReceiveListener(cb) {
		//pendingCallbacks[generateMessageId()] = cb;
		pendingCallbacks.push(cb);
	}

	//���N�G�X�g���M
	function sendRequest(request) {
		if (!connected) {
			console.log('Not connected yet, saving request', request);
			preConnectionRequests.push(request);
			return;
		}
		console.log('Sending request', request);
		ws.send(JSON.stringify(request));
	}

	//��M���̃��X�i�[
	function listener(message) {
		//pendingCallbacks[generateMessageId()](message);
		pendingCallbacks.forEach(function(value) {
			value(message);
		});
	}

	service.sendRequest = sendRequest;
	service.bindReceiveListener = bindReceiveListener;
	return service;
}