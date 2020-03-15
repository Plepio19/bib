/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const fs = require('fs')

async function sandbox (searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/') {
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
	

    const restaurant = await michelin.scrapeAllUrl(searchLink);
	const jsonrestaurant = [];
	for (let i = 0; i < restaurant.length;i++) {
		
		const item = restaurant[i];
		jsonrestaurant.push(JSON.stringify(item,null,2));
	}
	
	fs.appendFileSync('michelin.json',"[ \n");
	fs.appendFileSync('michelin.json',jsonrestaurant);
	fs.appendFileSync('michelin.json',"]");
    console.log(jsonrestaurant);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

sandbox(searchLink);
