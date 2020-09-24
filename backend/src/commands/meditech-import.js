import csv from 'csvtojson/v2';
import moment from 'moment';
import db from '../services/database';

const importCSV = async ({fileName}) => {
    const data = await csv({
        delimiter: ';',
        noheader: false,
        headers: ['index', 'date', 'time', 'not_needed', 'bloodSugar', 'not_needed', 'not_needed', 'not_needed', 'not_needed', 'not_needed', 'not_needed', 'not_needed', 'bolusValue']
    }).fromFile(fileName);

    console.log(data);

    for (let i in data) {
        const set = data[i];
        const value = set.bloodSugar ? set.bloodSugar : set.bolusValue;

        if (!parseInt(value)) continue;
        const type = set.bloodSugar && parseInt(set.bloodSugar) ? 'bloodSugar' : 'bolus';

        const start = moment(set.date + ' ' + set.time, 'YYYY/MM/DD HH:mm:ss').toISOString();
        if (type === 'bloodSugar') {
            const alreadyExists = await db.knex.raw('SELECT id FROM Events WHERE typeId = 1 AND value = ' + value + ' AND start >= DATE_SUB(\'' + start + '\', INTERVAL 1 MINUTE) AND start <= DATE_ADD(\'' + start + '\', INTERVAL 1 MINUTE)')

            if (alreadyExists.length) continue;

            await db.Event.create({
                typeId: 1,
                start: start,
                end: start,
                origin: 'MEDITECH_CSV_IMPORT',
                value: value
            });
        } else {
            const alreadyExists = await db.knex.raw('SELECT id FROM Events WHERE typeId = 5 AND value = ' + parseFloat(value) + ' AND start >= DATE_SUB(\'' + start + '\', INTERVAL 1 MINUTE) AND start <= DATE_ADD(\'' + start + '\', INTERVAL 1 MINUTE)')

            if (alreadyExists.length) continue;

            await db.Event.create({
                typeId: 5,
                start: start,
                end: start,
                origin: 'MEDITECH_CSV_IMPORT',
                value: parseFloat(value)
            });
        }
    }
}

importCSV({fileName: '/home/selcuk/Downloads/Kemal Kekec 18.09.2020 (1).csv'}).then(e => process.exit())