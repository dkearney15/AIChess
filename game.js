///////////////////////////////////
/////////HELPER FUNCTIONS//////////
///////////////////////////////////
function checkMate(color){
	if(!Board.inCheck(color)){
		return false
	}
	var toggle = true
	Board.teamMoves(color).forEach(function(trio){
		// console.log(trio)
		var start = trio[0]
		var finish = trio[1]
		var finishPiece = trio[2]
		var startPiece = Board.grid[start[0]][start[1]]
		var finishPiece = Board.grid[finish[0]][finish[1]]
		var startHtml = startPiece.value
		var finishHtml = finishPiece.value

		move(start,finish)
		if(Board.inCheck(color)){
			undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml)
		} else {
			console.log('got out of check')
			undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml)
			toggle = false
		}
	})
	return toggle
}

function move(start,finish){
	Board.grid[finish[0]][finish[1]] = Board.grid[start[0]][start[1]]
	Board.grid[finish[0]][finish[1]].position = finish
	Board.grid[start[0]][start[1]] = new Piece
	$('#'+ finish.join('-')).html(Board.grid[finish[0]][finish[1]].value)
	$('#'+ start.join('-')).empty()
}

function undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml){
	Board.grid[start[0]][start[1]] = Board.grid[finish[0]][finish[1]]
    Board.grid[start[0]][start[1]].position = start
    Board.grid[finish[0]][finish[1]] = finishPiece
    Board.grid[start[0]][start[1]] = startPiece
    Board.grid[start[0]][start[1]].position = start
    $('#'+ start.join('-')).html(startHtml)
    $('#'+ finish.join('-')).html(finishHtml);
}

function pawnPromotion(){
	for(i=0;i<8;i++){
		if(Board.grid[0][i].value === "\u265F"){
			console.log('pawn promotion!')
			Board.grid[0][i] = new Queen("\u265B", 'black', [0,i])
			$('.action').html('<h1>Pawn promotion for the computer!</h1>');
		} else if (Board.grid[7][i].value === "\u2659"){
			console.log('pawn promotion!!!!')
			Board.grid[0][i] = new Queen("\u2655", 'white', [0,i])
			$('.action').html('<h1>Pawn promotion for you!!!!</h1>');
		}
	}
}

/////////////////////////
/////////SCRIPT//////////
////////////////////////
//first set the board
Board.populatePieces();
//then do something fun
$('.action').html('<h1>PREPARE YOURSELF CHALLENGER!</h1>');
setTimeout(function(){ $('.action').html('<h1>Select a piece and a place to put it!</h1>') }, 1500);
//then set click handlers on all of the pieces to take turn on clicks, stage variable determines 
// first (select) or second (place) click
var color = 'white'
var stage = 1
var start;
var finish;
var finishPiece;
var startPiece;
var startHtml;
var finishHtml;


	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if(Board.grid[i][j].value){
				Board.grid[i][j].moves()
			}

			var tag = "#" + Board.grid[i][j].position.join('-')

			$(tag).click({color: color, stage: stage}, takeTurn)
		}
	}

/////////////////////////////
/////////Turn Taker//////////
/////////////////////////////

function takeTurn(event){
	//unhighlight everything
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if(Board.grid[i][j].value){
				Board.grid[i][j].moves()
			}
			var tag = "#" + i + '-' + j

			$(tag).removeClass('blue')
			$(tag).removeClass('yellow')
		}
	}

	var color = event.data.color
	if(stage === 1) {
		if(Board.inCheck('white')){
			$('.action').html('<h1>Be careful! You are in check!</h1>');
		}
		// make sure they grab a piece of their own color
		start = [Math.floor(parseInt(this.id[0])),Math.floor(parseInt(this.id[2]))]
		$('#' + start.join('-')).addClass('yellow');
		if(Board.grid[start[0]][start[1]].color !== color){
			$('.action').html('<h1>That does not belong to you!</h1>');
			// $('#' + start.join('-')).removeClass('yellow')
			setTimeout(function(){ $('.action').html('<h1>Select a piece and a place to put it! (You are white btw)</h1>') }, 1500);
			return
		}
		startPiece = Board.grid[start[0]][start[1]]
		startHtml = startPiece.value
		stage = 2
	} else if (stage === 2) {
		finish = [Math.floor(parseInt(this.id[0])),Math.floor(parseInt(this.id[2]))]
		finishPiece = Board.grid[finish[0]][finish[1]]
		finishHtml = finishPiece.value
		if(!Board.grid[start[0]][start[1]].validMove(start, finish)){
			$('.action').html('<h1>That is not a valid move!</h1>');
			stage = 1
			return 
		} else {
			//make the move
			move(start,finish)
			$('.action').html('<h1>Nice Move!</h1>');
			setTimeout(function(){ return }, 1200);
			if(Board.inCheck(color)){
				//undo it
				$('.action').html('<h1>Whoops! No its not. You cannot move into check!</h1>');
				undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml)
				stage = 1
				setTimeout(function(){ $('.action').html('<h1>Select a piece and a place to put it! (You are white btw)</h1>') }, 1500);
				return
			} else {
				$('#' + start.join('-')).addClass('yellow');
				$('#' + finish.join('-')).addClass('yellow');
				//run pawn promotion, maybe later...
			}
		}
		//check for check mate
			if(checkMate('white')){
				$('.action').html('<h1>YOU LOSE!</h1>');
				return
			} 
			if(checkMate('black')){
				$('.action').html('<h1>YOU WIN! HOORAY!</h1>');
				return
			}
		//do the computer's move
		pawnPromotion()
		handleComputerMove()
		stage = 1
	}
}





