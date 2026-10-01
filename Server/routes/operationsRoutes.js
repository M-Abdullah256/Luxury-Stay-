const express = require('express');
const router = express.Router();
const {
  getHousekeepingTasks,
  createHousekeepingTask,
  completeCleaningTask,
  quickCleanRoom,
  getMaintenanceIssues,
  reportMaintenanceIssue,
  resolveMaintenanceIssue
} = require('../controllers/operationsController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Housekeeping Routes
router.get('/housekeeping', getHousekeepingTasks);
router.post('/housekeeping', createHousekeepingTask);
router.patch('/housekeeping/:id/complete', completeCleaningTask);
router.patch('/housekeeping/quick-clean/:roomId', quickCleanRoom); // <-- Naya Guaranteed Logger Route

// Maintenance Routes
router.get('/maintenance', getMaintenanceIssues);
router.post('/maintenance', reportMaintenanceIssue);
router.patch('/maintenance/:id/resolve', resolveMaintenanceIssue);

module.exports = router;