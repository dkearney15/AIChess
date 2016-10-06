var inBounds = function(pos){
		return pos[0] < 8 && pos[0] >= 0 && pos[1] < 8 && pos[1] >= 0
	}

class Piece {

	constructor(value = null, color = null, position = null){
		this.value = value
		this.color = color
		this.position = position
	}

	validMove(start,finish){
		var output = false
		var moves = this.moves()
		moves.forEach(function(move){
			if(move.toString() === finish.toString()){
				output = true
				return
			}
		})
		return output
	}

	// inBoundsMoves(start){
	// 	var allMoves = Board.grid[start[0]][start[1]].moves()
	// 	// return _.takeWhile(allMoves, function(move){ Board.inBounds(move) })
	// 	return allMoves.filter(function(move){ inBounds(move) })
	// }

	direction(x,y) {
		if(this.color === 'white'){
			var oppcol = 'black'
		} else {
			var oppcol = 'white'
		}
		var moves = []
		var i = this.position[0] + x 
		var j = this.position[1] + y
		if(i > 7 || i < 0 || j > 7 || j < 0){return []}
		//'' or whatever we use for a vacant space
		//so the piece slides until it gets off the board 
		//or hits a piece, can't go no further 
			while(i < 8 && j < 8 && i > -1 && j > -1){
				if(Board.grid[i][j].value === null){
					moves.push([i,j])
				} else {
					break
				}
				i += x
				j += y
			}
		//below we check if the last piece we checked up here^^
		//is an opponent's piece
		if(i < 8 && j < 8 && i > -1 && j > -1 && Board.grid[i][j].color === oppcol){
			moves.push([i,j])
			return moves
		}

		return moves
	}

}

	class Pawn extends Piece {

		forwardMoves(){
			var forwardMoves = []
			if(this.color === 'white'){
				if(this.position[0] + 1 < 8 && Board.grid[this.position[0] + 1][this.position[1]].value === null){
					forwardMoves.push([this.position[0] + 1,this.position[1]])
				} 
				if(this.position[0] === 1 && Board.grid[3][this.position[1]].value === null){
					forwardMoves.push([3,this.position[1]])
				}

			} else if (this.color === 'black') {

				if( this.position[0] - 1 > -1 && Board.grid[this.position[0] - 1][this.position[1]].value === null ){
					forwardMoves.push([this.position[0] - 1,this.position[1]])
				} 
				if (this.position[0] === 6 && Board.grid[4][this.position[1]].value === null) {
					forwardMoves.push([4,this.position[1]])
				}

			}
			return forwardMoves
		}

		attacks(){
			if(this.position[0] === 0 || this.position[0] === 7) {return []}

			if(this.color === 'white') {
				var options = [[this.position[0] + 1, this.position[1] + 1], [this.position[0] + 1, this.position[1] - 1]]
				var oppcol = 'black'
			} else if (this.color === 'black') {
				var options = [[this.position[0] - 1, this.position[1] + 1], [this.position[0] - 1, this.position[1] - 1]]
				var oppcol = 'white'
			}

			var attacks = []

			options.forEach(function(attack){
				if(attack[1] > 7 || attack[1] < 0){return []}

				if(Board.grid[attack[0]][attack[1]].color === oppcol){
					attacks.push(attack)
				}
			})
			return attacks
		}

		moves() {
			var moves = []
			this.forwardMoves().forEach(function(move){moves.push(move)})
			this.attacks().forEach(function(move){moves.push(move)})
			return moves
		}

	}

	class Knight extends Piece {
		moves() {
			var knight = this
			var moves = []
			var options = [[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2]]
			options.forEach(function(move){
				var newMove = [move[0] + knight.position[0], move[1] + knight.position[1]]
				if(inBounds(newMove) && Board.grid[newMove[0]][newMove[1]].color !== knight.color){
					moves.push(newMove)
				}
			})
			return moves
		}
	}

	class Bishop extends Piece {
		moves(){
			var moves = []
			this.direction(1,1).forEach(function(move){moves.push(move)})
			this.direction(-1,-1).forEach(function(move){moves.push(move)})
			this.direction(-1,1).forEach(function(move){moves.push(move)})
			this.direction(1,-1).forEach(function(move){moves.push(move)})
			return moves
		}
	}

	class Rook extends Piece {
		moves(){
			var moves = []
			this.direction(1,0).forEach(function(move){moves.push(move)})
			this.direction(-1,0).forEach(function(move){moves.push(move)})
			this.direction(0,1).forEach(function(move){moves.push(move)})
			this.direction(0,-1).forEach(function(move){moves.push(move)})
			return moves
		}
	}

	class Queen extends Piece {
		moves(){
			var moves = []
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
			var king = this
			var moves = []
			var options = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,-1],[-1,1]]
			options.forEach(function(move){
				var newMove = [move[0] + king.position[0], move[1] + king.position[1]]
				if(!inBounds([move[0] + king.position[0], move[1] + king.position[1]])){return}
				if(inBounds(newMove) && Board.grid[newMove[0]][newMove[1]].color !== king.color) {
					moves.push(newMove)
				}
			})
			return moves
		}
	}

