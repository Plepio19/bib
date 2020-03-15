const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');
const fs = require('fs');


const parse = data => {
  const $ = cheerio.load(data);
  //let Maitre=[];

  $('div.annuaire_single').each(function (index, element) {
    
    let name = $(element).find('a').text().trim();
	const sep= name.indexOf(' (');
	//console.log(sep);
	name = name.substring(0,sep);
	

    let phone_number = $(element).find('div.single_info3 > div:nth-child(3)').text();
    phone_number = phone_number.replace(/\s/g, '');

    console.log(phone_number);
	console.log(name);
	rest.push(JSON.stringify({ name: name,phone_number: phone_number }, null, 2));
	
	
	

  });
  //fs.appendFileSync('maitre.json', Maitre);
  //fs.appendFileSync('maitre.json', ",");

  //return Maitre;

	
};


module.exports.scrapeRestaurant = async (nbpage) => {
	rest = [];
  for (let i = 1; i< nbpage+1 ; i++){
	  const response = await axios.post('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult/', querystring.stringify({page: `${i}`,sort: 'undefined',request_id: 'e2c0fce410664f6d39d7768bf398c5a9'})
	  );
	  const {data, status} = response;
	  if (status >= 200 && status < 300) {
		  
		test = parse(data,rest);
		
		
	  }
	  
}
return rest;
};


module.exports.get = () => {
  return [];
};