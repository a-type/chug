/* global: BWClient */
"use strict";

var $ = require("jquery");

document.addEventListener("DOMContentLoaded", function () {
	$("#loginForm").submit(login);
	$("#connectCall").click(connectCall);
	$("#answer").click(answerCall);
	$("#reject").click(rejectCall);
	$("#hangup").click(hangup);
	$("#mute").click(mute);
	$("#toField").keypress(function (event) {
		if (e.which === 13) {
			connectCall();
		}
	});
	$(".dialpad-button").click(sendDTMF);
});

var phone;
var currentCall;

function login () {
	var username = $("#username").val();
	var password = $("#password").val();
	var domain   = $("#domain").val();

	phone = BWClient.createPhone({
		username : username,
		password : password,
		domain   : domain,
		logLevel : "debug"
	});
	phone.register();

	$("#loginForm").hide();

	phone.on("incomingCall", handleIncomingCall);

	return false;
}

function handleIncomingCall (incomingCall) {
	if (currentCall) {
		currentCall.hangup();
		currentCall = null;
	}

	currentCall = incomingCall;
	currentCall.on("ended", handleCallEnded);
	currentCall.on("connected", refreshUI);

	refreshUI();
}

function connectCall () {
	var to = $("#toNumber").val();
	currentCall = phone.call(to);
	currentCall.setRemoteAudioElement(document.getElementById("remote-audio"));
	currentCall.on("connected", refreshUI);
	currentCall.on("ended", handleCallEnded);

	refreshUI();
}

function answerCall () {
	currentCall.setRemoteAudioElement(document.getElementById("remote-audio"));
	currentCall.accept();
}

function rejectCall () {
	currentCall.reject();
}

function hangup () {
	currentCall.hangup();
	currentCall = null;

	refreshUI();
}

function mute () {
	if (currentCall.getInfo().microphoneMuted) {
		call.unmute();
	}
	else {
		call.mute();
	}

	refreshUI();
}

function sendDTMF (event) {
	var target = $(event.target);
	var value = target.data("value");

	currentCall.sendDtmf(value.toString());
}

function handleCallEnded () {
	currentCall = null;
	refreshUI();
}

function refreshUI () {
	if (currentCall) {
		var info = currentCall.getInfo();

		if (info.status === "connected") {
			$(".call").removeClass("connecting").addClass("in-call");

			if (info.direction === "in") {
				$(".call").addClass("incoming");
				$(".incoming-call-info-number").html(info.remoteId);
			}
			else {
				$(".call").removeClass("incoming");
			}
		}
		else if (info.status === "connecting") {
			$(".call").removeClass("in-call").addClass("connecting");
		}

		if (info.microphoneMuted) {
			$(".muteIcon").addClass("fa-microphone-slash").removeClass("fa-microphone");
		}
		else {
			$(".muteIcon").addClass("fa-microphone").removeClass("fa-microphone-slash");
		}
	}
}