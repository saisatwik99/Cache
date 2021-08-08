import { Router } from 'express';
import goalsController from '../controllers/goals.js';
import utils from '../utils/utils.js';
import goalValidate from '../validations/goal.js';

const router = Router();

router.use(utils.verifyAuthToken);
router.post('/addGoal',goalValidate,goalsController.addGoal);
router.post('/updateGoal',goalsController.updateGoal);



export default router;
