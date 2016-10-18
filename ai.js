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
			console.log('fuck it moving randomly')
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

function inCenter(pair){
	return (pair[0] === 3 || pair[0] === 4) && (pair[1] === 2 || pair[1] === 3 || pair[1] === 4 || pair[1] === 5)
}

function pawnPromotionMove(move, piece, color){
	if(color === 'black'){
		return piece.value === "\u265F" && move[0] === 0
	} else {
		console.log('dealing with white')
		console.log('move: ',move)
		console.log('piece: ',piece)
		return piece.value === "\u2659" && move[0] === 7
	}
}

function getBestWhiteMove() {
	let min = 0
	let move;
	let piece;
	Board.opposingPieces('black').forEach(function(piece){
		piece.moves().forEach(function(choice){
			if(Board.grid[choice[0]][choice[1]].value === "\u265F"){
				//pawn
				if (min > -3) {
					min = -3
					move = choice
					piece = piece
				}
			} else if (Board.grid[choice[0]][choice[1]].value === "\u265E") {
				//knight
				if(min > -9 ){
					min = -9
					move = choice
					piece = piece
				}
			} else if (Board.grid[choice[0]][choice[1]].value === "\u265D") {
				//bishop
				if(min > -9 ){
					min = -9
					move = choice
					piece = piece
				}
			} else if (Board.grid[choice[0]][choice[1]].value === "\u265C"){
				//rook
				if(min > -15 ){
					min = -15
					move = choice
					piece = piece
				}
			} else if (Board.grid[choice[0]][choice[1]].value === "\u265B") {
				//queen
				if(min > -18 ){
					min = -18
					move = choice
					piece = piece
				}
			}

			// if (pawnPromotionMove(choice, piece, 'white')) {
			// 	min -= 16
			// }

		})
	})
	return {move: move, min: min, piece: piece}
}


function getMovePoints(){
	let movesWithPoints = {}



	movesWithPieces = []
	Board.opposingPieces('white').forEach(function(piece){
		piece.moves().forEach(function(choice){
			let s = piece.position
			let f = choice
			let fp = Board.grid[choice[0]][choice[1]]
			let sp = piece
			let fh = Board.grid[choice[0]][choice[1]].value
			let sh = piece.value

			move(s,f)
			if(!Board.inCheck('black')){
				movesWithPieces.push([choice, piece])
			} 
			undoMove(s,f,fp,sp,fh,sh)
		})
	})

	movesWithPieces.forEach(function(trio){
		let finish = trio[0]
		let start = trio[1].position
		let startPiece = trio[1]
		let finishPiece = Board.grid[trio[0][0]][trio[0][1]]
		let finishHtml = finishPiece.value
		let startHtml = startPiece.value

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
		} else if (inCenter(finish)) {
			//valuing neutral area of the board
			count += 1
		} else if (pawnPromotionMove(trio[1], trio[0], 'black')){
			count += 18
		}
		
		//make move
		move(start,finish)
		//evaluate board now and increment or decrement count according to white's best move
		let x = getBestWhiteMove()
		let min = x.min

		
		//the computer's move value is based on the best move
		//the human can make after said move, while also accounting
		//for the value of the comp's move based on pieces taken
		count += min
		//undo the move
		undoMove(start,finish,finishPiece,startPiece,finishHtml,startHtml)
		//add to the moves with points object
		// console.log(min)
		// console.log(count)
		if(movesWithPoints[count]){
			movesWithPoints[count].push(trio)
		} else {
			movesWithPoints[count] = [trio]
		}

	})
	console.log(movesWithPoints)

	var max = _(Object.keys(movesWithPoints)).sort(function(a,b){return a - b}).last()
	// this is an array of the best moves looking two moves forward
	return movesWithPoints[max]
}