/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
	var RESPONSES = {
		'/countries': [
			{name: 'Cameroon', continent: 'Africa'},
			{name: 'Fiji Islands', continent: 'Oceania'},
			{name: 'Guatemala', continent: 'North America'},
			{name: 'Japan', continent: 'Asia'},
			{name: 'Yugoslavia', continent: 'Europe'},
			{name: 'Tanzania', continent: 'Africa'}
		],
		'/cities': [
			{name: 'Bamenda', country: 'Cameroon'},
			{name: 'Suva', country: 'Fiji Islands'},
			{name: 'Quetzaltenango', country: 'Guatemala'},
			{name: 'Osaka', country: 'Japan'},
			{name: 'Subotica', country: 'Yugoslavia'},
			{name: 'Zanzibar', country: 'Tanzania'},
		],
		'/populations': [
			{count: 138000, name: 'Bamenda'},
			{count: 77366, name: 'Suva'},
			{count: 90801, name: 'Quetzaltenango'},
			{count: 2595674, name: 'Osaka'},
			{count: 100386, name: 'Subotica'},
			{count: 157634, name: 'Zanzibar'}
		]
	};

	setTimeout(function () {
		var result = RESPONSES[url];
		if (!result) {
			return callback('Unknown url');
		}

		callback(null, result);
	}, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */

function getPromiseData(url) {
	return new Promise((resolve, reject) => {
		getData(url, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	})
}


function getCountries() {
	return getPromiseData('/countries');
}

function getCities() {
	return getPromiseData('/cities');
}

function getPopulations() {
	return getPromiseData('/populations');
}

Promise.all([getCountries(), getCities(), getPopulations()])
	.then(function (responses) {

		let countries = [];
		let cities = [];
		let populations = 0;

		responses[0].forEach(function (country) {
			if (country.continent === 'Africa') {
				countries.push(country.name);
			}
		});

		responses[1].forEach(function (city) {
			if (countries.indexOf(city.country) >= 0) {
				cities.push(city.name);
			}
		});

		responses[2].forEach(function (population) {
			if ( cities.indexOf(population.name) >= 0) {
				populations += population.count;
			}
		});

		console.log('Total population in African cities: ' + populations);

	});