var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var cached = require('gulp-cached');

gulp.task('sass', function() {
    return gulp.src('src/sass/*.scss') // scss以组件的方式组合——只有一个主文件。
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError)) // 编译 sass 并设置输出格式
        .pipe(autoprefixer('last 5 version')) // 添加 CSS 浏览器前缀，兼容最新的5个版本
        .pipe(rename({ suffix: '.min' })) // 对管道里的文件流添加 .min 的重命名
        .pipe(cssnano()) // 压缩 CSS
        .pipe(sourcemaps.write('.')) // 
        .pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下，此时每个文件都有压缩（*.min.css）和未压缩(*.css)两个版本
        .pipe(browserSync.stream({ match: 'dist/css/**/*.css' })); // 使用无刷新 browserSync 注入 CSS
});

gulp.task('html',function () {
    return gulp.src('src/**/*.html')
        .pipe(cached('html'))
        .pipe(gulp.dest('dist/'));
})

// watch 开启本地服务器并监听
gulp.task('watch', function() {
    browserSync.init({
        files: ['dist/css/*.css', 'dist/*.html'],
        open: false,
        server: {
            baseDir: 'dist' // 在 dist 目录下启动本地服务器环境，自动启动默认浏览器
        }
    });

    gulp.run('sass');
    gulp.watch('src/sass/**/*.scss', ['sass']); // 监控scss文件夹下的所有scss文件变动
    gulp.watch('src/**/*.html',['html']);
    // gulp.watch('src/sass/**/(_)*.scss', ['sass']);
    // 监控 dist 目录下除 css 目录以外的变动（如js，图片等），则自动刷新页面
    gulp.watch(['dist/**/*', '!dist/css/**/*']).on('change', browserSync.reload);

});

gulp.task('default', ['watch']);