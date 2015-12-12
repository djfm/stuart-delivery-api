/* global describe, it */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.should();
chai.use(chaiAsPromised);


import Client from '../index';

const client = new Client();

describe('The places API', function () {
    it('getOriginPlace should return a promise for an origin place - search by address', function () {
        return client.getOriginPlace({
            city: 'Paris',
            addressPostcode: 75009,
            addressStreet: "12 Rue d'Amsterdam"
        }).then(resp => {
            resp.address.should.include({
                latitude: 48.8762464,
                longitude: 2.3271562
            });
        });
    });

    it('getOriginPlace should return a promise for an origin place - search by latitude and longitude', function () {
        return client.getOriginPlace({
            city: 'Paris',
            addressLatitude: 48.8762464,
            addressLongitude: 2.3271562
        }).then(resp => {
            resp.address.street.should.contain('Amsterdam');
        });
    });

    it('getDestinationPlace should return a promise for an origin place', function () {
        return client.getDestinationPlace({
            city: 'Paris',
            addressPostcode: 75011,
            addressStreet: "56 rue Saint-Maur"
        });
    });
});
