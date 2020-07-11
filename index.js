var mqtt = require('mqtt');
var express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);
app.use(express.static('dadn'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/pumping.html'))
});

router.get('/resources/css/pump.css', function(req, res) {
    res.sendFile(path.join(__dirname+'/resources/css/pump.css'))
});

router.get('/resources/css/successful.css', function(req, res) {
    res.sendFile(path.join(__dirname+'/resources/css/successful.css'))
});

router.get('/resources/image/pump.png', function(req, res) {
    res.sendFile(path.join(__dirname+'/resources/image/pump.png'))
});

router.get('/resources/image/user.png', function(req, res) {
    res.sendFile(path.join(__dirname+'/resources/image/user.png'))
});

router.get('/resources/image/tick.png', function(req, res) {
    res.sendFile(path.join(__dirname+'/resources/image/tick.png'))
});

app.post('/submit-form', function(req, res) {
    console.log(req.body);
    if (req.body.start == "BƠM NƯỚC NGAY") {
        // var message = JSON.stringify([{device_id:"Speaker",values:["1", "200"]}]);
        var message = JSON.stringify([{device_id:"Speaker",values:["1", req.body.minutes]}]);
        var topic = "Topic/Speaker";
        iot2.publish(topic, message);
        console.log("Message: " + message + " sent to " + topic);
    }
    if (req.body.start == "DỪNG BƠM") {
        var message = JSON.stringify([{device_id:"Speaker", values:["0","0"]}]);
        var topic = "Topic/Speaker";
        iot2.publish(topic, message);
        console.log("Message: " + message + " sent to " + topic);
    }
    res.sendFile(path.join(__dirname+'/successful.html'));
    
    // var iot = mqttClient.connect('tcp://13.76.250.158:1883', {username: 'BKvm2', password: 'Hcmut_CSE_2020'});
    // iot.subscribe("Topic/Speaker");
    // iot.on('message', function(topic, message) {
    //     status = JSON.parse(message.toString())[0];
    //     // console.log(status);
    //     client.emit('message', status.values);
    // })
    // iot.end();
});

app.listen(3000);
console.log('Running at port 3000');

// var iot = mqtt.connect('tcp://13.76.250.158:1883', {username: 'BKvm2', password: 'Hcmut_CSE_2020'});
var iot = mqtt.connect('http://52.187.125.59', {username: 'BKvm', password: 'Hcmut_CSE_2020'});


iot.subscribe('Topic/Speaker');

iot.on('message', function(topic, message) {
    var status = JSON.parse(message.toString());
    console.log(status);
});

// var iot2 = mqtt.connect('tcp://13.76.250.158:1883', {username: 'BKvm2', password: 'Hcmut_CSE_2020'});
var iot2 = mqtt.connect('http://52.187.125.59', {username: 'BKvm', password: 'Hcmut_CSE_2020'});

// var tempHumiListener = mqtt.connect('tcp://13.76.250.158:1883', {username: 'BKvm2', password: 'Hcmut_CSE_2020'});
var tempHumiListener = mqtt.connect('http://52.187.125.59', {username: 'BKvm', password: 'Hcmut_CSE_2020'});


tempHumiListener.subscribe('Topic/TempHumi');
tempHumiListener.on('message', function(topic, message) {
    var status = JSON.parse(message.toString());
    console.log(status);
    var temp = Number(status[0].values[0]);
    var humi = Number(status[0].values[1]); 
    if (humi < 20 && temp > 30) {
        console.log('Temperature: ' + status[0].values[0] + ' - Humidity: ' + status[0].values[1] + ' - AUTO START MOTOR');
        var message = JSON.stringify([{device_id: 'Speaker', values: ['1', '150']}]);
        iot2.publish('Topic/Speaker', message);
        console.log("Message: " + message + " auto sent to Topic/Speaker");
    }
});

// var myInterval = setInterval(myTimer, 10000);
// function myTimer() {
//     var message = JSON.stringify([{device_id: 'TempHumi', values: ['32', '15']}]);
//     iot2.publish('Topic/TempHumi', message);
// }