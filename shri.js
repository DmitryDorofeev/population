'use strict';
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

/**
 * Wrap getData
 * @param {String} url
 * @returns {Promise}
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
	});
}

/**
 * Get all countries
 * @returns {Promise}
 */
function getCountries() {
	return getPromiseData('/countries');
}

/**
 * Get all cities
 * @returns {Promise}
 */
function getCities() {
	return getPromiseData('/cities');
}

/**
 * Gel all populations
 * @returns {Promise}
 */
function getPopulations() {
	return getPromiseData('/populations');
}

/**
 * Calculate populations by param
 * @param {Object} request
 * @returns {Promise.<Number>}
 */
function calculate(request) {
	let promises = [getPopulations()];

	if (request.country || request.continent) {
		promises.push(getCities());
	}

	if (request.continent) {
		promises.push(getCountries());
	}

	return Promise.all(promises)
		.then(function (responses) {
			let countries = [];
			let cities = [];
			let populations;

			if (request.continent) {
				countries = responses[2]
					.filter((country) => {
						return country.continent === request.continent;
					})
					.map((country) => {
						return country.name;
					});
			}

			if (request.continent || request.country) {
				cities = responses[1]
					.filter((city) => {
						return (!request.country && countries.indexOf(city.country) >= 0) || (request.country && request.country === city.country);
					})
					.map((city) => {
						return city.name;
					});
			}

			populations = responses[0]
				.reduce((prev, population) => {
					if ((!request.city && cities.indexOf(population.name) >= 0) || (request.city && population.name === request.city)) {
						return prev + population.count;
					} else {
						return prev;
					}
				}, 0);

			return populations;
		}, () => {
			return 0;
		});
}

window.Promise = window.Promise || window.Q.Promise;

calculate({ continent: 'Africa' }).then((populations) => {
	console.log('Total population in African cities: ' + populations);
});

document.getElementsByClassName('button')[0].addEventListener('click', () => {
	let cityOrCountry = window.prompt('Введите название страны или города:');

	calculate({ city: cityOrCountry }).then((populations) => {

		if (populations === 0) {
			calculate({ country: cityOrCountry }).then((populations) => {

				if (populations === 0) {
					console.log(`Any info about city or country ${cityOrCountry} not found`);
				} else {
					console.log(`Total population in ${cityOrCountry}: ${populations}`);
				}

			});
		} else {
			console.log(`Total population in ${cityOrCountry}: ${populations}`);
		}

	});
});
