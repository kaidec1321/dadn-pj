var mqtt = require('mqtt');

var publisher = mqtt.connect('tcp://13.76.250.158:1883', {username: 'BKvm2', password: 'Hcmut_CSE_2020'});

var message = JSON.stringify([{device_id: 'TempHumi', values: ['32', '18']}]);
publisher.publish('Topic/TempHumi', message);