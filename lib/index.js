import request           from 'superagent';
import urlJoin           from 'url-join';
import _                 from 'underscore';
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

    processRequest (method, endpoint, originalPayload) {
        // create a new payload object to make sure we don't leak the clientId
        const payload = Object.assign({}, originalPayload, {clientId: this._clientId});

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

    createMultipleJobQuotes ({origin, destination, originPlaceId, destinationPlaceId}) {
        const payload = {};

        if (originPlaceId) {
            payload.originPlaceId = originPlaceId;
        } else {
            payload.origin = origin;
        }

        if (destinationPlaceId) {
            payload.destinationPlaceId = destinationPlaceId;
        } else {
            payload.destination = destination;
        }

        payload.transportTypeIds = _.values(constants.transportTypeId).join(',');

        return this.processRequest('POST', '/v1/jobs/quotes/types', payload).then(
            quotes => _.object(_.map(
                quotes,
                (quote, transportTypeId) =>
                    [constants.transportTypeName[transportTypeId], quote])
            )
        );
    }
}
