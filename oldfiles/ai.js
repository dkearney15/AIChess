function handleComputerMove(board){
	makeBestMove(board);
	pawnPromotion(gameBoard);
	$('.action').html('<h1>Your turn! Select a piece and place to put it!</h1>');
}

function makeBestMove(board){
	const obj = _.sample(findBestMove(board));
	move(obj.start,obj.finish,gameBoard);
	$('#' + obj.start.join('-')).addClass('blue');
	$('#' + obj.finish.join('-')).addClass('blue');
}

function inCenter(pair){
	return (pair[0] === 3 || pair[0] === 4) && (pair[1] === 2 || pair[1] === 3 || pair[1] === 4 || pair[1] === 5);
}

function pawnPromotionMove(move, piece, color){
	if(color === 'black'){
		if(piece.value === "\u265F" && move[0] === 0){console.log('pawn promotion possible for black: ' + move)}
		return piece.value === "\u265F" && move[0] === 0;
	} else {
		if(piece.value === "\u2659" && move[0] === 7){console.log('pawn promotion possible for white: ' + move)}
		return piece.value === "\u2659" && move[0] === 7;
	}
}

function checkMateMove(obj, board, color){
	safeMove(obj.start,obj.finish,board);
	const checkMate = board.evaluate(color).validMoves.length < 1 ? true : false;
	safeUndoMove(obj.start,obj.finish,obj.finishPiece,obj.startPiece,board);
	return checkMate;
}

function evaluateMove(obj, color, board){
	let value;
	if(color === 'black'){
		//black move
		if(obj.finishHtml === "\u2659"){
			//pawn
			value = 3;
		} else if (obj.finishHtml === "\u2658") {
			//knight
			value = 9;
		} else if (obj.finishHtml === "\u2657") {
			//bishop
			value = 9;
		} else if (obj.finishHtml === "\u2656"){
			//rook
			value = 15;
		} else if (obj.finishHtml === "\u2655") {
			//queen
			value = 18;
		} else if (inCenter(obj.finish)) {
			//valuing neutral area of the board
			value = 1;
		} else {
			value = 0;
		}
		if(pawnPromotionMove(obj.finish,obj.startPiece,color)) { 
			value += 16; 
			console.log('pawn promotion black: ', value);
		}
		if(checkMateMove(obj,board,color)) { value += 10000; }
	} else {
		//white move
		if(obj.finishHtml === "\u265F"){
			//pawn
			value = -3;
		} else if (obj.finishHtml === "\u265E") {
			//knight
			value = -9;
		} else if (obj.finishHtml === "\u265D") {
			//bishop
			value = -9;
		} else if (obj.finishHtml === "\u265C"){
			//rook
			value = -15;
		} else if (obj.finishHtml === "\u265B") {
			//queen
			value = -18;
		} else {
			value = 0;
		}
		if(pawnPromotionMove(obj.finish,obj.startPiece,color)) { 
			value -= 16;
			console.log('pawn promotion white: ', value);
		}
		if(checkMateMove(obj,board,color)) { value -= 10000; }
	}
	return value;
}

function findBestMove(board){
	const StartTime = Date.now();
	let max;
	let bestMove;
	let depth = 0;
	//^^depth is a counter for moves deep, right now we can only get 3 deep
	let x = 0;
	//^^^x is a counter for individual moves looked at
	function recur(board,depth,parentNode = {value:0}){
		let color;
		let minNode;
		let minObj;
		depth % 2 === 0 ? color = 'black' : color = 'white';
		if(depth < 4) {
			depth += 1
			board.evaluate(color).validMoves.forEach((obj) => {	
				x += 1;
				let value = evaluateMove(obj, color, board) + parentNode.value;
				let move;
				//first time through the move is the object, then we always grab from the parent so we
				//have the original move that the ai can actually make when we're all done
				depth < 2 ? move = obj : move = parentNode.move;
				let node = {value:value, move:move};
				if(color === 'black'){
					//if it's black, then we have to look at all possibilities, make the move, recur, later undo
					safeMove(obj.start,obj.finish,board);
					recur(board,depth,node);
					safeUndoMove(obj.start,obj.finish,obj.finishPiece,obj.startPiece,board);
				} else {
					//if it's white, we want to find the best move and only deal with that 
					//outside the forEach - minimax
					if(!minNode || value < minNode.value){
						minObj = obj;
						minNode = {value:value, move:move};
					}
				}
			});

			if(minNode){ 
				// if we defined minNode, then it was white's turn and we went thru all the moves
				// found the best move for white and now we have to make it and recur
				safeMove(minObj.start,minObj.finish,board);
				recur(board,depth,minNode);
				safeUndoMove(minObj.start,minObj.finish,minObj.finishPiece,minObj.startPiece,board);
			}
		} else {
			//if we get down here we've gone as deep as the depth will allow and we check on the
			//value of the move we've been incrementing, if it's the new max or there is no max yet
			//we record that in the bestMove array, all moves in the array have the same point value
			if( (!max || parentNode.value > max) && parentNode.move){
				max = parentNode.value;
				bestMove = [parentNode.move];
			} else if( (!max || parentNode.value === max) && parentNode.move){
				bestMove.push(parentNode.move);
			}
		}
	}
	recur(board,depth);
	const finishTime = Date.now();
	const timeTaken = (finishTime - StartTime) / 1000;
	console.log('best move is worth ', max);
	console.log(bestMove);
	console.log('evaluated ' + x + ' moves in ' + timeTaken + ' seconds');
	console.log( (x / timeTaken) + ' moves per second');
	if(!bestMove){debugger;}
	return bestMove;
}