const manipulateHTML = {};

manipulateHTML.makeMove = (start, finish) => {
	// actually make the move on the html
	// no validation here, 
	// only call this function once validated 
};

manipulateHTML.highlightSpace = (position, color) => {
	$('#' + position.join('-')).addClass(color);
};

manipulateHTML.clearHighlight = () => {
	const allSpaces = document.querySelectorAll('#chessboard > div');
	allSpaces.forEach((space) => { 
		space.className.indexOf('white') > -1 ? space.className = 'white' : space.className = 'black';
	});
};

manipulateHTML.initializeBoard = (grid) => {
	const boardHTML = document.getElementById('chessboard');
	grid.forEach((row, i) => {
		row.forEach((space, j) => {
			color = (i + j) % 2 === 0 ? 'black' : 'white';
			const div = document.createElement('div');
			div.id = i + '-' + j;
			div.className = color;
			div.innerHTML = space.HTML ? space.HTML : '&nbsp;';
			boardHTML.appendChild(div);
		});
	});
};

manipulateHTML.inCheckWarning = (color) => {
	// put some warning on screen
	// not in action box and have it stay there until end of turn
};


manipulateHTML.actionBox = {};

manipulateHTML.actionBox.promptPieceSelect = (color) => {
	$('.action').html('<h1>Choose a piece! You are ' + color + '.</h1>');
};

manipulateHTML.actionBox.validPieceSelect = () => {
	$('.action').html('<h1>Now choose your move!</h1>');
};

manipulateHTML.actionBox.invalidPieceSelect = (color) => {
	$('.action').html('<h1>That is not your piece. Your are ' + color + '.</h1>');
};

manipulateHTML.actionBox.validMoveSelect = () => {
	$('.action').html('<h1>Nice Move!</h1>');
};

manipulateHTML.actionBox.invalidMoveSelect = () => {
	$('.action').html('<h1>That is not a valid move. Please select a new piece.</h1>');	
};
class Move {
	constructor(startPos, endPos, startPiece, endPiece){
		this.startPos = startPos;
		this.endPos = endPos;
		this.startPiece = startPiece;
		this.endPiece = endPiece;
	}
}
class Piece {
	constructor(name = "empty", HTML = null, color = null, value=0){
		this.HTML = HTML;
		this.color = color;
		this.name = name;
		this.value = value;
	}
}
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
class Sliding extends Piece {
	direction(x, y, board, position) {
		const oppcol = this.color === 'white' ? 'black' : 'white';
		const moves = [];
		let i = position[0] + x;
		let j = position[1] + y;
		if(i > 7 || i < 0 || j > 7 || j < 0) return [];
		//^^if the piece is against the edge of the board, there are no moves, so we return []
		while(i < 8 && j < 8 && i > -1 && j > -1){
			if(board.grid[i][j].value) break;
			moves.push([i,j]); 
			i += x;
			j += y;
		}
		//below we check if the last piece we checked up here^^
		//is an opponent's piece and is on the board
		if(i < 8 && j < 8 && i > -1 && j > -1 && board.grid[i][j].color === oppcol){
			moves.push([i,j]);
		 	return moves;
		}
		return moves;
	} 
}
class Bishop extends Sliding {
	moves(board, position){
		const moveDirections = [[1,1],[-1,-1],[-1,1],[1,-1]];
		const moves = moveDirections.map((dir) => {
			const x = dir[0];
			const y = dir[1];
			return this.direction(x, y, board, position);
		});
		return _.flatten(moves);
	}
}
class Queen extends Sliding {
	moves(board, position){
		const moveDirections = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[-1,1],[1,-1]];
		const moves = moveDirections.map((dir) => {
			const x = dir[0];
			const y = dir[1];
			return this.direction(x, y, board, position);
		});
		return _.flatten(moves);
	}
}
class Rook extends Sliding {
	moves(board, position){
		const moveDirections = [[1,0],[-1,0],[0,1],[0,-1]];
		const moves = moveDirections.map((dir) => {
			const x = dir[0];
			const y = dir[1];
			return this.direction(x, y, board, position);
		});
		return _.flatten(moves);
	}
}
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








Board.prototype.logBoard = function(){
	this.grid.forEach((row, i) => {
	  let rowString = '';
	  let style = [];
	  row.forEach((space, j) => {
	    const firstLetter = space.name ? '%c' + space.name.slice(0,1) : '%c ';
	    const backCol = (i + j) % 2 === 0 ? 'blue' : 'yellow';
	    style.push("color:" + space.color + ";" + "background:" + backCol + ";" + "font-size:36px;text-transform:uppercase;");
	    rowString += firstLetter;
	  });
	  console.log(
	  	rowString, 
	  	style[0], 
	  	style[1],
	  	style[2], 
	  	style[3], 
	  	style[4], 
	  	style[5],
	  	style[6],
	  	style[7]
	  );
	});
}
Board.prototype.runOnEachSpace = (arrOfFunctions, arrOfSpaces) => {
	const accumulator = {};
	if(arrOfSpaces){
		arrOfSpaces.forEach((space) => {
			arrOfFunctions.forEach((func) => {
				runFuncOnSpace(accumulator, func, space.piece, space.position, this);
			});
		});
	} else {
		this.grid.forEach((row, i) => {
			row.forEach((piece, j) => {
				arrOfFunctions.forEach((func) => {
					runFuncOnSpace(accumulator, func, piece, [i,j], this);
				});
			});
		});
	}
	return accumulator;
};

