class Pawn extends Piece {
	forwardMoves(board, position){
		const forwardMoves = [];
		if(this.color === 'white'){
			if(position[0] + 1 < 8 && board.grid[position[0] + 1][position[1]].value === null){
				forwardMoves.push([position[0] + 1,position[1]]);
			} 
			if(position[0] === 1 && board.grid[3][position[1]].value === null){
				forwardMoves.push([3,position[1]]);
			}
		} else if (this.color === 'black') {
			if( position[0] - 1 > -1 && board.grid[position[0] - 1][position[1]].value === null ){
				forwardMoves.push([position[0] - 1,position[1]]);
			} 
			if (position[0] === 6 && board.grid[4][position[1]].value === null) {
				forwardMoves.push([4,position[1]]);
			}
		}
		return forwardMoves;
	}

	attacks(board, position){
		if(position[0] === 0 || position[0] === 7) {return []}
		const pawn = this;
		let options;
		let oppcol;
		if(pawn.color === 'white') {
			options = [[position[0] + 1, position[1] + 1], [position[0] + 1, position[1] - 1]];
			oppcol = 'black';
		} else if (pawn.color === 'black') {
			options = [[position[0] - 1, position[1] + 1], [position[0] - 1, position[1] - 1]];
			oppcol = 'white';
		}

		const attacks = [];

		options.forEach((attack) => {
			if(attack[1] > 7 || attack[1] < 0){return [];}

			if(board.grid[attack[0]][attack[1]].color === oppcol){
				attacks.push(attack);
			}
		});
		return attacks;
	}

	moves(board, position) {
		return this.forwardMoves().concat(this.attacks());
	}
}