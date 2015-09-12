"use strict";
var app = require("app");
var BrowserWindow = require("browser-window");
var path = require("path");

var mainWindow = null;

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("ready", function () {
	mainWindow = new BrowserWindow({ width : 960, height: 640, frame : false });
	mainWindow.loadUrl("file://" + path.join(__dirname, "..", "index.html"));

	if (process.env.DEBUG === "true") {
		mainWindow.openDevTools();
	}

	mainWindow.on("closed", function () {
		mainWindow = null;
	});
});