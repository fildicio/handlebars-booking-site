"use strict";

var getBuildDir = function (grunt) {
  return grunt.option("dir");
};

var getPort = function (grunt) {
  return grunt.option("port");
};

var getEnv = function (grunt) {
  return grunt.option("env");
};

var getSSL = function (grunt) {
  return grunt.option("ssl");
};

module.exports = function (grunt) {
  require("time-grunt")(grunt);
  require("jit-grunt")(grunt, {
    assemble: "grunt-assemble",
    chokidar: "grunt-chokidar",
    browserSync: "grunt-browser-sync",
    asciify: "grunt-asciify",
  });

  var gruntConfig = grunt.file.readJSON("gruntConfig.json");
  var production = getEnv(grunt) === "prod";
  var ssl = getSSL(grunt) ? true : false;
  var buildDir = getBuildDir(grunt) || gruntConfig.BUILD_PUBLIC_DIR || "build";
  var SERVER_PORT = getPort(grunt) || 3000;

  var js = grunt.file.readJSON("static/js.json");

  var yeomanConfig = {
    sitename: gruntConfig.PROJECT_NAME || "prototype",
    local: "target",
    build: buildDir,
  };

  var lessOptions = {
    plugins: [
      require("less-plugin-glob"),
      new (require("less-plugin-autoprefix"))({
        browsers: ["last 2 versions"],
      }),
    ],
  };

  var copyOptions = {
    mtimeUpdate: true,
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    less: {
      local: {
        options: Object.assign(
          {
            sourceMap: true,
            sourceMapFileInline: true,
            sourceMapRootpath: "/",
          },
          lessOptions
        ),
        files: {
          "<%= yeoman.local %>/static/portal.css":
            "static/less/portal/portal.less",
        },
      },
    },

    copy: {
      local: {
        files: [
          {
            expand: true,
            cwd: ".",
            src: [
              "static/{,**/}*.{jpg,png,svg,gif,jpeg,ttf,woff,woff2,eot,js,html,css,pdf,less,json,mp4}",
              "node_modules/jquery/dist/**/*",
              "!ui/**/*",
              "!Gruntfile.js",
            ],
            dest: "<%= yeoman.local %>",
          },
        ],
        options: copyOptions,
      },

      build: {
        files: [
          {
            expand: true,
            cwd: "<%= yeoman.local %>",
            src: ["**/*"],
            dest: "<%= yeoman.build %>",
          },
        ],
        options: copyOptions,
      },
    },

    clean: {
      html: ["<%= yeoman.local %>/*.html"],
      local: ["<%= yeoman.local %>"],
      build: ["<%= yeoman.build %>"],
    },

    uglify: {
      options: {
        mangle: false,
      },
      my_target: {
        files: {
          "<%= yeoman.local %>/static/js/all.js": js,
        },
      },
    },

    cssmin: {
      portal: {
        files: {
          "<%= yeoman.local %>/static/all.css": [
            "<%= yeoman.local %>/static/portal.css",
          ],
        },
      },
    },

    assemble: {
      options: {
        assets: "static",
        images: "static/img/",
        partials: "ui/partials/**/*.hbs",
        layout: "default.hbs",
        layoutdir: "ui/layouts/",
        data: ["static/lang/language.json"],
        flatten: true,
        production: production,
        helpers: ["helpers/**/*.js", "handlebars-helper-repeat"],
      },
      local: {
        files: {
          "<%= yeoman.local %>/": ["ui/pages/**/*.hbs"],
        },
      },
    },

    chokidar: {
      less: {
        files: [
          "static/less/**/*.less",
          "ui/partials/**/*.less",
        ],
        tasks: ["less:local"],
      },
      js: {
        files: ["static/**/*.js"],
        tasks: ["copy:local"],
      },
      img: {
        files: ["static/**/*.{jpg,png,gif,jpeg,svg}"],
        tasks: ["copy:local"],
      },
      assemble: {
        files: ["ui/**/*.hbs", "static/lang/language.json"],
        tasks: ["assemble:local"],
      },
    },

    browserSync: {
      bsFiles: {
        src: [
          "<%= yeoman.local %>/static/*.css",
          "<%= yeoman.local %>/*.html",
          "<%= yeoman.local %>/**/*.js",
        ],
      },
      options: {
        https: ssl,
        watchTask: true,
        server: "./<%= yeoman.local %>",
        port: SERVER_PORT,
        reloadDebounce: 500,
      },
    },

    asciify: {
      banner: {
        text: "<%= yeoman.sitename %>",
        options: {
          font: "big",
          log: true,
        },
      },
    },
  });

  grunt.registerTask("default", function () {
    if (production === true) {
      return grunt.task.run([
        "copy:local",
        "less:local",
        "uglify",
        "cssmin:portal",
        "assemble:local",
      ]);
    }
    return grunt.task.run(["copy:local", "less:local", "assemble:local"]);
  });

  grunt.registerTask("serve", ["default", "browserSync", "asciify", "chokidar"]);
  grunt.registerTask("build", ["default", "copy:build"]);
  grunt.registerTask("cleanlocal", ["clean:local"]);
  grunt.registerTask("cleanbuild", ["clean:build"]);
};
