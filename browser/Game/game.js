class Game {
	constructor(player1, player2, takingTurn, turnsTaken = 0, winner, loser){
		this.player1 = player1;
		this.player2 = player2;
		this.turnsTaken = turnsTaken;
		this.takingTurn = this.player1;
	}
}