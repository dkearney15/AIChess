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