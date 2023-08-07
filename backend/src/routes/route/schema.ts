const joi = require('joi');
const j2s = require('joi-to-swagger')

// Joi
// TO-DO Add validation
export const joiSchema = joi.object().keys({
    points: joi.array().items(joi.string()), // TODO
    summary_distance: joi.string(),
    ts_number: joi.string(),
    special_marks: joi.string(),
    driver_name: joi.string()
})
// end of Joi

export const schema = j2s(joiSchema).swagger;