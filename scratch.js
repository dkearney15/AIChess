//write a function that takes a 2 dimensional array
//and returns an array of it's contents in order of a spiral
let box = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
			]

let bigBox = [
			  [01,02,03,04,05],
			  [06,07,08,09,10],
			  [11,12,13,14,15],
			  [16,17,18,19,20],
			  [21,22,23,24,25]
			  ]

function filterEmptyArrays(arr) {
	return arr.filter((array) => {
		return array.length > 0
	})
}

function transform(arr) {
	let output = []
	let x = [];
	while(filterEmptyArrays(arr).length > 0){
		for(i=arr.length-1;i>-1;i--){
			x.push(arr[i].shift())
		}
		output.push(x)
		x = []
	}
	return output
}

function spiral(arr) {
	let output = []
	while(arr.length > 0){
		let x = arr.shift()
		for(i=x.length-1;i>-1;i--){
			output.push(x[i])
		}
		arr = transform(arr)
	}
	return output
}

function insert(element, array) {
  let left = array.slice(0, locationOf(element, array) + 1);
  let right = array.slice(locationOf(element, array) + 1, array.length)
  let output = left.concat(element).concat(right)
  return output;
}

function locationOf(element, array, start, end) {
  start = start || 0;
  end = end || array.length;
  var pivot = parseInt(start + (end - start) / 2, 10);
  if (end-start <= 1 || array[pivot] === element) return pivot;
  if (array[pivot] < element) {
    return locationOf(element, array, pivot, end);
  } else {
    return locationOf(element, array, start, pivot);
  }
}

function recur(total, arr, output, path, pathTotal){
	if(pathTotal === total){
		if(!output.includes(path)) {
			output.push(path);
		}
	} else if(pathTotal < total) {
		arr.forEach((denom) => {
			if(denom + pathTotal <= total){
				let newPath = insert(denom,path)
				let newTotal = pathTotal + denom
				return recur(total,arr,output,newPath,newTotal)
			} 
		})
	}
}

function change(total, arr){
	let output = [];
	let path = [];
	let pathTotal = 0;
	
	recur(total,arr,output,path,pathTotal);
	return output
}

change(27,[1,5,10,20])
























