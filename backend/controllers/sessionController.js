const Session = require('../models/Session');
const User = require('../models/User');

// Learner requests/creates a session (booking)
exports.createSession = async (req, res) => {
  try {
    const { title, description, mentorId, scheduledAt, durationMinutes } = req.body;
    if (!title || !mentorId || !scheduledAt) {
      return res.status(400).json({ message: 'title, mentorId and scheduledAt required' });
    }

    // Ensure mentor exists and is a mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(400).json({ message: 'Invalid mentor' });
    }

    const session = await Session.create({
      title,
      description,
      mentor: mentorId,
      learner: req.user._id,
      scheduledAt,
      durationMinutes,
      status: 'requested'
    });

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mentor approves / rejects session
exports.updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Only mentor assigned or admin can change status
    if (req.user.role !== 'admin' && session.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!['approved','rejected','completed','cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    session.status = status;
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sessions filtered by role
exports.getSessions = async (req, res) => {
  try {
    const { role } = req.user;
    let sessions;
    if (role === 'mentor') {
      sessions = await Session.find({ mentor: req.user._id }).populate('learner mentor', 'name email role');
    } else if (role === 'learner') {
      sessions = await Session.find({ learner: req.user._id }).populate('learner mentor', 'name email role');
    } else {
      sessions = await Session.find().populate('learner mentor', 'name email role');
    }
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single session
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('learner mentor', 'name email role');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
