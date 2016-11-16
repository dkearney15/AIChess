var inBounds = function(pos){
		return pos[0] < 8 && pos[0] >= 0 && pos[1] < 8 && pos[1] >= 0
	}

class Piece {

	constructor(value = null, color = null, position = null,board){
		this.board = board
		this.value = value
		this.color = color
		this.position = position
	}

	validMove(start,finish){
		let output = false
		let moves = this.moves()
		moves.forEach(function(move){
			if(move.toString() === finish.toString()){
				output = true
				return
			}
		})
		return output
	}

	direction(x,y) {
		let oppcol;
		if(this.color === 'white'){
			oppcol = 'black'
		} else {
			oppcol = 'white'
		}
		let moves = []
		let i = this.position[0] + x 
		let j = this.position[1] + y
		if(i > 7 || i < 0 || j > 7 || j < 0){return []}
		//^^if the piece is against the edge of the board, there are no moves, so we return []
		while(i < 8 && j < 8 && i > -1 && j > -1){
			if(this.board.grid[i][j].value === null){
				moves.push([i,j])
			} else {
				break
			}
			i += x
			j += y
		}
		//below we check if the last piece we checked up here^^
		//is an opponent's piece and is on the board
		if(i < 8 && j < 8 && i > -1 && j > -1 && this.board.grid[i][j].color === oppcol){
			moves.push([i,j])
			return moves
		}

		return moves
	}

}

	class Pawn extends Piece {

		forwardMoves(){
			let forwardMoves = []
			if(this.color === 'white'){
				if(this.position[0] + 1 < 8 && this.board.grid[this.position[0] + 1][this.position[1]].value === null){
					forwardMoves.push([this.position[0] + 1,this.position[1]])
				} 
				if(this.position[0] === 1 && this.board.grid[3][this.position[1]].value === null){
					forwardMoves.push([3,this.position[1]])
				}

			} else if (this.color === 'black') {

				if( this.position[0] - 1 > -1 && this.board.grid[this.position[0] - 1][this.position[1]].value === null ){
					forwardMoves.push([this.position[0] - 1,this.position[1]])
				} 
				if (this.position[0] === 6 && this.board.grid[4][this.position[1]].value === null) {
					forwardMoves.push([4,this.position[1]])
				}

			}
			return forwardMoves
		}

		attacks(){
			if(this.position[0] === 0 || this.position[0] === 7) {return []}
			let pawn = this;
			let options;
			let oppcol;
			if(pawn.color === 'white') {
				options = [[pawn.position[0] + 1, pawn.position[1] + 1], [pawn.position[0] + 1, pawn.position[1] - 1]]
				oppcol = 'black'
			} else if (pawn.color === 'black') {
				options = [[pawn.position[0] - 1, pawn.position[1] + 1], [pawn.position[0] - 1, pawn.position[1] - 1]]
				oppcol = 'white'
			}

			let attacks = []

			options.forEach(function(attack){
				if(attack[1] > 7 || attack[1] < 0){return []}

				if(pawn.board.grid[attack[0]][attack[1]].color === oppcol){
					attacks.push(attack)
				}
			})
			return attacks
		}

		moves() {
			let moves = []
			this.forwardMoves().forEach(function(move){moves.push(move)})
			this.attacks().forEach(function(move){moves.push(move)})
			return moves
		}

	}

	class Knight extends Piece {
		moves() {
			let knight = this
			let moves = []
			let options = [[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2]]
			options.forEach(function(move){
				let newMove = [move[0] + knight.position[0], move[1] + knight.position[1]]
				if(inBounds(newMove) && knight.board.grid[newMove[0]][newMove[1]].color !== knight.color){
					moves.push(newMove)
				}
			})
			return moves
		}
	}

	class Bishop extends Piece {
		moves(){
			let moves = []
			this.direction(1,1).forEach(function(move){moves.push(move)})
			this.direction(-1,-1).forEach(function(move){moves.push(move)})
			this.direction(-1,1).forEach(function(move){moves.push(move)})
			this.direction(1,-1).forEach(function(move){moves.push(move)})
			return moves
		}
	}

	class Rook extends Piece {
		moves(){
			let moves = []
			this.direction(1,0).forEach(function(move){moves.push(move)})
			this.direction(-1,0).forEach(function(move){moves.push(move)})
			this.direction(0,1).forEach(function(move){moves.push(move)})
			this.direction(0,-1).forEach(function(move){moves.push(move)})
			return moves
		}
	}

	class Queen extends Piece {
		moves(){
			let moves = []
			this.direction(1,1).forEach(function(move){moves.push(move)})
			this.direction(-1,-1).forEach(function(move){moves.push(move)})
			this.direction(-1,1).forEach(function(move){moves.push(move)})
			this.direction(1,-1).forEach(function(move){moves.push(move)})

			this.direction(1,0).forEach(function(move){moves.push(move)})
			this.direction(-1,0).forEach(function(move){moves.push(move)})
			this.direction(0,1).forEach(function(move){moves.push(move)})
			this.direction(0,-1).forEach(function(move){moves.push(move)})
			return moves
		}
	}

	class King extends Piece {
		moves(){
			let king = this
			let moves = []
			let options = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,-1],[-1,1]]
			options.forEach(function(move){
				let newMove = [move[0] + king.position[0], move[1] + king.position[1]]
				if(!inBounds([move[0] + king.position[0], move[1] + king.position[1]])){return}
				if(inBounds(newMove) && king.board.grid[newMove[0]][newMove[1]].color !== king.color) {
					moves.push(newMove)
				}
			})
			return moves
		}
	}

