import goalsDb from '../db/goals.js'

const addGoal = async (goal) => {
    await goalsDb.addGoal(goal);
    return goal;
}

const updateGoal = (goal) => {
   return goalsDb.updateGoal(goal);
}

export default {
    addGoal,
    updateGoal
}
