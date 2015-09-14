"use strict";
var Bluebird = require("bluebird");
var Client = require("./client");
var fs = require("fs");
var path = require("path");
var remote = require("remote");
var $ = require("jquery");
var _ = require("lodash");

Bluebird.promisifyAll(fs);

var client;
var config = {};

// on document load, wire up controls
document.addEventListener("DOMContentLoaded", function () {
	loadUserData();

	client = new Client(document.getElementById("remoteAudio"));
	client.on("stateChanged", refreshUI);

	$("#loginForm").submit(login);
	$("#connect").click(connectCall);
	$(".answer").click(client.answerCall.bind(client));
	$(".reject").click(client.rejectCall.bind(client));
	$("#hangup").click(client.hangup.bind(client));
	$("#mute").click(client.mute.bind(client));
	$("#toField").keypress(function (event) {
		if (e.which === 13) {
			connectCall();
		}
	});
	$(".dialpad-button").click(dtmfPressed);

	console.on("log", addLog);
	console.on("warn", addLog);
	console.on("error", addLog);
	console.on("info", addLog);

	$(".controls-expander").click(toggleControlsExpanded);

	$(".expander").click(togglePanelExpanded);

	$("#identity").keyup(updateInfo);
});

function saveUserData () {
	var appDataPath = remote.require("app").getPath("appData");


	fs.statAsync(path.join(appDataPath, "Chug"))
	.catch(function (err) {
		if (err.code === "ENOENT") {
			return fs.mkdirAsync(path.join(appDataPath, "Chug"));
		}
		else {
			throw err;
		}
	})
	.then(function () {
		fs.writeFileAsync(path.join(appDataPath, "Chug", "config.json"), JSON.stringify(config));
	})
	.then(function () {
		console.log("Config file saved.");
	})
	.catch(function (err) {
		console.error("Config save failed: " + err.message);
	});
}

function loadUserData () {
	var appDataPath = remote.require("app").getPath("appData");
	console.log("AppData: " + appDataPath);

	fs.readFileAsync(path.join(appDataPath, "Chug", "config.json"))
	.then(function (data) {
		config = JSON.parse(data);
		onConfigLoaded();
	})
	.catch(function (err) {
		console.error("Config load failed: " + err.message);
	});
}

function onConfigLoaded () {
	if (config) {
		if (config.credentials) {
			$("#username").val(config.credentials.username);
			$("#password").val(config.credentials.password);
			$("#domain").val(config.credentials.domain);
		}

		if (config.lastCall) {
			$("#toNumber").val(config.lastCall.to);
			$("#identity").val(config.lastCall.options.identity);
		}

		updateInfo();
	}
}

function login (event) {
	event.preventDefault();

	var username = $("#username").val();
	var password = $("#password").val();
	var domain   = $("#domain").val();

	client.login.call(client, username, password, domain);

	config.credentials = config.credentials || {};
	config.credentials.username = username;
	config.credentials.password = password;
	config.credentials.domain = domain;
	saveUserData();

	var login = $(".login");
	login.addClass("closing");
	setTimeout(function () { login.hide(500); }, 1000);
}

function connectCall () {
	var to = $("#toNumber").val();
	var identity = $("#identity").val();

	config.lastCall = {
		to : to,
		options : {
			identity : identity
		}
	};

	saveUserData();

	client.connectCall.call(client, to, { identity : identity });
}

function dtmfPressed (event) {
	var target = $(event.target).closest(".dialpad-button");
	var value = target.data("value");

	client.sendDTMF(value);
}

function toggleControlsExpanded () {
	$(".controls-extra").toggleClass("expanded");
	updateInfo();
}

function togglePanelExpanded (event) {
	var target = $(event.target);
	var closestPanel = target.closest(".panel");
	closestPanel.toggleClass("expanded");
}

function addLog (log) {
	$(".logs").prepend($("<pre class='logitem'>" + _.escape(log) + "</pre>"));
}

function updateInfo () {
	var id = $("#identity").val();

	if (id) {
		$(".controls-info-identity").text("Identity: " + id);
	}
	else {
		$(".controls-info-identity").text("");
	}
}

function refreshUI () {
	var currentCall = client.currentCall;
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
			$("#muteIcon").addClass("fa-microphone-slash").removeClass("fa-microphone");
		}
		else {
			$("#muteIcon").addClass("fa-microphone").removeClass("fa-microphone-slash");
		}
	}
	else {
		$(".call").removeClass("connecting").removeClass("in-call");
	}
}