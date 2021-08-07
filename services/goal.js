import goalsDb from '../db/goals.js'

const addGoal = async (goal) => {
    await goalsDb.addGoal(goal);
    return goal;
}

const updateGoal = async (goal) => {
    await goalsDb.updateGoal(goal);
    return goal;
}

export default {
    addGoal,
    updateGoal
}