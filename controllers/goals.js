import responder from '../utils/responseHandler.js';
import goalService from '../services/goal.js';
import goalUtils from '../utils/goal.js';
import goalSchema from '../validations/goal.js';
import validateError from '../utils/errors/validationError.js';

const addGoal = async (req, res, next) => {
    try {
        const {
            body : { targetAmount , name , description ,timePeriod} 
        }= req;

        const user = req.user;
        let payments = [];

        await goalUtils.getTotalNav();

        const currDate = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + timePeriod);

        const goal = {
            targetAmount,
            name,
            description,
            userId:user._id,
            totalNav:0,
            payments: payments,
            startDate: currDate, 
            endDate: end,
        }
        await goalService.addGoal(goal)

        return responder(res)(null, {goal})

    }
    catch (err) {
       return next(err);
    }
}
const updateGoal = async (req, res, next) => {
    try {
        const {
            body : { goalId,targetAmount , name , description ,timePeriod} 
        }= req;

        const user = req.user
        const goal = {
            goalId,
            targetAmount,
            name,
            description,
            timePeriod,
            userId:user._id
        }
        await goalService.updateGoal(goal)

        return responder(res)(null, {goal:goal})
    }
    catch (err) {
       return next(err);
    }
}

export default {
    addGoal,
    updateGoal
}
