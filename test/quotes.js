/* global describe, it, before */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.should();
chai.use(chaiAsPromised);


import Client from '../index';

const client = new Client();

describe('The quotes API', function () {
    let originPlace, destinationPlace;

    before(function getOriginAndDestinationPlaces () {

        // FIXME: seems that Stuart gives incorrect latitude / longitudes
        // when searching places by address, so we use latitude / longitude
        // directly. Need to tell Stuart about it.

        return Promise.all([
            client.getOriginPlace({
                city: 'Paris',
                addressLatitude: 48.8623397,
                addressLongitude: 2.3775617
            }),
            client.getDestinationPlace({
                city: 'Paris',
                addressLatitude: 48.8762464,
                addressLongitude: 2.3249675
            })
        ]).then(
            places => [originPlace, destinationPlace] = places
        );
    });

    it('should create multiple job quotes (with all transportation types)', function () {
        return client.createMultipleJobQuotes({
            originPlaceId: originPlace.id,
            destinationPlaceId: destinationPlace.id
        }).then(quotes => {
            chai.expect(quotes.bike.errors).to.be.undefined;
            quotes.bike.finalTotalAmount.should.be.greaterThan(0);
        });
    });
});
