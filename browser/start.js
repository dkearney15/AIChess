//start the damn game
$( document ).ready(() => {
	// manipulateHTML.gameStartSequence(); 

	Vue.component('player-select-option', {
	  	template: `
	  		<div id="game-type-select">
				<div class="player-select one-player">
					<h1>One Player</h1>
					<h4>Play against the computer.</h4>
				</div>
				<div class="player-select two-player">
					<h1>Two Player</h1>
					<h4>Play against a friend.</h4>
				</div>
			</div>`
	});

	Vue.component('name-entry', {
	  	template: `			
	  		<div id="name-select">
				<div class="player-select p1-name">
					<h2>Player One Name</h2>
					<form>
					  <input type="text" name="p1-name"><br>
					  <input type="submit" value="Submit">
					</form>
				</div>
				<div class="player-select p2-name">
					<h2>Player Two Name</h2>
					<form>
					  <input type="text" name="p2-name"><br>
					  <input type="submit" value="Submit">
					</form>
				</div>
			</div>`
	});

	const gameStartModal = new Vue({
		el: '#game-start-modal',
		data: {
	    	playerOptions: [
	    		{ count: 1, text: 'Play against the computer.' },
	    		{ count: 2, text: 'Play against a friend.' },
	    	],
	    	stage: 1
	    },
	    methods: {
	    	// advance: () => { this.stage++; }
	    }
	});
});