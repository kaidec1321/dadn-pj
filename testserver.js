var mqtt = require('mqtt');

var subcriber = mqtt.connect('http://localhost:1883');

subcriber.subscribe('Topic/Speaker');

subcriber.on('message', function(topic, message) {
    var status = JSON.parse(message.toString());
    console.log(status);
});

var publisher = mqtt.connect('http://localhost:1883');

var myInterval = setInterval(myInterval, 10000);
function myInterval() {
    var message1 = JSON.stringify([{device_id: 'Speaker', values: ['1', '25']}]);
    var message2 = JSON.stringify([{device_id: 'TempHumi', values: ['30', '60']}]);
    publisher.publish('Topic/Speaker', message1);
    publisher.publish('Topic/TempHumi', message2)
}


