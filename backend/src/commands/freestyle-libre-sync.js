import axios from 'axios';
import moment from 'moment';
import db from '../services/database';


const command = async () => {
    const ax = axios.create({
        baseURL: 'https://api-eu.libreview.io/lsl/api',
        timeout: 3000
    });

    // Login
    const loginResponse = await ax.post('/nisperson/getauthenticateduser', {
        "Domain": "Libreview",
        "GatewayType": "LinkUp.Android",
        "Password": process.env.FSL_PASSWORD,
        "UserName": process.env.FSL_USERNAME
    });

    // Needed Parameters
    const country = loginResponse.data.result.Country;
    const patientId = loginResponse.data.result.AccountId;
    const authToken = loginResponse.data.result.UserToken;

    // Get glucose values
    const glucoseResponse = await ax.get('/measurements/GetPatientGlucoseMeasurements', {
        params: {country, patientId},
        headers: {
            UserToken: authToken
        }
    });

    // Get last glucose timestamp
    let lastGlucoseTimestamp = (await db.knex('Events').where('origin', 'FSL_SYNC').select('start').orderBy('start', 'desc').first());
    lastGlucoseTimestamp = lastGlucoseTimestamp ? moment(lastGlucoseTimestamp.start) : null;

    // Set filtered data to whole result set
    let filteredData = glucoseResponse.data.result;

    if (lastGlucoseTimestamp) {
        filteredData = [];
        for (let i in glucoseResponse.data.result) {
            const set = glucoseResponse.data.result[i];

            if (moment(set.Timestamp, 'L LTS').diff(lastGlucoseTimestamp) > 0) {
                filteredData.push(set);
            }
        }
    }

    for (let j in filteredData) {
        const set = filteredData[j];
        const start = moment(set.Timestamp, 'L LTS').toISOString();

        const alreadyExists = await db.knex.raw('SELECT id FROM Events WHERE typeId = 1 AND value = ' + set.Value + ' AND start >= DATE_SUB(\'' + start + '\', INTERVAL 1 MINUTE) AND start <= DATE_ADD(\'' + start + '\', INTERVAL 1 MINUTE)')

        if (alreadyExists.length) continue;

        await db.Event.create({
            typeId: 1,
            start: start,
            end: start,
            origin: 'FSL_SYNC',
            value: set.Value
        });
    }

    console.log('END');
}

command().then(() => process.exit())