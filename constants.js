import _ from 'underscore';

export const endpoint   = "https://sandbox-api.stuart.fr";

export const cityId     = {
    Paris: 1,
    London: 2,
    Bercelona: 3
};

export const placeTypeId = {
    originPlace: 2,
    destinationPlace: 3
};

export const transportTypeId = {
    walk: 1,
    bike: 2,
    motorbike: 3,
    car: 4,
    van: 5
};

export const transportTypeName = _.invert(transportTypeId);
