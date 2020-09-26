import csv from 'csvtojson/v2';
import moment from 'moment';
import db from '../services/database';

const importCSV = async ({fileName}) => {
    const data = await csv({
        delimiter: ',',
        noheader: true,
        headers: ['device', 'serialNumber', 'timestamp', 'type', 'valueAuto', 'valueManual']
    }).fromFile(fileName);

    for (let i in data) {
        const set = data[i];
        const value = set.type == 0 ? set.valueAuto : set.valueManual;
        const start = moment(set.timestamp, 'DD-MM-YYYY HH:mm').toISOString();
        if (!parseInt(value)) continue;

        const alreadyExists = await db.knex.raw('SELECT id FROM Events WHERE typeId = 1 AND value = ' + value + ' AND start >= DATE_SUB(\'' + start + '\', INTERVAL 1 MINUTE) AND start <= DATE_ADD(\'' + start + '\', INTERVAL 1 MINUTE)')
        console.log(alreadyExists);
        if (alreadyExists.length) continue;

        await db.Event.create({
            typeId: 1,
            start: start,
            end: start,
            origin: 'FSL_CSV_IMPORT',
            value: value
        });
    }
}

importCSV({fileName: '/home/selcuk/Downloads/KemalKekec_glucose_26-9-2020.csv'}).then(e => process.exit())