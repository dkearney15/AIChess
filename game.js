///////////////////////////////////
/////////HELPER FUNCTIONS//////////
///////////////////////////////////
function checkMate(color){
	if(!Board.inCheck()){
		return false
	}
	Board.teamMoves(color).forEach(function(trio){
		move(trio[0],trio[1])
		if(Board.inCheck()){
			undoMove(trio[0],trio[1],trio[2])
		} else {
			undoMove(trio[0],trio[1],trio[2])
			return false
		}
	})
	return true
}

function move(start,finish){
	Board.grid[finish[0]][finish[1]] = Board.grid[start[0]][start[1]]
	Board.grid[finish[0]][finish[1]].position = finish
	Board.grid[start[0]][start[1]] = new Piece
	$('#'+ finish.join('-')).html(Board.grid[finish[0]][finish[1]].value)
	$('#'+ start.join('-')).empty()
}

function undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml){
	// debugger;
	Board.grid[start[0]][start[1]] = Board.grid[finish[0]][finish[1]]
    Board.grid[start[0]][start[1]].position = start
    Board.grid[finish[0]][finish[1]] = finishPiece
    Board.grid[start[0]][start[1]] = startPiece
    Board.grid[start[0]][start[1]].position = start
    $('#'+ start.join('-')).html(startHtml)
    $('#'+ finish.join('-')).html(finishHtml);
}

function pawnPromotion(){

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
		handleComputerMove()
		stage = 1
	}
}





