import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';

const goalsCollectionRef = () => db.get().collection('goals')

const addGoal = async (goal) => {
    if(goal.targetamount === '' || goal.name === '' || goal.description === '' ) {
        return ConflictError("Fields Cannot be Empty");
    }
    return goalsCollectionRef().insertOne(goal);
}

const updateGoal = async (goal) => {
    if(goal.targetamount === '' && goal.name === '' && goal.description === '') {
        return ConflictError("Update Failed")
    }
    return goalsCollectionRef().findOneAndUpdate({_id: goal._id},{ $set : {targetamount: goal.targetamount, description: goal.description,name: goal.name}})
}

export default {
    addGoal,
    updateGoal
}