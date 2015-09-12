"use strict";
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
					out      : "dist",
					version  : "0.32.2",
					platform : "win32",
					arch     : "ia32",
					icon     : "img/icon.ico",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
				}
			},

			win64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : "dist",
					version  : "0.32.2",
					platform : "win32",
					arch     : "x64",
					icon     : "img/icon.ico",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
				}
			},

			linux32 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : "dist",
					version  : "0.32.2",
					platform : "linux",
					arch     : "ia32",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
				}
			},

			linux64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : "dist",
					version  : "0.32.2",
					platform : "linux",
					arch     : "x64",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
				}
			},

			osx32 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : "dist",
					version  : "0.32.2",
					platform : "darwin",
					arch     : "ia32",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
				}
			},

			osx64 : {
				options : {
					name     : "Chug",
					dir      : ".",
					out      : "dist",
					version  : "0.32.2",
					platform : "darwin",
					arch     : "x64",
					ignore   : "dist|less|README.md|screen1.png|icon.png|logo.png|icon.svg"
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
