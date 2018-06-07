const gulp = require('gulp');
const eslint = require('gulp-eslint');
const minimist = require('minimist');
const mocha = require('gulp-spawn-mocha');

/**
 * Lint task. It uses ESLint with Airbnb config (defined in .eslintrc)
 */

gulp.task('lint', () => {
    /**
     * Command line arguments
     *
     * @usage gulp lint -f path/to/file/to/lint
     */
  const argv = minimist(process.argv.slice(2));

    // Files to lint if no arguments are passed to `gulp lint`
  const files = [
        // Ignore node_modules
    '!node_modules/**',
    '!stress-test/**',

    'services/*.js',
    'controllers/*.js',
    'models/*.js',
    'test/*.js',
  ];

    // Lint files passed as arguments or use the ones defined above
  const filesToLint = typeof argv.f === 'string'
        ? argv.f
        : files;

  return gulp.src(filesToLint)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Runs the mocha tests.
 */
gulp.task('mocha', () => {
    // tests to run
  const files = [
    'test/*.spec.js',
  ];

  return gulp.src(files)
        .pipe(mocha({
          timeout: 60000,
          reporter: 'spec',
          istanbul: true,
        }));
});
