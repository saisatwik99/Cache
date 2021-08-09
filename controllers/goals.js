import responder from '../utils/responseHandler.js';
import goalService from '../services/goal.js';
import goalUtils from '../utils/goal.js';
import goalDb from '../db/goals.js';
import moment from 'moment';
import { stringify } from 'uuid';

const addGoal = async (req, res, next) => {
    try {
        const {name , targetAmount ,description , timePeriod} = req.body;
        const user = req.user;
        let payments = [];

        

        const currDate = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + timePeriod);

        const goal = {
            targetAmount,
            name,
            description,
            userId:user._id,
            totalNav:0,
            timePeriod,
            payments: payments,
            startDate: currDate, 
            endDate: end,
        }
        await goalService.addGoal(goal)

        res.redirect('/api/goals/getAllGoals');

    }
    catch (err) {
       return next(err);
    }
}

const getCreateGoal = (req, res) => {
    res.render("createGoal");
}

const getUpdateGoal = async (req, res) => {
    const { goalId } = req.params;
    const goalDetails = await goalDb.findGoal(goalId);
    
    res.render("modifyGoal", { goalDetails });
}

const updateGoal = async (req, res, next) => {
    try {
        const {
            body : { targetAmount , name , description ,timePeriod} 
        }= req;
        const { goalId } = req.params;
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

        res.redirect("/api/goals/getAllGoals");
    }
    catch (err) {
       return next(err);
    }
}

const getAllGoals = async (req, res) => {
    const user = req.user;
    const goals = await goalService.getAllGoals(user);
    const modifiedGoals = await Promise.all(goals.map( async (goal) => {
        const investedAmount = await goalUtils.getTotalNavValue(goal.totalNav);
        
        var progressBar = Math.floor((investedAmount*100)/goal.targetAmount).toString();
        return { 
            goalId: goal._id,
            name: goal.name,
            description: goal.description,
            startDate: moment(goal.startDate).format("D MMM, YY"),
            endDate: moment(goal.endDate).format("D MMM, YY"),
            budget: goal.targetAmount,
            saved: investedAmount.toFixed(2),
            yetToSave: goal.targetAmount - investedAmount,
            progressBar: "width "+ progressBar + ";",
            progress: Math.floor((investedAmount*100)/goal.targetAmount)
        }
    }));
    var isGreater = 0;
    if(modifiedGoals.length > 1)
        isGreater = 1;
    var isOdd = modifiedGoals.length % 2;
    var lastGoal = {};
    if(isOdd){
        lastGoal = modifiedGoals[modifiedGoals.length - 1];
    }
    var halfLen = modifiedGoals.length; 
    if(modifiedGoals.length % 2 != 0 )
    halfLen = modifiedGoals.length - 1;
    console.log({modifiedGoals, isOdd, lastGoal, isGreater, halfLen});
    res.render("goalHome", {modifiedGoals, isOdd, lastGoal, isGreater, halfLen});
};

const getDetails = async (req, res) => {
    const { goalId } = req.params;
    const goalDetails = await goalDb.findGoal(goalId);
    const investedAmount = await goalUtils.getTotalNavValue(goalDetails.totalNav);
    const goal = {
        id: goalId,
        name: goalDetails.name,
        desc: goalDetails.description,
        startDate: moment(goalDetails.startDate).format("D MMM, YY"),
        endDate: moment(goalDetails.endDate).format("D MMM, YY"),
        budget: goalDetails.targetAmount,
        saved: investedAmount.toFixed(2),
        yetToSave: goalDetails.targetAmount - investedAmount,
        noTrans: goalDetails.payments.length,
        payments: goalDetails.payments.reverse(),
        progress: Math.floor((investedAmount*100)/goalDetails.targetAmount)
    };
    res.render("goalDetails", {goal});
}

const payGoal = (req, res) => {
    const { goalId } = req.params;
    res.render("paymentGoal", {goalId});
}

const payGoalPost = async (req, res) => {
    const { goalId } = req.params;
    const { amount, paymentDetails } = req.body;
    const goalDetails = await goalDb.findGoal(goalId);
    console.log(goalDetails);
    const navValue = await goalUtils.getNavValue();
    var navAlloted = amount/navValue;
    goalDetails.payments.push({
        paymentDate: moment(new Date()).format("D MMM, YYYY"),
        paymentAmount: amount,
        status: "Credit",
        paymentDetails: "Paid from "+paymentDetails,
        paymentId: Math.floor(Math.random()*10000000000000),
        mfDetails: { 
            navAlloted, 
            unitPrice: navValue

        }
    });
    goalDetails.totalNav += navAlloted;
    await goalDb.updateCompleteGoal(goalDetails);
    res.redirect("/api/goals/getAllGoals");
}

const withdrawGoal = (req, res) => {
    const { goalId } = req.params;
    res.render("withdrawGoal", {goalId});
}

const withdrawGoalPost = async (req, res) => {
    const { goalId } = req.params;
    const { amount, paymentDetails } = req.body;
    const goalDetails = await goalDb.findGoal(goalId);
    const navValue = await goalUtils.getNavValue();
    var navSold = amount/navValue;
    
    if(goalDetails.totalNav*navValue - amount < 0){
        res.redirect("/api/goals/withdrawGoal/" + ObjectId(goalId).toString());
    }
    
    goalDetails.payments.push({
        paymentDate: moment(new Date()).format("D MMM, YYYY"),
        paymentAmount: amount,
        status: "Debit",
        paymentDetails: "Paid to "+paymentDetails,
        paymentId: Math.floor(Math.random()*10000000000000),
        mfDetails: { 
            navSold, 
            unitPrice: navValue

        }
    });
    goalDetails.totalNav -= navSold;
    await goalDb.updateCompleteGoal(goalDetails);
    res.redirect("/api/goals/getAllGoals");
}

const deleteGoal = async (req, res) => {
    const { goalId } = req.params;
    const goalDetails = await goalDb.findGoal(goalId);
    const navValue = await goalUtils.getNavValue();
    res.render("deleteGoal", {goalId, totalAmount: navValue * goalDetails.totalNav});
}

const deleteGoalPost = async (req, res) => {
    const { goalId } = req.params;
    const { paymentDetails } = req.body;
    await goalDb.deleteGoal(goalId);
    
    res.redirect("/api/goals/getAllGoals");
}


export default {
    addGoal,
    getCreateGoal,
    updateGoal,
    getAllGoals,
    getUpdateGoal,
    getDetails,
    payGoal,
    payGoalPost,
    withdrawGoal,
    withdrawGoalPost,
    deleteGoal,
    deleteGoalPost
}
