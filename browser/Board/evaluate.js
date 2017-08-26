Board.prototype.runOnEachSpace = (arrOfFunctions, arrOfSpaces) => {
	const accumulator = {};
	if(arrOfSpaces){
		arrOfSpaces.forEach((space) => {
			arrOfFunctions.forEach((func) => {
				runFuncOnSpace(accumulator, func, space.piece, space.position, this);
			});
		});
	} else {
		this.grid.forEach((row, i) => {
			row.forEach((piece, j) => {
				arrOfFunctions.forEach((func) => {
					runFuncOnSpace(accumulator, func, piece, [i,j], this);
				});
			});
		});
	}
	return accumulator;
};

function runFuncOnSpace(accumulator, func, piece, position, board){
	const result = func(piece, position, board);
	if(!accumulator[func.name]) accumulator[func.name] = [];
	if(!result) return;
	if(result.checkAlert) accumulator[result.checkAlert + 'InCheck'] = true;
	// functions can return an object with the result AND an alert that one color is in check
	accumulator[func].push(result.default);
}

function blackPieces(piece){
	if(piece.color === 'black') return {default: piece};
}

function whitePieces(piece){
	if(piece.color === 'white') return {default: piece};	
}

function blackKingPosition(piece, position){
	if(piece.color === 'black' && piece.name === 'king') return {default: position};
}

function whiteKingPosition(piece, position){
	if(piece.color === 'white' && piece.name === 'king') return {default: position};
}

function blackPiecePositons(piece, position){
	if(piece.color === 'black') return {default: position};
}

function whitePiecePositons(piece, position){
	if(piece.color === 'white') return {default: position};
}

function blackMoves(piece, position, board, blackKingPosition, whiteKingPosition){
	if(piece.color === 'black'){
		let checkMove;
		const moves = piece.moves(board, position).map((end) => {
			const endPiece = board.grid[end[0], end[1]];
			if(end[0] === whiteKingPosition[0] && end[1] === whiteKingPosition[1]) checkMove = 'white';
			return new Move(position, end, piece, endPiece);
		});
		return {default: moves, checkAlert: checkMove}
	}
}

function whiteMoves(piece, position, board, blackKingPosition, whiteKingPosition){
	if(piece.color === 'white'){
		let checkMove;
		const moves = piece.moves(board, position).map((end) => {
			const endPiece = board.grid[end[0], end[1]];
			if(end[0] === whiteKingPosition[0] && end[1] === blackKingPosition[1]) checkMove = 'black';
			return new Move(position, end, piece, endPiece);
		});
		return {default: moves, checkAlert: 'black'}
	}
}

