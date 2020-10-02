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
    color: '#339900',
  },
  {
    upperThreshold: 160,
    lowerThreshold: 140,
    classname: 'bg-1',
    color: '#99cc33',
  },
  {
    upperThreshold: 180,
    lowerThreshold: 160,
    classname: 'bg-2',
    color: '#ffcc00',
  },
  {
    upperThreshold: 200,
    lowerThreshold: 180,
    classname: 'bg-3',
    color: '#ff9966',
  },
  {
    upperThreshold: null,
    lowerThreshold: 200,
    classname: 'bg-4',
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
