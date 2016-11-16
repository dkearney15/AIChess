///////////////////////////////////
/////////HELPER FUNCTIONS//////////
///////////////////////////////////
function checkMate(color,board){
	return board.validMoves(color).length < 1 
}

function move(start,finish,board){
	console.log('in real move')
	board.grid[finish[0]][finish[1]] = board.grid[start[0]][start[1]]
	board.grid[finish[0]][finish[1]].position = finish
	board.grid[start[0]][start[1]] = new Piece
	$('#'+ finish.join('-')).html(board.grid[finish[0]][finish[1]].value)
	$('#'+ start.join('-')).empty()
}

function undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml,board){
	board.grid[start[0]][start[1]] = board.grid[finish[0]][finish[1]]
    board.grid[start[0]][start[1]].position = start
    board.grid[finish[0]][finish[1]] = finishPiece
    board.grid[start[0]][start[1]] = startPiece
    board.grid[start[0]][start[1]].position = start
    $('#'+ start.join('-')).html(startHtml)
    $('#'+ finish.join('-')).html(finishHtml);
}

function safeMove(start,finish,board){
	board.grid[finish[0]][finish[1]] = board.grid[start[0]][start[1]]
	board.grid[finish[0]][finish[1]].position = finish
	board.grid[start[0]][start[1]] = new Piece
}

function safeUndoMove(start,finish,finishPiece,startPiece,board){
	board.grid[start[0]][start[1]] = board.grid[finish[0]][finish[1]]
    board.grid[start[0]][start[1]].position = start
    board.grid[finish[0]][finish[1]] = finishPiece
    board.grid[start[0]][start[1]] = startPiece
    board.grid[start[0]][start[1]].position = start
}

function pawnPromotion(board){
	for(i=0;i<8;i++){
		if(board.grid[0][i].value === "\u265F"){
			board.grid[0][i] = new Queen("\u265B", 'black', [0,i])
			$('.action').html('<h1>Pawn promotion for the computer!</h1>');
		} else if (board.grid[7][i].value === "\u2659"){
			board.grid[7][i] = new Queen("\u2655", 'white', [0,i])
			$('.action').html('<h1>Pawn promotion for you!!!!</h1>');
		}
	}
}

function copyGrid(board){
	let copy = [];
	board.grid.forEach( (row) => {
		let newRow = [];
		row.forEach( (square) => {
			newRow.push(square)
		} )
		copy.push(newRow)
	} )
	return copy
}

/////////////////////////
/////////SCRIPT//////////
////////////////////////
//grab window height and set height and width of board to 80% of that
let height = window.innerHeight * 0.8

let chessBoard = document.getElementById('chessboard')

chessBoard.style.height = height + 'px'
chessBoard.style.width = height + 'px'
//first set the board
let gameBoard = new Board();
gameBoard.populatePieces();

//then tell the player what's going on
$('.action').html('<h1>You are white. Select a piece and a place to put it!</h1>')
//then set click handlers on all of the pieces to take turn on clicks, stage letiable determines 
// first (select) or second (place) click
let color = 'white'
let stage = 1
let start;
let finish;
let finishPiece;
let startPiece;
let startHtml;
let finishHtml;


	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if(gameBoard.grid[i][j].value){
				gameBoard.grid[i][j].moves()
			}

			let tag = "#" + gameBoard.grid[i][j].position.join('-')

			$(tag).click({color: color, stage: stage}, takeTurn)
		}
	}

/////////////////////////////
/////////Turn Taker//////////
/////////////////////////////

function takeTurn(event){
	//unhighlight everything
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			let tag = "#" + i + '-' + j

			$(tag).removeClass('blue')
			$(tag).removeClass('yellow')
		}
	}

	color = event.data.color
	if(stage === 1) {
		if(gameBoard.inCheck('white')){
			$('.action').html('<h1>Be careful! You are in check!</h1>');
		}
		// make sure they grab a piece of their own color
		start = [Math.floor(parseInt(this.id[0])),Math.floor(parseInt(this.id[2]))]
		$('#' + start.join('-')).addClass('yellow');
		if(gameBoard.grid[start[0]][start[1]].color !== color){
			$('.action').html('<h1>Select a piece and a place to put it! (You are white btw)</h1>')
			return
		}
		startPiece = gameBoard.grid[start[0]][start[1]]
		startHtml = startPiece.value
		//set stage to two so on the next click we know it's the second (deciding move) click
		stage = 2
	} else if (stage === 2) {
		finish = [Math.floor(parseInt(this.id[0])),Math.floor(parseInt(this.id[2]))]
		finishPiece = gameBoard.grid[finish[0]][finish[1]]
		finishHtml = finishPiece.value
		if(!gameBoard.grid[start[0]][start[1]].validMove(start, finish)){
			$('.action').html('<h1>That is not a valid move!</h1>');
			stage = 1
			return 
		} else {
			//make the move
			move(start,finish,gameBoard)
			if(gameBoard.inCheck(color)){
				//undo it
				$('.action').html('<h1>Cannot move into check!</h1>');
				undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml,gameBoard)
				stage = 1
				setTimeout(() => { $('.action').html('<h1>Select a piece and a place to put it! (You are white btw)</h1>') }, 1500);
				return
			} else {
				$('#' + start.join('-')).addClass('yellow');
				$('#' + finish.join('-')).addClass('yellow');
				pawnPromotion(gameBoard)
				$('.action').html('<h1>Nice Move!</h1>');
			}
		}
		//check for check mate
			if(checkMate('white',gameBoard)){
				$('.action').html('<h1>YOU LOSE!</h1>');
				return
			} 
			if(checkMate('black',gameBoard)){
				$('.action').html('<h1>YOU WIN! HOORAY!</h1>');
				return
			}
		//do the computer's move
		$('.action').html('<h1>...</h1>');
		setTimeout(() => { handleComputerMove(gameBoard,{value:0}); }, 300);
		stage = 1;
	}
}





