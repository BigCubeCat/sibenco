import joi from 'joi';
import j2s from 'joi-to-swagger';

// Joi
// TO-DO Add validation

export const joiSchema = joi.object().keys({
  date: {
    createdAt: joi.string(), // Создается автоматически
    loadingTime: joi.number(), // Дата исполнения
    unloadingTime: joi.number(),
    loadingWaiting: joi.number(),
    unloadingWaiting: joi.number(),
  },
  route: {
    loadingAddress: {
      address: joi.string(),
      latitude: joi.string(),
      longitude: joi.string(),
      word: joi.string(),
    },
    unloadingAddress: {
      address: joi.string(),
      latitude: joi.string(),
      longitude: joi.string(),
      word: joi.string(),
    },
    distance: joi.string(), // Считаем на бэке
  },
  order: {
    typeOfTransportation: joi.string(),
    devisionName: joi.string(),
    client: joi.string(),
    passengers: joi.array().items({fullName: joi.string(), phoneNumber: joi.string()})
  },
});
// end of Joi

export const schema = j2s(joiSchema).swagger;
