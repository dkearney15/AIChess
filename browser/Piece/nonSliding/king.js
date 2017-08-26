class King extends Piece {
	moves(board, position){
		const king = this;
		const moves = [];
		const options = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,-1],[-1,1]];
		options.forEach((move) => {
			const newMove = [move[0] + position[0], move[1] + position[1]];
			if(!inBounds([move[0] + position[0], move[1] + position[1]])){return;}
			if(inBounds(newMove) && board.grid[newMove[0]][newMove[1]].color !== king.color) {
				moves.push(newMove);
			}
		});
		return moves;
	}
}