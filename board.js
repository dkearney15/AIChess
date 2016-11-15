class Board {

	constructor(){
		this.grid = function(){
			let arr = []
			for (let i = 0; i < 8; i++) {
				arr[i] = []
				for (let j = 0; j < 8; j++) {
					let x = new Piece(null,null,[i,j])
					arr[i].push( x )
				}
			}
			return arr
		}()
	}

	populatePieces() {		

		this.grid[0][0] = new Rook("\u2656", 'white', [0,0], this)
		this.grid[0][7] = new Rook("\u2656", 'white', [0,7], this)
		this.grid[7][0] = new Rook("\u265C", 'black', [7,0], this)
		this.grid[7][7] = new Rook("\u265C", 'black', [7,7], this)
	
		this.grid[0][2] = new Bishop("\u2657", 'white', [0,2], this)
    	this.grid[7][2] = new Bishop("\u265D", 'black', [7,2], this)
    	this.grid[0][5] = new Bishop("\u2657", 'white', [0,5], this)
    	this.grid[7][5] = new Bishop("\u265D", 'black', [7,5], this)
		
		this.grid[0][1] = new Knight("\u2658", 'white', [0,1], this)
    	this.grid[0][6] = new Knight("\u2658", 'white', [0,6], this)
    	this.grid[7][1] = new Knight("\u265E", 'black', [7,1], this)
    	this.grid[7][6] = new Knight("\u265E", 'black', [7,6], this)

		this.grid[0][4] = new King("\u2654", 'white', [0,4], this)
    	this.grid[0][3] = new Queen("\u2655", 'white', [0,3], this)
    	this.grid[7][4] = new King("\u265A", 'black', [7,4], this)
    	this.grid[7][3] = new Queen("\u265B", 'black', [7,3], this)

    	for(let i = 0; i < 8; i++){
			this.grid[1][i] = new Pawn("\u2659", 'white', [1,i], this)
			this.grid[6][i] = new Pawn("\u265F", 'black', [6,i], this)
		}

	}

	inBounds(pos){
		return pos[0] < 8 && pos[0] >= 0 && pos[1] < 8 && pos[1]
	}

	inCheck(color){
		let kingPos = this.findKing(color);
		let movesThatKillKing = this.opposingMoves(color).filter(function(move){
			if(move && kingPos){
				return move.toString() == kingPos.toString()
			}
		})
		// if (movesThatKillKing.length > 0) { console.log('board is in check')}
		return movesThatKillKing.length > 0
	}

	opposingPieces(color){
		let board = this
		let oppcol;
		if (color === 'white') {
			oppcol = 'black'
		} else {
			oppcol = 'white'
		}
		let pieces = []
		for(let i = 0; i < board.grid.length; i++){
			for(let j = 0; j < board.grid.length; j++){
				if (board.grid[i][j].color === oppcol) {
					pieces.push(board.grid[i][j])
				}	
			}
		}
		return pieces
	}

	opposingMoves(color){
		let board = this
		let oppcol;
		if (color === 'white') {
			oppcol = 'black'
		} else {
			oppcol = 'white'
		}
		let moves = []
		for(let i = 0; i < board.grid.length; i++){
			for(let j = 0; j < board.grid.length; j++){
				if (board.grid[i][j].color === oppcol) {
					board.grid[i][j].moves().forEach(function(move){
						moves.push(move)
					})
				}
			}
		}
		return moves
	}

	validMoves(color){
		let moves = [];
		let board = this;
		for(let i = 0; i < board.grid.length; i++){
			for(let j = 0; j < board.grid.length; j++){
				if (board.grid[i][j].color === color){
					board.grid[i][j].moves().forEach(function(choice){
						let start = [i,j];
						let finish = choice
						let finishPiece = board.grid[choice[0]][choice[1]]
						let startPiece = board.grid[i][j]
						let finishHtml = finishPiece.value
						let startHtml = startPiece.value
						safeMove(start,finish,board)
						if(!board.inCheck(color)){
							moves.push({start:start,finish:finish,finishPiece:finishPiece,startPiece:startPiece,finishHtml:finishHtml,startHtml:startHtml})
						}
						safeUndoMove(start,finish,finishPiece,startPiece,board)
					})
				}
			}
		}
		//each item in moves is an array of 3 things
		//0: start position
		//1: finish position
		//2: finish piece
		return moves
	}

	findKing(color){
		let kingPos;
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				if(this.grid[i][j].value === "\u2654" && color === 'white'){
					kingPos = [i,j]
				}
				else if (this.grid[i][j].value === "\u265A" && color === 'black'){
					kingPos = [i,j]
				}
			}
		}
		return kingPos
	}

}