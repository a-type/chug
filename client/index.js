/* global: BWClient */
"use strict";

var $ = require("jquery");

document.addEventListener("DOMContentLoaded", function () {
	$("#loginForm").submit(login);
	$("#connectCall").click(connectCall);
	$(".answer").click(answerCall);
	$(".reject").click(rejectCall);
	$("#hangup").click(hangup);
	$("#mute").click(mute);
	$("#toField").keypress(function (event) {
		if (e.which === 13) {
			connectCall();
		}
	});
	$(".dialpad-button").click(sendDTMF);

	console.on("log", addLog);
	console.on("warn", addLog);
	console.on("error", addLog);
	console.on("info", addLog);
});

var phone;
var currentCall;

function login (event) {
	event.preventDefault();

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

	var login = $(".login");
	login.addClass("closing");
	setTimeout(function () { login.hide(500); }, 1000);

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

function addLog (log) {
	$(".logs").prepend($("<div class='logitem'>" + log + "</div>"));
}

function refreshUI () {
	if (currentCall) {
		var info = currentCall.getInfo();

		if (info.status === "connecting") {
			$(".call").addClass("connecting").removeClass("in-call");

			if (info.direction === "in") {
				$(".call").addClass("incoming");
				$(".incoming-call-info-number").html(info.remoteId);
			}
			else {
				$(".call").removeClass("incoming");
			}
		}
		else if (info.status === "connected") {
			$(".call").addClass("in-call").removeClass("connecting");
		}

		if (info.microphoneMuted) {
			$(".muteIcon").addClass("fa-microphone-slash").removeClass("fa-microphone");
		}
		else {
			$(".muteIcon").addClass("fa-microphone").removeClass("fa-microphone-slash");
		}
	}
}