import moment from 'moment';

export const factorConfiguration = [
  {
    id: 'morning',
    factor: 0.75,
    title: 'Morning',
    start: '06:00',
    end: '12:00',
    icon: 'sun',
  },
  {
    id: 'afternoon',
    factor: 0.6,
    title: 'Afternoon',
    start: '12:00',
    end: '18:00',
    icon: 'eye',
  },
  {
    id: 'evening',
    factor: 0.75,
    title: 'Evening',
    start: '18:00',
    end: '06:00',
    icon: 'moon',
  },
];

export function getFactorConfiguration(factorId) {
  const result = factorConfiguration.filter(item => item.id === factorId);

  return result.length ? result[0] : null;
}

export function getFactorValue(factorId) {
  const result = factorConfiguration.filter(item => item.id === factorId);

  return result.length ? result[0].factor : 0;
}

export function calculateFactor(configuration = factorConfiguration) {
  const matches = configuration.filter(conf => {
    const current = moment(new Date(), 'HH:mm');
    const start = moment(conf.start, 'HH:mm');
    const end = moment(conf.end, 'HH:mm');

    if ((start.hour() >= 12 && end.hour() <= 12) || end.isBefore(start)) {
      end.add(1, 'days'); // handle spanning days endTime

      if (current.hour() <= 12) {
        current.add(1, 'days'); // handle spanning days currentTime
      }
    }

    return current.isBetween(start, end);
  });

  if (matches.length > 1 || !matches.length) {
    throw 'Unable to calculate factor automatically based on current time. Please select factor manually.';
  } else {
    return matches[0].id;
  }
}
