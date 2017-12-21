manipulateHTML.gameStartSequence = () => {
	const onePlayerBtn = document.querySelector('.player-select.one-player');
	const twoPlayerBtn = document.querySelector('.player-select.two-player');
	window.gameBoard = new Board();
	window.gameBoard.setBoard();
	manipulateHTML.initializeBoard(gameBoard.grid);
	onePlayerBtn.addEventListener('click', () => {
		console.log('one player');
		nameSelection(1);

	});
	twoPlayerBtn.addEventListener('click', () => {
		console.log('two player');
		nameSelection(2);
	});
	runAfterPlayersSet(startGame);
};

function startGame(){
	window.game = new Game(window.player1, window.player2 || window.computerPlayer);
	console.log('New Game');
}

function runAfterPlayersSet(func){
	if((window.player1 && window.player2) || (window.player1 && window.computerPlayer)){
		func();
	} else {
		setTimeout(() => {
			runAfterPlayersSet(func);
		}, 200)
	}
}

function nameSelection(playerCount){
	const gameStartModal = document.querySelector('#game-start-modal');
	const computerNames = ['Hal 9000', 'Rosie', 'MCP', 'Auto', 'SICO', 'Tron', 'Skynet', 'The Tin Man', 'Wall-E', 'R2D2', 'C3P0', 'ED209', 'Agent Smith', 'T-800', 'Optimus Prime', 'The Iron Giant', 'T-1000', 'Zordon', 'Android 18'];
	const randCompName = computerNames[Math.round(Math.random() * computerNames.length)];
	const gameTypeSelection = document.querySelector('#game-type-select');
	const nameSelection = document.querySelector('#name-select');
	const p1NameEl = document.querySelector('.p1-name');
	const p1Input = p1NameEl.querySelector('input');
	const p2NameEl = document.querySelector('.p2-name');
	const p2Input = p2NameEl.querySelector('input');
	gameTypeSelection.style = "display: none;";
	nameSelection.style = "";
	if(playerCount < 2){
		p2NameEl.className += " disabled";
		p2Input.setAttribute('placeholder', randCompName);
		window.computerPlayer = new AI('black', randCompName);
		$(".p1-name form").submit((event) => {
			event.preventDefault();
			const p1Name = $(p1Input).val();
			// make new human player
			window.player1 = new Human('white', p1Name);
			gameStartModal.style.display = 'none';
		});
	} else {
		$(".p1-name form").submit((event) => {
			event.preventDefault();
			const p1Name = $(p1Input).val();
			window.player1 = new Human('white', p1Name);
			p1NameEl.className += " disabled";
			$(p2Input).hasClass('submitted') ? gameStartModal.style.display = 'none' : $(p1Input).addClass('submitted');
		});
		$(".p2-name form").submit((event) => {
			event.preventDefault();
			const p2Name = $(p2Input).val();
			window.player2 = new Human('black', p2Name);
			p2NameEl.className += " disabled";
			$(p1Input).hasClass('submitted') ? gameStartModal.style.display = 'none' : $(p2Input).addClass('submitted');
		});
	}
}

