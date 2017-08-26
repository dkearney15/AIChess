const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// const allJs = './browser/**/*.js';
const BoardMain = './browser/Board/board.js';
const BoardRest = './browser/Board/**/*.js';

const GameMain = './browser/Game/game.js';
const GameRest = './browser/Game/**/*.js';

const HtmlMain = './browser/Html/html.js';
const HtmlRest = './browser/Html/**/*.js';

const MoveMain = './browser/Move/move.js';
const MoveRest = './browser/Move/**/*.js';

const PieceMain = './browser/Piece/piece.js';
const PieceRest = './browser/Piece/**/*.js';

const PlayerMain = './browser/Player/player.js';
const PlayerRest = './browser/Player/**/*.js';

const homeOfAllJs = './browser/';
const pathsArr = [HtmlMain, HtmlRest, MoveMain, MoveRest, PieceMain, PieceRest, BoardMain, BoardRest, PlayerMain, PlayerRest, GameMain, GameRest];
// you gotta get smart and particular about file structure and reference errors
// make this even more specific, it goes depth first, so you need to get piece.js 
// before going into the sliding folder for example
// alphabetical too, you need to get Html/html.js before actionbox.js, etc.

gulp.task('scripts', function() {
    return gulp.src(pathsArr)
        .pipe(concat('allJs.js'))
        .pipe(gulp.dest(homeOfAllJs));
});