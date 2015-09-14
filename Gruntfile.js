"use strict";
var buildFolder = "chug-dist"
var ignoreBuild = buildFolder + "|less|README.md|LICENSE.md|img|node_modules/(grunt|grunt-cli|grunt-contrib-less|grunt-contrib-watch|grunt-electron|.bin)";

module.exports = function (grunt) {
	grunt.initConfig({
		watch : {
			less : {
				files : [ "./less/**/*.less" ],
				tasks : [ "less:default" ]
			}
		},

		less : {
			default : {
				files : {
					"./css/style.css" : "./less/index.less"
				}
			}
		},

		electron : {
			win32 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "win32",
					arch     : "ia32",
					icon     : "img/icon.ico",
					ignore   : ignoreBuild
				}
			},

			win64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "win32",
					arch     : "x64",
					icon     : "img/icon.ico",
					ignore   : ignoreBuild
				}
			},

			linux32 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "linux",
					arch     : "ia32",
					ignore   : ignoreBuild
				}
			},

			linux64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "linux",
					arch     : "x64",
					ignore   : ignoreBuild
				}
			},

			osx32 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "darwin",
					arch     : "ia32",
					ignore   : ignoreBuild
				}
			},

			osx64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : buildFolder,
					version  : "0.32.2",
					platform : "darwin",
					arch     : "x64",
					ignore   : ignoreBuild
				}
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-electron");

	grunt.registerTask("default", [ "less", "watch" ]);
	grunt.registerTask("build-all", [ "less", "build-win", "build-osx", "build-linux" ]);
	grunt.registerTask("build-win", [ "less", "build-win32", "build-win64" ]);
	grunt.registerTask("build-osx", [ "less", "build-osx32", "build-osx64" ]);
	grunt.registerTask("build-linux", [ "less", "build-linux32", "build-linux64" ]);
	grunt.registerTask("build-win32", [ "less", "electron:win32" ]);
	grunt.registerTask("build-win64", [ "less", "electron:win64" ]);
	grunt.registerTask("build-osx32", [ "less", "electron:osx32" ]);
	grunt.registerTask("build-osx64", [ "less", "electron:osx64" ]);
	grunt.registerTask("build-linux32", [ "less", "electron:linux32" ]);
	grunt.registerTask("build-linux64", [ "less", "electron:linux64" ]);
};
