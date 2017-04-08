if (!window.Intl)  //formatJS is not supported in safari, by means of this validation and its instruction we are providing safari browser with the funcionality needed to formatting dates properly
{
  window.Intl = require('intl');
  require('intl/locale-data/jsonp/es-CO.js');
  require('intl/locale-data/jsonp/en-US.js');
}

var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');
var IntlMessageFormat = window.IntlMessageFormat = require('intl-messageformat');
require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

var locale = localStorage.locale || 'es';

var es = require('./es');
var en = require('./en-US');
var MESSAGES  = {}; //creating an object with all the languages and available translation strings
MESSAGES.es = es;
MESSAGES['en-US'] = en; //it has [] because the key has a - symbol in the name

module.exports = {
	message: function (text, options)
				{
					options = options || {};
					var msg = new IntlMessageFormat(MESSAGES[locale][text],locale,null);
					return msg.format(options);
				},
	date: new IntlRelativeFormat(locale)
}



