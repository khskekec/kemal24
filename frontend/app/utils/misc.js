import classnames from 'classnames';

export function round(number) {
  const num = parseFloat(number);

  if (!num) return 0;
  return num.toFixed(2);
}

export const bloodSugarRangeConfiguration = [
  {
    upperThreshold: 140,
    lowerThreshold: 1,
    classname: 'bg-0',
    fgClassname: 'fg-0',
    color: '#339900',
  },
  {
    upperThreshold: 160,
    lowerThreshold: 140,
    classname: 'bg-1',
    fgClassname: 'fg-1',
    color: '#99cc33',
  },
  {
    upperThreshold: 180,
    lowerThreshold: 160,
    classname: 'bg-2',
    fgClassname: 'fg-2',
    color: '#ffcc00',
  },
  {
    upperThreshold: 200,
    lowerThreshold: 180,
    classname: 'bg-3',
    fgClassname: 'fg-3',
    color: '#ff9966',
  },
  {
    upperThreshold: null,
    lowerThreshold: 200,
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  },
];

export function getBloodSugarRange(value) {
  return bloodSugarRangeConfiguration.filter(e => (e.upperThreshold ? value <= e.upperThreshold : true) && (e.lowerThreshold ? value > e.lowerThreshold : true))[0];
}

export function bloodSugarAlert(value) {
  const hit = bloodSugarRangeConfiguration.filter(e => (e.upperThreshold ? value <= e.upperThreshold : true) && (e.lowerThreshold ? value > e.lowerThreshold : true))

  return hit[0].classname + ' color-white';
}

export function syntaxHighlight(object) {
  let json = JSON.stringify(object, undefined, 2);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

export const trendConfiguration = {
  'STEADY': {
    text: '→',
    classname: 'bg-0',
    fgClassname: 'fg-0',
    color: '#339900',
  },
  'RISING_SLIGHTLY': {
    text: '↗',
    classname: 'bg-1',
    fgClassname: 'fg-1',
    color: '#99cc33',
  },
  'FALLING_SLIGHTLY': {
    text: '↘',
    classname: 'bg-1',
    fgClassname: 'fg-1',
    color: '#99cc33',
  },
  'FALLING': {
    text: '↓',
    classname: 'bg-3',
    fgClassname: 'fg-3',
    color: '#ff9966',
  },
  'RISING': {
    text: '↑',
    classname: 'bg-3',
    fgClassname: 'fg-3',
    color: '#ff9966',
  },
  'FALLING_QUICKLY':{
    text: '↓↓',
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  },
  'RISING_QUICKLY':{
    text: '↑↑',
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  },
  'NOT_IDENTIFIABLE': {
    text: '?',
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  },
  '': {
    text: '?',
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  },
  'NOT_AVAILABLE': {
    text: '-',
    classname: 'bg-4',
    fgClassname: 'fg-4',
    color: '#cc3300',
  }
}

export const getTrend = constant => trendConfiguration[constant] ?? trendConfiguration[''];
