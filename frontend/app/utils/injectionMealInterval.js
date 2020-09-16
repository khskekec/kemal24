const configuration = [
  {
    threshold: 150,
    interval: 20,
  },
  {
    threshold: 120,
    interval: 10,
  },
  {
    threshold: 100,
    interval: 5,
  },
  {
    threshold: 90,
    interval: 0,
  },
  {
    threshold: 70,
    interval: -5,
  },
  {
    threshold: 0,
    interval: -10,
  }
];

export default bloodSugar => {
  for (let i in configuration) {
    if (bloodSugar >= configuration[i].threshold) {
      return configuration[i].interval;
    }
  }

  return 0;
}
