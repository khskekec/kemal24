import axios from 'axios';
import dotEnv from '../services/dotenv';
import db from "../services/database";
import moment from "moment";

class Dexcom {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.axios = axios.create({
            baseURL: 'https://shareous1.dexcom.com/ShareWebServices/Services',
            timeout: 3000
        });

        this.trendConfiguration = [
            "",
            "RISING_QUICKLY",
            "RISING",
            "RISING_SLIGHTLY",
            "STEADY",
            "FALLING_SLIGHTLY",
            "FALLING",
            "FALLING_QUICKLY",
            "NOT_IDENTIFIABLE",
            "NOT_AVAILABLE",
        ]
    }

    async login() {
        const payload =  {
            "accountName": this.username,
            "password": this.password,
            "applicationId": 'd89443d2-327c-4a6f-89e5-496bbb0317db',
        }

        const response = await this.axios.post('/General/AuthenticatePublisherAccount', payload);

        if (response.data === '00000000-0000-0000-0000-000000000000') {
            throw "FAIL";
        }

        const response2 = await this.axios.post('/General/LoginPublisherAccountByName', payload);

        if (response2.data === '00000000-0000-0000-0000-000000000000') {
            throw "FAIL";
        }

        this.sessionId = response2.data;
    }

    async wrapper(func) {
        let response = null;

        if (this.sessionId === '') await this.login();

        try {
            response = await func.apply(this);

            if (response === '') throw 'FAIL';
        } catch (e) {
            await this.login();

            response = await func.apply(this);
        }

        return response;
    }

    async read(minutes = 1440, maxCount = 288) {
        return await this.wrapper(async () => {
            const params = {
                "sessionId": this.sessionId,
                minutes,
                maxCount
            }

            const response = await this.axios.post('/Publisher/ReadPublisherLatestGlucoseValues', null, {params});

            return response.data.map(e => ({
                value: e.Value,
                meta: {
                    trend: this.trendConfiguration[e.Trend]
                },
                timestamp: parseInt(e.WT.slice(6,-2)) / 1000,
                start: new Date(parseInt(e.WT.slice(6,-2)))
            }));
        });
    }

    async readLatest() {
        return (await this.read(60, 1))[0];
    }

    async readCurrent() {
        return (await this.read(10, 1))[0];
    }
}


const command = async () => {
    const dex = new Dexcom(process.env.DEXCOM_USERNAME, process.env.DEXCOM_PASSWORD);

    let lastGlucoseTimestamp = (await db.knex('Events').where('origin', 'DEXCOM_SYNC').select('start').orderBy('start', 'desc').first());
    lastGlucoseTimestamp = lastGlucoseTimestamp ? moment(lastGlucoseTimestamp.start) : null;

    const glucoseResponse = await dex.read();
    let filteredData = glucoseResponse;

    if (lastGlucoseTimestamp) {
        filteredData = [];
        for (let i in glucoseResponse) {
            const set = glucoseResponse[i];

            if (moment(set.timestamp, 'X').diff(lastGlucoseTimestamp) > 0) {
                filteredData.push(set);
            }
        }
    }

    for (let j in filteredData) {
        const set = filteredData[j];
        const start = moment(set.timestamp, 'X').toISOString();

        const alreadyExists = await db.knex.raw('SELECT id FROM Events WHERE typeId = 1 AND value = ' + set.value + ' AND start >= DATE_SUB(\'' + start + '\', INTERVAL 1 MINUTE) AND start <= DATE_ADD(\'' + start + '\', INTERVAL 1 MINUTE)')

        if (alreadyExists.length) continue;

        await db.Event.create({
            typeId: 1,
            start: start,
            end: start,
            origin: 'DEXCOM_SYNC',
            value: set.value,
            meta: set.meta,
        });
    }
}

export default command;