const path = require('path');
const http = require('http');
const server = http.createServer();
const express = require('express');
const app = express();
const childProcess = require('child_process');
const chalk = require('chalk');
const fs = require('fs');

if(fs.existsSync('./browser/allJs.js')){
	console.log(chalk.yellow('cleaning out old gulpfile'));
	childProcess.execSync('rm ./browser/allJs.js', (error, stdout, stderr) => {
		if (error) console.log('error deleting old gulpfile: ' + error);
	});
}

console.log(chalk.green('Gulping ...'));
//this runs our gulp tasks synchronously on npm start
childProcess.execSync('gulp scripts', (error, stdout, stderr) => {
	if (error) console.log('gulpfile execution error: ' + error);
});
console.log(chalk.green('Done gulping mmmmmm'));

const PORT = process.env.PORT || 3000;

server.on('request', app);

server.listen(PORT);

console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'chess.html'));
});