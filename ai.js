function handleComputerMove(){
	$('.action').html('<h1>I am thinking really hard and totally not moving randomly.</h1>');
		setTimeout(function(){ 
			if(checkMate('black')){
				$('.action').html('<h1>YOU WIN! HOORAY!</h1>');
				return
			} else {
				makeBestMove()
				$('.action').html('<h1>Your turn! Select a piece and place to put it!</h1>');
			}
		}, 1500);
}



function makeBestMove(){
	while(true) {
		var moveAndPiece = _.sample(getMovePoints())
		// console.log(moveAndPiece)
		if(!moveAndPiece) {
			//make a random move
			makeRandomMove()
			return
		}
		// if (!moveAndPiece.length === 2){
		// 	moveAndPiece = moveAndPiece[0]
		// }
		var startPositionX = moveAndPiece[1].position
		var endPositionX = [moveAndPiece[0][0],moveAndPiece[0][1]]
		var startPieceX = moveAndPiece[1]
		var finishPieceX = Board.grid[moveAndPiece[0][0]][moveAndPiece[0][1]]
		var finishHtmlX = finishPieceX.value
		var startHtmlX = startPieceX.value
		// console.log(startPositionX.toString() + '======>' + endPositionX.toString())
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
	movesWithPieces.forEach(function(thing){
		if(Board.grid[thing[0][0]][thing[0][1]].value === "\u2659"){
			//pawn
			if(movesWithPoints[3]){
				movesWithPoints[3].push([thing])
			} else {
				movesWithPoints[3] = [thing]
			}
		} else if (Board.grid[thing[0][0]][thing[0][1]].value === "\u2658") {
			//knight
			if(movesWithPoints[9]){
				movesWithPoints[9].push(thing)
			} else {
				movesWithPoints[9] = [thing]
			}
		} else if (Board.grid[thing[0][0]][thing[0][1]].value === "\u2657") {
			// //bishop
			if(movesWithPoints[9]){
				movesWithPoints[9].push(thing)
			} else {
				movesWithPoints[9] = [thing]
			}
		} else if (Board.grid[thing[0][0]][thing[0][1]].value === "\u2656"){
			//rook
			if(movesWithPoints[15]){
				movesWithPoints[15].push(thing)
			} else {
				movesWithPoints[15] = [thing]
			}
		} else if (Board.grid[thing[0][0]][thing[0][1]].value === "\u2655") {
			//queen
			if(movesWithPoints[18]){
				movesWithPoints[18].push(thing)
			} else {
				movesWithPoints[18] = [thing]
			}
		} else if (thing[0][0] >= 3) {
			//valuing neutral area of the board
			if(movesWithPoints[1]){
				movesWithPoints[1].push(thing)
			} else {
				movesWithPoints[1] = [thing]
			}
		}
	})

	var max = _(Object.keys(movesWithPoints)).sort(function(a,b){return a - b}).last()
	console.log(max)
	console.log(movesWithPoints)
	// this is an array of the best moves looking only one move forward 
	return movesWithPoints[max]
}