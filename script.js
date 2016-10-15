


var send = XMLHttpRequest.prototype.send;
var $ = document.getElementsByClassName.bind(document);
var createElement = document.createElement.bind(document);
const on = (element, eventName, callback) => {
	element.addEventListener(eventName, callback, false);
};

const markWidth = 50;
const markHeight = 20;
const background = '#333';
const MARK_STYLE = {
	position: 'absolute',
	top: '-50px',
	width: `${markWidth}px`,
	height: `${markHeight}px`,
	background: background,
	'border-radius': '3px',
	'text-align': 'center',
	'line-height': `${markHeight + 1}px`,
	display: 'inline-block'
};

const triangleStyle = {
	position: 'absolute',
	width: 0,
	height: 0,
	'border-style': 'solid',
	'border-width': '10px 10px 0 10px',
	'border-color': `${background} transparent transparent transparent`
};

const addStyle = ($element, style) => {
	for (let key in style) {
		$element.style[key] = style[key];
	}
};

const getDuration = () => {
	const html = $duration.innerHTML;
	const parts = html.split(':');
	return parseInt(parts[0]) * 60 + parseInt(parts[1]);
};

const getSecondWidth = () => {
	return $timeline.offsetWidth / getDuration();
};


const formatTime = (time) => {
	const hours = Math.floor(time / 3600);
	const rest = time % 3600;
	const minutes = Math.floor(rest / 60);
	const seconds = Math.round(rest % 60);
	let result = '';
	if (hours) {
		result = `${hours}:`;
	}
	result += `${padWithZero(minutes)}:${padWithZero(seconds)}`;
	return result;
};


const CONTAINER_CLASS = 'ytp-right-controls';
const TIMELINE_CLASS = 'ytp-progress-bar-padding';
const SUBTITLES_BUTTON_CLASS = 'ytp-subtitles-button';
const DURATION_CLASS = 'ytp-time-duration';

let $container;
let $timeline;
let $subtitlesButton;

let subtitles;
let words;


const appendMark = (time) => {
	const timeString = formatTime(time);
	const $node = createElement('span');
	const left = (time * getSecondWidth() - markWidth / 2) + 'px';
	addStyle($node, MARK_STYLE);
	addStyle($node, { left: left });
	$node.innerHTML = timeString;
	$timeline.appendChild($node);
};

const triggerEvent = ($element, eventName) => {
	var event;
  event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, true);
  event.eventName = eventName;
  $element.dispatchEvent(event);
};

document.addEventListener("DOMContentLoaded", function(event) {
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

const padWithZero = (number) => {
	return number > 9 ? number : '0' + number;
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
	appendMark(time);
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