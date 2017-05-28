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

	evaluate(turnColor){
		let test = 0;

		let board = this; //for sanity and scoping issues
		let blackKingPos;
		let whiteKingPos;
		let whitePieces = [];
		let blackPieces = [];
		let boardInCheck;
		let takingTurnPieces;
		let takingTurnKingPos;
		let opposingPieces;
		let validMoves = [];
		// run through the board, bigO is constant right now, exactly 64
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				test += 1;
				// find the kings
				if(board.grid[i][j].value === "\u2654"){
					whiteKingPos = [i,j];
				}
				else if (board.grid[i][j].value === "\u265A"){
					blackKingPos = [i,j]
				}
				// get the pieces
				if(board.grid[i][j].color === 'white'){
					whitePieces.push(board.grid[i][j]);
				} else if (board.grid[i][j].color === 'black'){
					blackPieces.push(board.grid[i][j]);
				}
			}
		}
		
		if(turnColor === 'white'){
			takingTurnPieces = whitePieces;
			takingTurnKingPos = whiteKingPos;
			opposingPieces = blackPieces;
		} else {
			takingTurnPieces = blackPieces;
			takingTurnKingPos = blackKingPos;
			opposingPieces = whitePieces;
		}

		// at most 136 moves
		opposingPieces.forEach((opposingPiece)=>{ // go though opponent's pieces
			let oppPieceMoves = opposingPiece.moves(); // array of moves for opposing piece
			for(let i = 0; i < oppPieceMoves.length; i++){
				test += 1;
				if(oppPieceMoves[i].toString() === takingTurnKingPos.toString()){
					boardInCheck = true; // if move equal kingPos board in check
					break;
				}
			}
		})

		// we know if the board is in check or not, which is useful, we have the opponents moves
		// now we make each possible move for the turnTaking side, and then run through the opposing
		// pieces, calculate thier moves and see if they include the takingTurn kingPos, we also, need
		// to check if we captured a piece, since we would then need to not calculate their moves, since
		// they dead

		takingTurnPieces.forEach((piece)=>{
			piece.moves().forEach((choice)=>{
				//in here at most 136 times
				let valid = true;
				let start = piece.position;
				let finish = choice;
				let finishPiece = board.grid[choice[0]][choice[1]];
				let startPiece = piece;
				let finishHtml = finishPiece.value;
				let startHtml = startPiece.value;
				safeMove(start,finish,board);
				// run through opposingPieces and see if moves include takingTurnKingPos
				// at most 136 moves (not really, always less) for 20 pieces 
				for(let i = 0; i < opposingPieces.length; i++){
					// if piece just got taken, don't go through it's moves
					if(opposingPieces[i].position.toString() !== finish.toString()){
						let oppPieceMoves = opposingPieces[i].moves(); // array of moves for opposing piece
						for(let j = 0; j < oppPieceMoves.length; j++){
							test += 1;
							if(oppPieceMoves[j].toString() === takingTurnKingPos.toString()){
								valid = false; // if move equal kingPos board in check
								break;
							}
						}
					}
					if(!valid){break}
				}
				if(valid){validMoves.push(choice)}
				safeUndoMove(start,finish,finishPiece,startPiece,board)
			})
		})

		console.log('times thourgh in new function ===================> ', test);

		return {
			inCheck: !!boardInCheck,
			validMoves: validMoves,
			whiteKing: whiteKingPos,
			blackKing: blackKingPos,
			whitePieces: whitePieces,
			blackPieces: blackPieces
		}
	}

}