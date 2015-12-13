import request           from 'superagent';
import urlJoin           from 'url-join';
import * as constants    from '../constants';

const handleResponse = (resolve, reject) => (err, res) => {
    if (err) {
        if (res.body && res.body.errors) {
            const msg = res.body.errors.map(
                ({code, message}) => `[${code} - ${message}]`
            ).join(' ');
            reject (new Error(msg));
        } else {
            reject(err);
        }
    } else {
        resolve(res.body);
    }
};

export default class StuartDeliveryClient {

    constructor () {
        this._clientId = 3;
    }

    processRequest (method, endpoint, payload) {
        return new Promise((resolve, reject) => {
            request[method.toLowerCase()](urlJoin(constants.endpoint, endpoint))
                .send(payload)
                .end(handleResponse(resolve, reject))
            ;
        });
    }

    getPlace (placeType, {
        city,
        addressLatitude,
        addressLongitude,
        addressStreet,
        addressPostcode,
        comment
    }) {
        const addressCityId = constants.cityId[city];

        if (undefined === addressCityId) {
            return Promise.reject(new Error(`Unknown city "${city}".`));
        }

        const requestData = {
            clientId: this._clientId,
            addressCityId,
            placeTypeId: constants.placeTypeId[placeType],
            comment
        };

        if (addressStreet) {
            requestData.addressStreet   = addressStreet;
            requestData.addressPostcode = addressPostcode;
        } else {
            requestData.addressLatitude  = addressLatitude;
            requestData.addressLongitude = addressLongitude;
        }

        return this.processRequest('POST', '/v1/places', requestData);
    }

    getOriginPlace (settings) {
        return this.getPlace('originPlace', settings);
    }

    getDestinationPlace (settings) {
        return this.getPlace('destinationPlace', settings);
    }
}
