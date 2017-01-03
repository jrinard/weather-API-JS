////----- Optimizes our FRONT-END code and packages it up in a format that the browser can understand.
//gulp is in charge of using all the other npm packages

//PACKAGES//----- Requiring the PACKAGES - assuming this was installed via terminal with npm install gulp-concat --save-dev
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');//minify
var utilities = require('gulp-util'); // environmental variable for specifying production of development
var del = require('del'); // clean tasks
var jshint = require('gulp-jshint');//Js hint

var buildProduction = utilities.env.production; //tells what kind of environment we are using. part of gulp-util


//TASKS//----- Build TASKS go in the order concatInterface -> jsBrowserify -> minifyScripts.

// grabs multiple interface files and combines them into one.
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js']) //pulls in all the files used in browser // also * is a wild card grabbing all
    .pipe(concat('allConcat.js')) // calls concat function from above and passes in allConcat we are creating
    .pipe(gulp.dest('./tmp')); // tells gulp to save our new file in tmp. Because allConcat will not be used in the browser. we have to browserify it to pull in any modules it uses
}); // as a result all interface js is packed into a temp file called allconcat.js

// grabs the allconcat code and BUNDLES it up and puts it in a new file called app.js. This is code run in production not development
gulp.task('jsBrowserify', ['concatInterface'], function() { // We are telling gulp.task to run the concatInterface task to put all client-side JavaScript into one file before browserifying it.
  return browserify({ entries: ['./tmp/allConcat.js'] })   // pulling in our single front-end file. Because that was taken care of by the require keyword in the interface
    .bundle()   // part of the browserify process
    .pipe(source('app.js')) // Telling browserify to create a new file called app.js. This is done with vinyl-source-stream
    .pipe(gulp.dest('./build/js')); // telling browserify to put it in a new folder called build/js this is our production code not dev code
});

// puts all code on 1 line
gulp.task("minifyScripts", ["jsBrowserify"], function(){ // minify is ran and passes in browserify
  return gulp.src("./build/js/app.js") // grabbing the appfile
    .pipe(uglify()) //calls uglify from above to gulp-uglify/minify app.js
    .pipe(gulp.dest("./build/js")); //specifying the destination to save the file
});

//deletes old tmp and build folders
gulp.task("clean", function(){
  return del(['build', 'tmp']); //passing an array of paths to delete
});

// builds production or dev version
gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts'); // builds production version
  } else {
    gulp.start('jsBrowserify'); // builds development version
  }
});

//js hint linter
gulp.task('jshint', function(){
  return gulp.src(['js/*.js']) // grabs all js files
  .pipe(jshint()) //calls jshint from above
  .pipe(jshint.reporter('default')); // reporter shows us our errors
});
