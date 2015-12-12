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

export default class StuardDeliveryClient {

    constructor () {
        this._clientId = 3;
    }

    endPoint (...path) {
        return urlJoin(constants.endpoint, ...path);
    }

    getPlace (placeType, {
        city,
        addressLatitude,
        addressLongitude,
        addressStreet,
        addressPostcode,
        comment
    }) {
        return new Promise((resolve, reject) => {
            const addressCityId = constants.cityId[city];

            if (undefined === addressCityId) {
                reject(new Error(`Unknown city "${city}".`));
                return;
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

            request
                .post(this.endPoint('/v1/places'))
                .send(requestData)
                .end(handleResponse(resolve, reject))
            ;

        });
    }

    getOriginPlace (settings) {
        return this.getPlace('originPlace', settings);
    }

    getDestinationPlace (settings) {
        return this.getPlace('destinationPlace', settings);
    }
}
