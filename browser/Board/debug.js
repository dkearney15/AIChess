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