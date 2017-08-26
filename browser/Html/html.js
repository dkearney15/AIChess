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

