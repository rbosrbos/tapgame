/*	============================================================
    project and folders vars
*/

var src = 'src/';
var dist = 'dist/';



// gulp
var gulp = require('gulp');


// load all plugins in "devDependencies" into the variable $
var $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['dependencies', 'devDependencies']
});



/*	============================================================
    stuff that crashes or can't be loaded into variable $
*/
const babel = require('gulp-babel');
const browsersync = require('browser-sync').create();
const font2css = require('gulp-font2css-display').default;
const cachebust = require('gulp-cache-bust');
const mmq = require('gulp-merge-media-queries');
const reload = browsersync.reload;

var src = {
  images: src + 'images/*.{png,jpg,jpeg,gif,svg}',
  fonts: src + 'fonts/*',
  public: [
    src + '*.html',
    src + 'crossdomain.xml',
    src + 'humans.txt',
    src + 'manifest.appcache',
    src + 'robots.txt',
    src + 'favicon.ico',
    src + '.htaccess',
    src + 'json/*.*'
  ],
  scripts: src + 'scripts/*.js',
  scripts_vendor: src + 'scripts/libs/**/*.js',
  styles: src + 'styles/**/*.s*ss',
  sprites: src + 'images/sprites/*.svg',
};

var dist = {
  images: dist + 'images/',
  fonts: src + 'styles',
  public: dist + '',
  scripts: dist + 'scripts/',
  styles: dist + 'styles/',
  sprites: dist + 'images/',
};



//  ==================================================
//  Images & SVGs

gulp.task('images', function () {
  return gulp.src(src.images)
    .pipe($.cached(gulp.dest(src.images)))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      pngquant: true,
      optimizationLevel: 7,
      verbose: true,
      use: []
    }))
    .pipe(gulp.dest(dist.images))
    .pipe(reload({
      stream: true
    }));

});

gulp.task('sprites', function () {
  gulp.src(src.sprites)
    .pipe($.plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe($.svgSprite({
      svg: {
        namespaceClassnames: false
      },
      mode: {
        symbol: {
          dest: '.',
          sprite: 'sprite.svg'
        }
      }
    }))
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest(dist.sprites))
    .pipe(reload({
      stream: true
    }));
});



//  ==================================================
//  Public files

gulp.task('public', function () {
  gulp.src(src.public)
    .pipe($.plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(gulp.dest(dist.public))
    .pipe(reload({
      stream: true
    }));

});



//  ==================================================
//  Fonts

gulp.task('fonts', function() {
  return gulp
    .src(src.fonts)
    .pipe($.newer(dist.fonts))
    .pipe(font2css())
    .pipe($.concat('_fonts.scss'))
    .pipe(gulp.dest(dist.fonts));
});



//  ==================================================
//  Scripts

gulp.task('scripts', function () {
  gulp
    .src(src.scripts)
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe($.concat('main.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe(gulp.dest(dist.scripts))
    .pipe($.uglify())
    .pipe(
      cachebust({
        type: 'timestamp'
      })
    )
    .pipe(
      $.size({
        gzip: true,
        showFiles: true,
        showTotal: true
      })
    )
    .pipe(gulp.dest(dist.scripts))
    .pipe(
      reload({
        stream: true
      })
    );
});



//  ==================================================
//  Scripts (Vendor / Libs / Frameworks)

gulp.task('scripts_vendor', function () {
  gulp
    .src(src.scripts_vendor)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(dist.scripts))
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe($.size({
      gzip: true,
      showFiles: true,
      showTotal: true
    }))
    .pipe(gulp.dest(dist.scripts))
    .pipe(
      reload({
        stream: true
      })
    );
});



//  ==================================================
//  Styles

gulp.task('styles', function () {
  gulp
    .src(src.styles)
    .pipe(
      $.plumber({
        handleError: function(err) {
          console.log(err);
          this.emit('end');
        },
      })
    )
    .pipe($.sass())
    .pipe(
      $.autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe($.csscomb())
    .pipe(
      mmq({
        log: true,
      })
    )
    .pipe($.csslint())
    .pipe($.concat('main.css'))
    .pipe(
      $.cssnano({
        discardComments: {
          removeAll: true,
        },
        discardDuplicates: true,
        discardEmpty: true,
        minifyFontValues: true,
        minifySelectors: true,
      })
    )
    .pipe(gulp.dest(dist.styles))
    .pipe($.cleanCss())
    .pipe(
      $.size({
        gzip: true,
        showFiles: true,
      })
    )
    .pipe(
      cachebust({
        type: 'timestamp',
      })
    )
    .pipe(gulp.dest(dist.styles))
    .pipe(
      reload({
        stream: true,
      })
    );
});



//  ==================================================
//  Browsersync & gulp server

gulp.task('connect', function () {
  browsersync.init(null, {
    server: {
        baseDir: "./dist"
    },
    //browser: ["chrome.exe", "firefox.exe"],
    // proxy: '127.0.0.1:8889',
    //port: 8080,
    open: 'external',
    reloadOnRestart: true,
    notify: true,
  });
});



//  ==================================================
//  Big gulp brother is watching assets

gulp.task('watch', ['connect'], function() {
  gulp.watch(src.images, ['images']);
  gulp.watch(src.fonts, ['fonts']);
  gulp.watch(src.public, ['public']);
  gulp.watch(src.scripts, ['scripts']);
  gulp.watch(src.scripts_vendor, ['scripts_vendor']);
  gulp.watch(src.src, ['src']);
  gulp.watch(src.styles, ['styles']);
  gulp.watch(src.sprites, ['sprites']);
});

//  ============================================================
//  Deploy netlify task

gulp.task('build', [
  'images',
  'fonts',
  'public',
  'scripts',
  'scripts_vendor',
  'styles',
  'sprites'
]);


//  ============================================================
//  Default task

gulp.task('default', [
  'images',
  'fonts',
  'public',
  'scripts',
  'scripts_vendor',
  'styles',
  'sprites',
  'watch'
]);


