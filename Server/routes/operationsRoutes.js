const express = require('express');
const router = express.Router();
const {
  getHousekeepingTasks,
  createHousekeepingTask,
  completeCleaningTask,
  getMaintenanceIssues,
  reportMaintenanceIssue,
  resolveMaintenanceIssue
} = require('../controllers/operationsController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Housekeeping
router.get('/housekeeping', getHousekeepingTasks);
router.post('/housekeeping', createHousekeepingTask);
router.patch('/housekeeping/:id/complete', completeCleaningTask);

// Maintenance
router.get('/maintenance', getMaintenanceIssues);
router.post('/maintenance', reportMaintenanceIssue);
router.patch('/maintenance/:id/resolve', resolveMaintenanceIssue);

module.exports = router;