import Notification from '../schemas/notification';

class NotificationController {
  async index(req, res) {
    const CheckIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }});

      if (!CheckIsProvider) {
        return res.status(401)
        .json({ error: 'Only provider can load notifications' });
      }

      const notifications = await Notification.find({
        user: req.userId,
      }).sort({ createdAt: 'desc'}).limit(20);


    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
      );


    return res.json(notification);
  }

}

export default new NotificationController();
