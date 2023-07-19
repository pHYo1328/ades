import React from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';

const UserTimezoneDate = ({ date }) => {
  const getUserTimeZone = () => {
    if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
      // Fallback to a default time zone if Intl API is not supported
      console.log('Intl API is not supported');
      return 'UTC';
    }
  };

  const userTimeZone = getUserTimeZone();

  return (
    <p>{format(utcToZonedTime(date, userTimeZone), 'MMM d, yyyy h:mma')}</p>
  );
};

export default UserTimezoneDate;
