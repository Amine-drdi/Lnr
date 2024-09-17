// controllers/notificationController.js
const Notification = require('../models/Notification');

const createNotification = async (contratId, userId, modificationType, changes) => {
  try {
    const notification = new Notification({
      contratId,
      userId,
      modificationType,
      changes
    });
    await notification.save();
  } catch (error) {
    console.error('Erreur lors de la création de la notification', error);
  }
};

module.exports = { createNotification };
