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