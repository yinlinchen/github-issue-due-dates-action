import moment from 'moment';

export const datesToDue = (date: string) => {
  const eventDate = moment(date).local();
  const today = moment().local();

  const diffMinutes = eventDate.diff(today, 'minutes')

  if (diffMinutes > 10080)
    return 8
  else if (diffMinutes <= 10080 && diffMinutes > 4320)
    return 7
  else if (diffMinutes <= 4320 && diffMinutes > 1440)
    return 3
  else if (diffMinutes <= 1440 && diffMinutes > 0)
    return 1
  else
    return -1

};