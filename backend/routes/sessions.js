const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createSession,
  updateSessionStatus,
  getSessions,
  getSession
} = require('../controllers/sessionController');

// GET /api/sessions - get sessions for the logged user (role-based)
router.get('/', auth(), getSessions);

// GET /api/sessions/:id
router.get('/:id', auth(), getSession);

// POST /api/sessions - create booking (learner)
router.post('/', auth('learner'), createSession);

// PATCH /api/sessions/:id/status - change status (mentor/admin)
router.patch('/:id/status', auth(['mentor','admin']), updateSessionStatus);

module.exports = router;
