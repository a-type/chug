/* global: BWClient */
"use strict";
var EventEmitter = require("events").EventEmitter;
var util = require("util");

var phone;

function Client (remoteAudioElement) {
	EventEmitter.call(this);
	this.currentCall = null;

	this.remoteAudioElement = remoteAudioElement;
}
util.inherits(Client, EventEmitter);

Client.prototype.login = function (username, password, domain) {
	phone = BWClient.createPhone({
		username : username,
		password : password,
		domain   : domain,
		logLevel : "debug"
	});
	phone.register();

	phone.on("incomingCall", this.handleIncomingCall.bind(this));

	return false;
};

Client.prototype.handleIncomingCall = function (incomingCall) {
	if (this.currentCall) {
		this.currentCall.hangup();
		this.currentCall = null;
	}

	this.currentCall = incomingCall;
	this.currentCall.on("ended", this.handleCallEnded.bind(this));
	this.currentCall.on("connected", this.emit.bind(this, "stateChanged"));

	this.emit("stateChanged");
};

Client.prototype.connectCall = function (to, options) {
	this.currentCall = phone.call(to, options);
	this.currentCall.setRemoteAudioElement(this.remoteAudioElement);
	this.currentCall.on("connected", this.emit.bind(this, "stateChanged"));
	this.currentCall.on("ended", this.handleCallEnded.bind(this));

	this.emit("stateChanged");
};

Client.prototype.answerCall = function () {
	this.currentCall.setRemoteAudioElement(this.remoteAudioElement);
	this.currentCall.accept();
};

Client.prototype.rejectCall = function () {
	this.currentCall.reject();
};

Client.prototype.hangup = function () {
	this.currentCall.hangup();
	this.currentCall = null;

	this.emit("stateChanged");
};

Client.prototype.mute = function () {
	if (this.currentCall.getInfo().microphoneMuted) {
		this.currentCall.unmute();
	}
	else {
		this.currentCall.mute();
	}

	this.emit("stateChanged");
};

Client.prototype.sendDTMF = function (value) {
	this.currentCall.sendDtmf(value.toString());
};

Client.prototype.handleCallEnded = function () {
	this.currentCall = null;
	this.emit("stateChanged");
};

module.exports = Client;