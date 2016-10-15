


var o = {
  send: XMLHttpRequest.prototype.send
};

var $ = document.getElementsByClassName.bind(document);

console.log('WEWERWERWER');

const CONTAINER_CLASS = 'ytp-right-controls';
const container = $(CONTAINER_CLASS);
let subtitles;
let words;


const searchInWords = (list, query) => {
	const occurrences = list.filter((item) => {
		return item.innerHTML.indexOf(query) !== -1;
	});
	return occurrences;
};

const padWithZero = (number) => {
	return number > 9 ? number : '0' + number;
};

const formatTime = (time) => {
	const hours = Math.floor(time / 3600);
	const rest = time % 3600;
	const minutes = Math.floor(rest / 60);
	const seconds = Math.round(rest % 60);
	// console.log(minutes, seconds);
	let result = '';
	if (hours) {
		result = hours + ':';
	}
	result += `${padWithZero(minutes)}:${padWithZero(seconds)}`;
	return result;
};

const getTime = (word) => {
	return word.parentNode.getAttribute('t') / 1000;
};

const handleSubtitlesLoad = (response) => {
	const parser = new DOMParser();
	subtitles = parser.parseFromString(response, 'text/xml');
	words = subtitles.getElementsByTagName('s');
	words = [].slice.call(words, 0);
	handleSearch('примерно');
};

const handleSearch = (query) => {
	const result = searchInWords(words, query);
	const word = result[0];
	const time = getTime(word);
	console.log(formatTime(time));
};

XMLHttpRequest.prototype.send = function () {
  this.onload = function () {
  	if (this.responseURL.indexOf('timedtext') === -1) {
  		return;
  	}
  	handleSubtitlesLoad(this.response);
  };
  o.send.apply(this, arguments);
};;