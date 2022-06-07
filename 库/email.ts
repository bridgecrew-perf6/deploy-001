//https://dm.console.aliyun.com/
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    "host": "smtpdm.aliyun.com",
    "port": 465,
    "secureConnection": true, // use SSL, the port is 465
    "auth": {
        "user": 'notification@huati365.com', // user name
        "pass": 'C59XX9012saYTUE'         // password
    }
});

export function sendMail(subject:string,htmlCode:string,from:string = '天天话题消息通知') {
    var mailOptions = {
        from: `${from}<notification@huati365.com>`, // sender address mailfrom must be same with the user
        to: '569576618@qq.com', //, xx@xx.com
        //cc:'haha<xxx@xxx.com>', //wenyachang@qq.com
        subject: subject,
        html: htmlCode
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error:any, info:any) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


