import moment from 'moment';

export const datesToDue = (date: string) => {
  const eventDate = moment(date);
  const today = moment().utc();
  return eventDate.diff(today, 'days');
};
