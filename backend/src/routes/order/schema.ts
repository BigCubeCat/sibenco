const joi = require('joi');
const j2s = require('joi-to-swagger')

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
    typeOfTransportation: joi.string(),
    date: joi.string(),
    loadigAdress: joi.string(),
    unloadingAdress: joi.string(),
    cargoName: joi.string(),
    distance: joi.string(),
    specialMarks: joi.string(),
    client: joi.string()
})
// end of Joi

export const schema = j2s(joiSchema).swagger;
