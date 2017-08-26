Board.prototype.inCheck = (color) => {
	const getOppMoves = color === 'white' ? blackMoves : whiteMoves;
	const funcsToRun = [blackPiecePositons, whitePiecePositons, blackKingPosition, whiteKingPosition, getOppMoves];
	const evaluation = this.runOnEachSpace(funcsToRun);
};
