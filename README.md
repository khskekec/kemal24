# Kemal 24

Web-based diabetes management software developed for Kemal Kekec.

## Dashboard

* Day average
* Time in range
* Highest and lowest value
* Actual trend
* Day diagram

* Latest Bolus event (time until now)
* Latest correction event (time until now)
* Total Bolus
* Total Carbs
* Diff to Basal in percent (60 / 40 ?)

## TODOS

* Migration of bolus meta data:

{
    totalCarbs: meals.reduce((total, e) => total + e.carbs, 0),
    totalKe: meals.reduce((total, e) => total + e.ke, 0)
}

are in 

{
    meals: {
        totalCarbs: 0,
        totalKes: 0
    }
}