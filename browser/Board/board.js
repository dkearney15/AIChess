class Board {
	constructor(){
		this.grid = [];
		this.state = {};
	}

	setBoard(grid){
		for (let i = 0; i < 8; i++) {
			this.grid[i] = []
			for (let j = 0; j < 8; j++) {
				const piece = new Piece(null, null, null);
				this.grid[i].push(piece);
			}
		}
		if(!grid){ // set board for start of game	 
			this.grid[0][0] = new Rook("rook", "\u2656", 'white', 15);
			this.grid[0][7] = new Rook("rook", "\u2656", 'white', 15);
			this.grid[7][0] = new Rook("rook", "\u265C", 'black', 15);
			this.grid[7][7] = new Rook("rook", "\u265C", 'black', 15);
		
			this.grid[0][2] = new Bishop("bishop", "\u2657", 'white', 9);
	    	this.grid[7][2] = new Bishop("bishop", "\u265D", 'black', 9);
	    	this.grid[0][5] = new Bishop("bishop", "\u2657", 'white', 9);
	    	this.grid[7][5] = new Bishop("bishop", "\u265D", 'black', 9);
			
			this.grid[0][1] = new Knight("knight", "\u2658", 'white', 9);
	    	this.grid[0][6] = new Knight("knight", "\u2658", 'white', 9);
	    	this.grid[7][1] = new Knight("knight", "\u265E", 'black', 9);
	    	this.grid[7][6] = new Knight("knight", "\u265E", 'black', 9);

			this.grid[0][4] = new King("king", "\u2654", 'white');
	    	this.grid[0][3] = new Queen("queen", "\u2655", 'white', 18);
	    	this.grid[7][4] = new King("king", "\u265A", 'black');
	    	this.grid[7][3] = new Queen("queen", "\u265B", 'black', 18);

	    	for(let i = 0; i < 8; i++){
				this.grid[1][i] = new Pawn("pawn", "\u2659", 'white', 1);
				this.grid[6][i] = new Pawn("pawn", "\u265F", 'black', 1);
			}
		} else { // match given board
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					const name = grid[i][j].name;
					const HTML = grid[i][j].HTML;
					const color = grid[i][j].color;
					const value = grid[i][j].value;
					const piece = new Piece(name, HTML, color, value);
					this.grid[i][j] = piece;
				}
			}
		}
	}

	render(){
		manipulateHTML.initializeBoard(this.grid);
	}
}







