const fs = require('fs');

let michelin_file = fs.readFileSync('michelin.json');
let maitre_file = fs.readFileSync('maitre.json');


let restmichelin = JSON.parse(michelin_file);

let restmaitre = JSON.parse(maitre_file);

console.log(restmichelin.length);
console.log(restmaitre.length);

let bib = []
let counter = 0;
restmichelin.forEach(elem_michelin => {
	
	restmaitre.forEach(elem_maitre => {
		if(elem_maitre.phone_number === elem_michelin.phone_number){
			bib.push(JSON.stringify(elem_michelin, null, 2));
			counter+=1;
			
	}
	
	});
});

console.log(counter);
fs.appendFileSync('bib.json',"[ \n");
fs.appendFileSync('bib.json',bib);
fs.appendFileSync('bib.json',"]");

