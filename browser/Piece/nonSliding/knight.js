class Knight extends Piece {
	moves(board, position) {
		const knight = this;
		const moves = [];
		const options = [[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2]];
		options.forEach((move) => {
			const newMove = [move[0] + position[0], move[1] + position[1]];
			if(inBounds(newMove) && board.grid[newMove[0]][newMove[1]].color !== knight.color){
				moves.push(newMove);
			}
		})
		return moves;
	}
}