const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path=require("path");
const del=require("del");
const fs=require("fs");
const runSequence=require("run-sequence");
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var image64=false;

var DIST = '.tmpbuild';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var styleTask = function(stylesPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return path.join('assets', stylesPath, src);
    }))
    .pipe($.changed(stylesPath, {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe($.cleanCss())
    .pipe(gulp.dest(dist('')))
    .pipe($.size({title: stylesPath}));
};

var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      multipass:true,
    }))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'images'}));
};

gulp.task('images', function() {
  return imageOptimizeTask('app/images/**/*', dist('images'));
});

gulp.task('favicon', function() {
  return imageOptimizeTask('app/favicon.ico', "dist");
});

gulp.task('styles', function() {
  return styleTask('styles', ['**/*.css']);
});

gulp.task('clean', function() {
  return del(['.tmp', dist(),"dist"]);
});

//Minify into index.html
gulp.task('merge', function() {
  const b64i={};
  return gulp.src(dist("index.html"))
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe($.htmlmin({
      collapseWhitespace:true,
      minifyCSS:true,
      minifyJS:true,
      minifyURLs:function(u) {
        //if (u.startsWith("data")) return u;
        if (u=="favicon.ico"&&!ipfs) return "/"+u;
        if (u.startsWith("../font")) {
          if (ipfs) return u.substr(3);
          return u.substr(2);
        }
        if (u.startsWith("images")) {
          if (image64) {
            if (b64i[dist(u)]) return b64i[dist(u)];
            var c=fs.readFileSync(dist(u)).toString("base64");
            b64i[dist(u)]="data:image/"+u.split(".")[1]+";base64,"+c;
            return b64i[dist(u)];
          } else if (!ipfs) {
            return "/"+u;
          }
        }
        if (u.startsWith("/")&&ipfs) return "."+u;//u.substr(1);
        return u;
      },
      removeComments:true
    }))
    .pipe(gulp.dest("dist"))
    .pipe($.size({title: 'merge'}));
});

gulp.task("mergecopy",function() {
  return gulp.src([dist("images/**/*")])
    .pipe(gulp.dest("dist/images"))
    .pipe($.size({title: 'mergecopy'}));
});

gulp.task('build', ['images'], function() {
  return gulp.src(['app/**/*.html'])
    .pipe($.useref())
    .pipe($.if('*.js', $.uglify({
      preserveComments: 'none'
    })))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe($.if('*.html', $.htmlmin({
    })))
    .pipe(gulp.dest(dist()))
});

gulp.task("serve", function() {
  require("./");
  return runSequence(["default"]);
});

gulp.task("copy",function() {
  return gulp.src("app/**/*").pipe(gulp.dest(DIST));
});

gulp.task("default",["clean"], function() {
  if (!global.ipfs) global.ipfs=false;
  return runSequence(["copy","styles"],["build","favicon"],image64?["merge"]:["merge","mergecopy"]);
});

gulp.task("ipfs",["clean"], function() {
  global.ipfs=true; //ipfs build
  image64=true;
  return runSequence(["default"]);
});

gulp.task("publish", function() {
  return gulp.src('dist/**/*')
    .pipe($.ghPages({
      remoteUrl: 'https://$GH_TOKEN@github.com/mkg20001/mkg20001.github.io.git',
      silent: true,
      branch: 'master',
      force:true
    }));
});
