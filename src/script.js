

import {
  $,
  triggerEvent,
  padWithZero
} from './util';

import YtInterface from './YtInterface';
const style = require('../style/style.css');

var send = XMLHttpRequest.prototype.send;


const markWidth = 50;
const markHeight = 20;

const CONTAINER_CLASS = 'ytp-right-controls';
const TIMELINE_CLASS = 'ytp-progress-bar-padding';
const SUBTITLES_BUTTON_CLASS = 'ytp-subtitles-button';
const DURATION_CLASS = 'ytp-time-duration';

let $container;
let $timeline;
let $subtitlesButton;
let $duration;

let subtitles;
let words;

let yt;



$.on(document, 'DOMContentLoaded', function(event) {
  yt = new YtInterface();
	$container = $(CONTAINER_CLASS)[0];
	$timeline = $(TIMELINE_CLASS)[0];
	$subtitlesButton = $(SUBTITLES_BUTTON_CLASS)[0];
	$duration = $(DURATION_CLASS)[0];

	triggerEvent($subtitlesButton, 'click');
	triggerEvent($subtitlesButton, 'click');
});


const searchInWords = (list, query) => {
	const occurrences = list.filter((item) => {
		return item.innerHTML.indexOf(query) !== -1;
	});
	return occurrences;
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
	yt.appendMark(time);
};

XMLHttpRequest.prototype.send = function () {
  this.onload = function () {
  	if (this.responseURL.indexOf('timedtext') === -1) {
  		return;
  	}
  	handleSubtitlesLoad(this.response);
  };
  send.apply(this, arguments);
};;
