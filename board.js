var Board = {
	grid: function(){
		var arr = []
		for (var i = 0; i < 8; i++) {
			arr[i] = []
			for (var j = 0; j < 8; j++) {
				var x = new Piece(null,null,[i,j])
				arr[i].push( x )
			}
		}
		return arr
	}(),
	pieces: _.flatten(this.grid)
}


	Board.populatePieces = function() {		

		Board.grid[0][0] = new Rook("\u2656", 'white', [0,0])
		Board.grid[0][7] = new Rook("\u2656", 'white', [0,7])
		Board.grid[7][0] = new Rook("\u265C", 'black', [7,0])
		Board.grid[7][7] = new Rook("\u265C", 'black', [7,7])
	
		Board.grid[0][2] = new Bishop("\u2657", 'white', [0,2])
    	Board.grid[7][2] = new Bishop("\u265D", 'black', [7,2])
    	Board.grid[0][5] = new Bishop("\u2657", 'white', [0,5])
    	Board.grid[7][5] = new Bishop("\u265D", 'black', [7,5])
		
		Board.grid[0][1] = new Knight("\u2658", 'white', [0,1])
    	Board.grid[0][6] = new Knight("\u2658", 'white', [0,6])
    	Board.grid[7][1] = new Knight("\u265E", 'black', [7,1])
    	Board.grid[7][6] = new Knight("\u265E", 'black', [7,6])

		Board.grid[0][4] = new King("\u2654", 'white', [0,4])
    	Board.grid[0][3] = new Queen("\u2655", 'white', [0,3])
    	Board.grid[7][4] = new King("\u265A", 'black', [7,4])
    	Board.grid[7][3] = new Queen("\u265B", 'black', [7,3])

    	for(var i = 0; i < 8; i++){
			Board.grid[1][i] = new Pawn("\u2659", 'white', [1,i])
			Board.grid[6][i] = new Pawn("\u265F", 'black', [6,i])
		}

	}

	Board.move = function(start,finish){
		var xS = start[0]
		var yS = start[1]
		var xF = finish[0]
		var yF = finish[1]

		if (!Board.grid[xS][yS].value) {
			console.log('Please enter a valid starting position')
		} 
		//some part about the space being occupied
		//is here in the ruby code, but i think it's
		//not necesarry 
	}

	Board.inBounds = function(pos){
		return pos[0] < 8 && pos[0] >= 0 && pos[1] < 8 && pos[1]
	}

	Board.inCheck = function(color){
		var kingPos = Board.findKing(color);
		var movesThatKillKing = Board.opposingMoves(color).filter(function(move){
			if(move && kingPos){
				return move.toString() == kingPos.toString()
			} else {
				return
			}
		})
		if (movesThatKillKing.length > 0) { console.log('board is in check')}
		return movesThatKillKing.length > 0
	}

	Board.opposingPieces = function(color){
			if (color === 'white') {
			var oppcol = 'black'
		} else {
			var oppcol = 'white'
		}
		var pieces = []
		for(var i = 0; i < Board.grid.length; i++){
			for(var j = 0; j < Board.grid.length; j++){
				if (Board.grid[i][j].color === oppcol) {
					pieces.push(Board.grid[i][j])
				}
			}
		}
		return pieces
	}

	Board.opposingMoves = function(color){
		if (color === 'white') {
			var oppcol = 'black'
		} else {
			var oppcol = 'white'
		}
		var moves = []
		for(var i = 0; i < Board.grid.length; i++){
			for(var j = 0; j < Board.grid.length; j++){
				if (Board.grid[i][j].color === oppcol) {
					Board.grid[i][j].moves().forEach(function(move){
						moves.push(move)
					})
				}
			}
		}
		return moves
	}

	Board.teamMoves = function(color){
		var moves = []
		for(var i = 0; i < Board.grid.length; i++){
			for(var j = 0; j < Board.grid.length; j++){
				if (Board.grid[i][j].color === color){
					console.log(Board.grid[i][j])
					Board.grid[i][j].moves().forEach(function(move){
						if (Board.grid[i][j].value !== null){
							moves.push([(Board.grid[i][j].position), move, (Board.grid[move[0]][move[1]])])
						}
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

	Board.findKing = function(color){
		for(var i = 0; i < 8; i++){
			for(var j = 0; j < 8; j++){
				if(Board.grid[i][j].value === "\u2654" && color === 'white'){
					var kingPos = [i,j]
				}
				else if (Board.grid[i][j].value === "\u265A" && color === 'black'){
					var kingPos = [i,j]
				}
			}
		}
		return kingPos
	}