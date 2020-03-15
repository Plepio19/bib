const axios = require('axios');
const cheerio = require('cheerio');
const firsturl = "https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/1";
/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
	
  const $ = cheerio.load(data);
  const RestTable = $('.restaurant__list-row > div.col-md-6');
        console.log(RestTable.length);
		const Restaurant = [];
		
		RestTable.each(function () {
		  const title = $(this).find('.card__menu-content--title > a').text().trim();
		  const type = $(this).find('.card__menu-footer--price').text().trim();
		  const ville = $(this).find('.card__menu-footer--location').text().trim();
		  const Rlink = $(this).find('.link ').attr('href').trim();
		  
		
		  Restaurant.push( Rlink);});
		

  return (Restaurant);
};

const numberOfPage = async firsturl => {
	const data = await scrapeUrl(firsturl);
	const $ = cheerio.load(data);
    let number = $('.js-restaurant__stats > h1').text();
    number = number.replace(/\s/g, '');
    perPage= number.substring(2,4);
    total= number.substring(7,10);
  
    console.log(total);
    console.log(perPage);
	const nb_page = (parseInt(total) / parseInt(perPage));
	console.log(nb_page);
	return nb_page;
}
/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeUrl = async url => {
  const response = await axios.get(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return data;
  }

  console.error(status);

  return null;
};

module.exports.scrapeAllUrl = async url => {
 
  michelin_url = "https://guide.michelin.com";
  let restaurants = [];
  const nbpage = await numberOfPage(firsturl);
  intnbpage = parseInt(nbpage);
  console.log(intnbpage);
  let i = 1;
	while (i<=intnbpage+1)
  {
    const page = `${url}${i}`;
	console.log(page);
    const data = await scrapeUrl(page);
	const rlink = parse(data);
	let index = rlink [0];
	let n = 0;
	let restaurant =[];
	while (index != null) {
		restaurant_url = `${michelin_url}${index}`
		const newdata = await scrapeUrl(restaurant_url);
		const Rdata = parseRestaurant(newdata,restaurant_url);
		restaurants.push(Rdata);
		n +=1;
		index = rlink[n];
	}
	
	i++;
  }
  return restaurants;
 
};

const parseRestaurant = newdata => {
	
	const $ = cheerio.load(newdata);
	const name = $('.restaurant-details__heading.d-lg-none > h2').text().trim(); // Restaurant's name.
	const price_type = $('.restaurant-details__heading-price')["0"].children[0].data.trim(); 
	let phone_number = $('span[x-ms-format-detection="none"]').text().trim(); //Restaurant's phone number.
	phone_number=phone_number.replace(/\s/g, '');
	phone_number=phone_number.substring(3)
	let number = "0"
	phone_number=number.concat(phone_number);
	let heading_list = [];

    $('.restaurant-details__heading--list>li').each(function (i, e) {
        heading_list[i] = $(this).text();
    });

    _location = heading_list[0];//first element of list 'ul'.
	_location = _location.replace(/, /g,','); //replace all ", " by ','. 
	let [adresse, town, zipcode, country] = _location.split(","); //Restaurant's location
	if(typeof(town) == "undefined"){
		_location = heading_list[1];//Second element of list 'ul'.
		_location = _location.replace(/, /g,','); //replace all ", " by ','. 
		[adresse, town, zipcode, country] = _location.split(","); //Restaurant's location
	}

	
	//PRICE AND CUISINE'S TYPE 
	let [price,type] = price_type.split("•");
	price = price.replace(/\s/g, '');//delete all spaces. //Price 
	type = type.substring(1); //Cuisine's type
	
	//ADD image URL
	const imageurl = $('.masthead__gallery-image-item').attr('data-image');
	
	// Restaurant's Website 
	const website = $('a[data-event="CTA_website"]').attr('href');
	//ADD Localisation  GPS?
	//ADD Number of vote and rating? 
	
	

	
	//Restaurant's Equipment 
	let _equipment = [] 
	let _equipment_item = [];
	$('.restaurant-details__services--list>li').each(function (i, e) {
        _equipment[i] = $(this).text();
    });
	for (let i = 0;i<_equipment.length;i++){
		let item = _equipment[i];
		item = item.replace(/\s/g, '')
		item=item.substring(1);
		_equipment_item.push(item);
	}
	
	console.log("name: " + name);
	console.log("price: " + price);
	console.log("cuisine type: " + type);
	console.log("adresse: " + adresse);
	console.log("town: " + town);
	console.log("zipcode: " + zipcode);
	console.log("country: " + country);
	console.log("phone_number: " + phone_number);
	console.log("michelin_url: " + restaurant_url);
	console.log("Equipment:" + _equipment_item);
	console.log("Website: " + website);
	console.log("urlimage: " + imageurl);
	
	
	console.log("......");
	
	
	return {
		name,
		type,
		adresse,
		town,
		zipcode,
		country,
		imageurl,
		phone_number,
		price,
		_equipment_item,
		restaurant_url,
		website
	};
	
}


/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
