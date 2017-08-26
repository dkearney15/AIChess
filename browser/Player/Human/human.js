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