function runFuncOnSpace(accumulator, func, piece, position, board){
	const result = func(piece, position, board);
	if(!accumulator[func.name]) accumulator[func.name] = [];
	if(!result) return;
	if(result.checkAlert) accumulator[result.checkAlert + 'InCheck'] = true;
	// functions can return an object with the result AND an alert that one color is in check
	accumulator[func].push(result.default);
}

function blackPieces(piece){
	if(piece.color === 'black') return {default: piece};
}

function whitePieces(piece){
	if(piece.color === 'white') return {default: piece};	
}

function blackKingPosition(piece, position){
	if(piece.color === 'black' && piece.name === 'king') return {default: position};
}

function whiteKingPosition(piece, position){
	if(piece.color === 'white' && piece.name === 'king') return {default: position};
}

function blackPiecePositons(piece, position){
	if(piece.color === 'black') return {default: position};
}

function whitePiecePositons(piece, position){
	if(piece.color === 'white') return {default: position};
}

function blackMoves(piece, position, board, blackKingPosition, whiteKingPosition){
	if(piece.color === 'black'){
		let checkMove;
		const moves = piece.moves(board, position).map((end) => {
			const endPiece = board.grid[end[0], end[1]];
			if(end[0] === whiteKingPosition[0] && end[1] === whiteKingPosition[1]) checkMove = 'white';
			return new Move(position, end, piece, endPiece);
		});
		return {default: moves, checkAlert: checkMove}
	}
}

function whiteMoves(piece, position, board, blackKingPosition, whiteKingPosition){
	if(piece.color === 'white'){
		let checkMove;
		const moves = piece.moves(board, position).map((end) => {
			const endPiece = board.grid[end[0], end[1]];
			if(end[0] === whiteKingPosition[0] && end[1] === blackKingPosition[1]) checkMove = 'black';
			return new Move(position, end, piece, endPiece);
		});
		return {default: moves, checkAlert: 'black'}
	}
}


Board.prototype.inCheck = (color) => {
	const getOppMoves = color === 'white' ? blackMoves : whiteMoves;
	const funcsToRun = [blackPiecePositons, whitePiecePositons, blackKingPosition, whiteKingPosition, getOppMoves];
	const evaluation = this.runOnEachSpace(funcsToRun);
};

class Player {
	constructor(type,color,name){
		this.type = type;
		this.color = color;
		this.name = name;
	}
}
class Human extends Player {
	listenForPieceSelection(color, board){
		const human = this;
		manipulateHTML.actionBox.promptPieceSelect(color);
		const allSpaces = document.querySelectorAll('#chessboard > div');
		const humansPieces = allSpaces.filter((space) => {
			if(space.innerHTML === '') return false;
			const spaceColor = parseInt(HTML.slice(2)) > 9817 ? 'black' : 'white';
			return spaceColor === color;
		});
		const notHumansPieces = _.difference(allSpaces, humansPieces);

		humansPieces.forEach((piece) => {
			$(piece).on('click', () => {
				const x = parseInt(this.id.split('-')[0]);
				const y = parseInt(this.id.split('-')[1]);
				const position = [x,y];
				if(board.grid[x][y].color !== 'color') debugger; 
				manipulateHTML.actionBox.validPieceSelect();
				manipulateHTML.highlightSpace(position, 'yellow');
				human.listenForMoveSelection(color, board, position);
			});
		});

		notHumansPieces.forEach((piece) => {
			$(piece).on('click', () => {
				manipulateHTML.actionBox.invalidPieceSelect();
				$("#chessboard").effect("shake");
			});
		});
	}

	listenForMoveSelection(color, board, startPosition){
		const allSpaces = document.querySelectorAll('#chessboard > div');
		$(allSpaces).off('click');
		// find all valid moves for piece by passing startPosition
		//     to board function for valid moves
		// add event listeners to those spaces who's callback does: 
		//     1) make the move on the board state
		//     2) do a full re-render of the HTML board based 
		//	   on the board state
		//     3) highlight spaces so user can see their move
	}
}
class AI extends Player {
	
}




class Game {
	constructor(player1, player2, turnsTaken = 0, winner, loser, takingTurn){
		this.player1 = player1;
		this.player2 = player2;
		this.turnsTaken = turnsTaken;
		this.takingTurn = this.player1;
	}
}
manipulateHTML.gameStartSequence = () => {
	const onePlayerBtn = document.querySelector('.player-select.one-player');
	const twoPlayerBtn = document.querySelector('.player-select.two-player');
	onePlayerBtn.addEventListener('click', () => {
		console.log('one player');
		nameSelection(1);
	});
	twoPlayerBtn.addEventListener('click', () => {
		console.log('two player');
		nameSelection(2);
	});
};


function nameSelection(playerCount){
	const computerNames = ['Hal 9000', 'Rosie', 'MCP', 'Auto', 'SICO', 'Tron', 'Skynet', 'The Tin Man', 'Wall-E', 'R2D2', 'C3P0', 'ED209', 'Agent Smith', 'T-800', 'Optimus Prime', 'The Iron Giant', 'T-1000', 'Zordon', 'Android 18'];
	const randCompName = computerNames[Math.round(Math.random() * computerNames.length)];
	const gameTypeSelection = document.querySelector('#game-type-select');
	const nameSelection = document.querySelector('#name-select');
	const p1Name = document.querySelector('.p1-name');
	const p2Name = document.querySelector('.p2-name');
	const p2Input = p2Name.querySelector('input');
	gameTypeSelection.style = "display: none;";
	nameSelection.style = "";
	if(playerCount < 2){
		p2Name.className += " disabled";
		p2Input.setAttribute('placeholder', randCompName);
		// create computer player
		// listen for name submission to create human player
	} else {
		// listen for BOTH player name selections to create human players
	}
}

