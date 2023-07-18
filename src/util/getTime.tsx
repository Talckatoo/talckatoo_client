import moment from 'moment';

export const getTime = (time) => {
    const utcTime = time
    const estTime = moment(utcTime).utcOffset(-4).format('hh:mm A');
    return estTime
}


