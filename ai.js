function handleComputerMove(){
	$('.action').html('<h1>...</h1>');
		setTimeout(function(){ 
			if(checkMate('black')){
				$('.action').html('<h1>YOU WIN! HOORAY!</h1>');
				return
			} else {
				makeBestMove()
				$('.action').html('<h1>Your turn! Select a piece and place to put it!</h1>');
			}
		}, 1200);
}



function makeBestMove(){
	while(true) {
		var moveAndPiece = _.sample(getMovePoints())
		// console.log(moveAndPiece)
		if(!moveAndPiece) {
			//if no moves worth points
			//make a random move
			makeRandomMove()
			return
		}
		var startPositionX = moveAndPiece[1].position
		var endPositionX = [moveAndPiece[0][0],moveAndPiece[0][1]]
		var startPieceX = moveAndPiece[1]
		var finishPieceX = Board.grid[moveAndPiece[0][0]][moveAndPiece[0][1]]
		var finishHtmlX = finishPieceX.value
		var startHtmlX = startPieceX.value
		move(startPositionX,endPositionX)
			if(Board.inCheck('black')){
				$('.action').html('<h1>Black is in check!</h1>');
				undoMove(startPositionX,endPositionX,finishPieceX,startPieceX,finishHtmlX,startHtmlX)
			} else {
				$('#' + startPositionX.join('-')).addClass('blue');
				$('#' + endPositionX.join('-')).addClass('blue');
				break
			}
	}
}

function makeRandomMove(){
	console.log('fuck it, doing it randomly')
	while(true){
		var toggle = true
		while(toggle){
			var randomEnemyPiece = _.sample(Board.opposingPieces(color))
			var position = randomEnemyPiece.position
			if(randomEnemyPiece.moves().length > 0){
			toggle = false
			}
		}
		var randomMove = _.sample(randomEnemyPiece.moves())
		var randomMoveFinishPiece = Board.grid[randomMove[0]][randomMove[1]]
		var finishHtml = Board.grid[randomMove[0]][randomMove[1]].value
		var startHtml = Board.grid[position[0]][position[1]].value
		var startPiece = Board.grid[position[0]][position[1]]

		move(position,randomMove) 
		if(Board.inCheck('black')){
			$('.action').html('<h1>Black is in check!</h1>');
			undoMove(position,randomMove,randomMoveFinishPiece,startPiece,finishHtml,startHtml)
		} else {
			$('#' + position.join('-')).addClass('blue');
			$('#' + randomMove.join('-')).addClass('blue');
			break
		}
	}
}







function getMovePoints(){
	movesWithPieces = []
	Board.opposingPieces('white').forEach(function(piece){
		piece.moves().forEach(function(choice){
			var s = piece.position
			var f = choice
			var fp = Board.grid[choice[0]][choice[1]]
			var sp = piece
			var fh = Board.grid[choice[0]][choice[1]].value
			var sh = piece.value

			move(s,f)
			if(!Board.inCheck('black')){
				movesWithPieces.push([choice, piece])
			} 
			undoMove(s,f,fp,sp,fh,sh)
		})
	})

	var movesWithPoints = {}
	movesWithPieces.forEach(function(trio){
		var finish = trio[0]
		var start = trio[1].position
		var startPiece = trio[1]
		var finishPiece = Board.grid[trio[0][0]][trio[0][1]]
		var finishHtml = finishPiece.value
		var startHtml = startPiece.value

		var count = 0
		if(finishHtml === "\u2659"){
			//pawn
			count += 3
		} else if (finishHtml === "\u2658") {
			//knight
			count += 9
		} else if (finishHtml === "\u2657") {
			//bishop
			count += 9
		} else if (finishHtml === "\u2656"){
			//rook
			count += 15
		} else if (finishHtml === "\u2655") {
			//queen
			count += 18
		} else if (trio[0][0] >= 3) {
			//valuing neutral area of the board
			count += 1
		}
		//make move
		move(start,finish)
		//see if move put white in check
		if(Board.inCheck('white')){
			//not sure if from a strategy standpoint this should be valued
			count += 7
		}
		//evaluate board now and increment or decrement count according to white's possible moves
		Board.opposingPieces('black').forEach(function(piece){
			piece.moves().forEach(function(choice){
				if(Board.grid[choice[0]][choice[1]].value === "\u265F"){
					//pawn
					count -= 3
				} else if (Board.grid[choice[0]][choice[1]].value === "\u265E") {
					//knight
					count -= 9
				} else if (Board.grid[choice[0]][choice[1]].value === "\u265D") {
					//bishop
					count -= 9
				} else if (Board.grid[choice[0]][choice[1]].value === "\u265C"){
					//rook
					count -= 15
				} else if (Board.grid[choice[0]][choice[1]].value === "\u265B") {
					//queen
					count -= 18
				}
			})
		})
		//undo the move
		undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml)
		//add to the moves with points object
		if(movesWithPoints[count]){
			movesWithPoints[count].push(trio)
		} else {
			movesWithPoints[count] = [trio]
		}

	})

	var max = _(Object.keys(movesWithPoints)).sort(function(a,b){return a - b}).last()
	// this is an array of the best moves looking two moves forward
	return movesWithPoints[max]
}