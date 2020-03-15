const maitre = require('./maitre');
const fs = require('fs');


async function sandbox2(nb_page) {
  try {
		
			const newRest = await maitre.scrapeRestaurant(nb_page);
			
			fs.appendFileSync('maitre.json',newRest);
			console.log(newRest);
			fs.appendFileSync('maitre.json',"]");
			console.log('done');
			process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

const nb_page = 154;

fs.appendFileSync('maitre.json',"[ \n");
sandbox2(nb_page);
