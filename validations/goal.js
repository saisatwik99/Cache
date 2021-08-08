import Joi from '@hapi/joi';

const goalSchema = (goal) =>{
    try {
        console.log(goal);
        const JoiSchema= Joi.object({
            name: Joi.string().required(),
            description: Joi.string().min(1).max(250).optional(),
            timePeriod: Joi.number().required().min(1).max(100),
            targetAmount: Joi.number().required()
        });
        return JoiSchema.validate(goal);
        
    } catch (error) {
        console.log(error);
    }


}

export default goalSchema;
