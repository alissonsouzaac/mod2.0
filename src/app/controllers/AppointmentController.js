import Appointment from '../models/Appointment';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';
import Notification from '../schemas/notification';
import { UniqueConstraintError } from 'sequelize';
import { date } from 'yup/lib/locale';

class AppointmentController {
  async index(req, res) {

    const { page = 1 } = req.query;


    const appointments = await Appointment.findAll({
      where: {user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 15,
      offset:(page - 1) * 15,
      attributes: ['id','date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model:File,
              as: 'avatar',
              attributes: ['id', 'path', 'url' ]
            }
          ]
        },
      ]
    });

    return res.json(appointments)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true
      }});

      if (!isProvider) {
        return res.status(401)
        .json({ error: 'you can only create appointment with providers' });
      }

      //check for past date
      const hourStart = startOfHour(parseISO(date));

      if ( isBefore(hourStart, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted'});
      }

      //check date availability

      const checkAvailability = await Appointment.findOne({ where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    })

      if (checkAvailability) {
        return res.status(400).json({ error: 'Appoitment date is  not available'})
      }

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id: req.body,
        date,
      });

      //notificação prestador de serviço

      const user = await UniqueConstraintError.findByPk(req.userId);
      const formattedDate = format(
        hourStart,
        "'dia' dd 'de' MMMM', ás' H:mm'h'",
        { locale: pt }
        )

      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${formattedDate} `,
        user: provider_id,
      });


    return res.json();
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);

    if(appointment.user_id != req.userId) {
      return res.status(401).json({
        error: "you don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: 'you can only cancel appointment 2hours in advance'});
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
