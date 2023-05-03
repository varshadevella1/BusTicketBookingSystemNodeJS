const { createLogger,transports,format } = require('winston')

//logging function

const usersLogger = createLogger({
    transports:[
        new transports.File({
            filename:'users.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename:'users-error.log',
            level:'error',
            format:format.combine(format.timestamp(),format.json())
        })
    ]
})

const BusesLogger = createLogger({
    transports:[
        new transports.File({
            filename:'buses.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename:'buses-error.log',
            level:'error',
            format:format.combine(format.timestamp(),format.json())
        })
    ]
})

const BookingLogger = createLogger({
    transports:[
        new transports.File({
            filename:'booking.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename:'booking-error.log',
            level:'error',
            format:format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports = {usersLogger,BusesLogger,BookingLogger}