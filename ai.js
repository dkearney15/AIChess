function handleComputerMove(board,node){
	if(checkMate('black', gameBoard)){
		$('.action').html('<h1>YOU WIN! HOORAY!</h1>');
		return
	} else {
		makeBestMove(board,node)
		pawnPromotion(gameBoard)
		$('.action').html('<h1>Your turn! Select a piece and place to put it!</h1>');
	}
}



function makeBestMove(board,node){
	let vBoard = new Board
	//TODO: properly duplicate the board's grid and then inside findBestMove you can use
	//either the date or the x iterator to stop the recursion so it doesn't go on too long,
	//right now it's either about 10 seconds (3/1.5 moves ahead) or over 10 minutes (4/2 moves ahead)
	//if u break out of that loop now, the board.grid is all messed up cuz safeUndoMove doesn't happen
	// let vBoard.grid = 
	let obj = _.sample(findBestMove(board,node))

	move(obj.start,obj.finish,gameBoard)
	$('#' + obj.start.join('-')).addClass('blue');
	$('#' + obj.finish.join('-')).addClass('blue');
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

function evaluateMove(move,color,board){
	let finishHtml = board.grid[move[0]][move[1]].value
	if(color === 'black'){
		//black move
		if(finishHtml === "\u2659"){
			//pawn
			return 3
		} else if (finishHtml === "\u2658") {
			//knight
			return 9
		} else if (finishHtml === "\u2657") {
			//bishop
			return 9
		} else if (finishHtml === "\u2656"){
			//rook
			return 15
		} else if (finishHtml === "\u2655") {
			//queen
			return 18
		} else if (inCenter(finish)) {
			//valuing neutral area of the board
			return 1
		} else {
			return 0
		}
	} else {
		//white move
		if(finishHtml === "\u265F"){
			//pawn
			return -3
		} else if (finishHtml === "\u265E") {
			//knight
			return -9
		} else if (finishHtml === "\u265D") {
			//bishop
			return -9
		} else if (finishHtml === "\u265C"){
			//rook
			return -15
		} else if (finishHtml === "\u265B") {
			//queen
			return -18
		} else if (inCenter(move)) {
			//valuing neutral area of the board
			return -1
		} else {
			return 0
		}
	}
}

function findBestMove(board, parentNode){
	let max;
	let bestMove;
	let count = 0;
	//^^count is a counter for moves deep, right now we can only get 3 deep
	let x = 0;
	//^^^x is a counter for individual moves looked at
	function recur(board,parentNode,count){
		let color;

		let minNode;
		let minObj;
		count % 2 === 0 ? color = 'black' : color = 'white'
		if(count < 5) {
			count += 1
			board.validMoves(color).forEach( (obj) => {
				x += 1
				console.log(x)

				let value = evaluateMove(obj.finish,color,board) + parentNode.value;
				let move;
				//first time through the move is the object, then we always grab from the parent so we
				//have the original move that the ai can actually make when we're all done
				count < 2 ? move = obj : move = parentNode.move
				let node = {value:value,move:move}

				if(color === 'black'){
					//if it's black, then we have to look at all possibilities, make the move, recur, later undo
					safeMove(obj.start,obj.finish,board);
					recur(board,node,count);
					safeUndoMove(obj.start,obj.finish,obj.finishPiece,obj.startPiece,board);
				} else {
					//if it's white, we want to find the best move and only deal with that 
					//outside the forEach - minimax
					if(!minNode || value < minNode.value){
						minObj = obj;
						minNode = {value:value,move:move}
					}
				}
			} )

			if(minNode){ 
				// if we defined minNode, then it was white's turn and we went thru all the moves
				//found the best move for white and now we have to make it and recur
				safeMove(minObj.start,minObj.finish,board);
				recur(board,minNode,count);
				safeUndoMove(minObj.start,minObj.finish,minObj.finishPiece,minObj.startPiece,board);
			}

		} else {
			//if we get down here we've gone as deep as the coutn will allow and we check on the
			//value of the move we've been incrementing, if it's the new max or there is no max yet
			//we record that in the bestMove array, all moves in the array have the same point value
			if( (!max || parentNode.value > max) && parentNode.move){
				max = parentNode.value
				bestMove = [parentNode.move]
			} else if( (!max || parentNode.value === max) && parentNode.move){
				bestMove.push(parentNode.move)
			}
		}
	}
	recur(board, parentNode, count)
	console.log(bestMove)
	console.log(max)
	return bestMove
}