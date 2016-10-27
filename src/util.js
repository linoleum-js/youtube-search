

/**
 * @param {string} className
 * @return {HTMLElement}
 */
export function $ (className, element=document) {
  return element.getElementsByClassName(className)[0];
}

$.createElement = document.createElement.bind(document);

$.on = (element, eventName, callback) => {
  element.addEventListener(eventName, callback, false);
};


/**
 * templating
 * @param  {string} string
 * @param  {Object} data   data for template
 * @return {HTMLElement}
 */
$.renderFromString = (string, data={}) => {
  const wrapper = $.createElement('div');

  for(let key in data) {
    string = string.replace(`{{${key}}}`, data[key]);
  }
  wrapper.innerHTML = string;
  return wrapper.children[0];
};


/**
 * @param  {number} time time in seconds
 * @return {string}      string in [hh:]MM:ss format
 */
export function formatTime (time) {
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


/**
 * @param  {HTMLElement} $element 
 * @param  {string} eventName
 */
export function triggerEvent ($element, eventName) {
  var event;
  event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, true);
  event.eventName = eventName;
  $element.dispatchEvent(event);
};

/**
 * @param  {number} number
 * @return {string}
 */
export function padWithZero (number) {
  return number > 9 ? number : '0' + number;
};

/**
 * debounce
 * @param  {number}   delay
 * @param  {Function} callback
 * @return {Funciton}
 */
export function debounce(delay, callback) {
  let timeout = null;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(null, arguments);
    });
  };
}

/**
 * track http requirest
 * @param  {Function} callback
 */
export function spyOnHttp (callback) {
  const send = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function () {
    this.onload = function () {
      callback(this);
    };
    send.apply(this, arguments);
  };  
}

/**
 * get parent that mathes filter
 * @param  {HTMLElement} $node  startNode
 * @param  {Function} filter
 * @return {HTMLElement}
 */
export function getParent ($node, filter) {
  let $currentNode = $node;

  while (!filter($currentNode) && $currentNode) {
    $currentNode = $currentNode.parentNode;
  }

  return $currentNode;
}
