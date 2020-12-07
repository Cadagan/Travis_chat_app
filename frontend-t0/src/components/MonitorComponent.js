import React from "react";
require('dotenv').config();
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

export default class MonitorComponent extends React.Component {

    constructor(props) {
        super(props);
        const AWS_REGION = process.env.AWS_REGION? process.env.AWS_REGION : "us-east-2";
        console.log("Setting region to: us-east-2", AWS_REGION);
        this.state = {
            image: ""
        }
        this.loadImage = this.loadImage.bind(this);
        this.awsCallback = this.awsCallback.bind(this);
        this.updateTimer = setInterval(() => this.loadImage(), 30000);
    }

    componentDidMount() {
        this.loadImage();
    }

    loadImage() {
        console.log(this.state);
        var params = {
            MetricWidget: '{\n' +
                '      "width":1920,\n' +
                '      "height":900,\n' +
                '      "metrics":[\n' +
                '         [\n' +
                '            "AWS/EC2",\n' +
                '            "CPUUtilization",\n' +
                '            "InstanceId",\n' +
                '            "i-0abe82e10079e1ad0",\n' +
                '            {\n' +
                '               "stat":"Average"\n' +
                '            }\n' +
                '         ],\n' +
                '         [\n' +
                '            "AWS/EC2",\n' +
                '            "CPUUtilization",\n' +
                '            "InstanceId",\n' +
                '            "i-0acaab7c13da4ff2f",\n' +
                '            {\n' +
                '               "stat":"Average"\n' +
                '            }\n' +
                '         ]\n' +
                '      ],\n' +
                '      "period":300,\n' +
                '      "start":"-P2D",\n' +
                '      "end":"PT0H",\n' +
                '      "stacked":false,\n' +
                '      "yAxis":{\n' +
                '         "left":{\n' +
                '            "min":0.1,\n' +
                '            "max":1\n' +
                '         },\n' +
                '         "right":{\n' +
                '            "min":0\n' +
                '         }\n' +
                '      },\n' +
                '      "title":"CPU for Two Instances",\n' +
                '      "annotations":{\n' +
                '         "horizontal":[\n' +
                '            {\n' +
                '               "color":"#ff6961",\n' +
                '               "label":"Trouble threshold start",\n' +
                '               "fill":"above",\n' +
                '               "value":0.8\n' +
                '            }\n' +
                '         ]\n' +
                '      }\n' +
                '   }',
        };
        var accessKeyId = process.env.AWS_ACCESS_KEY_ID || "AKIAURVOISK4MS3CSENP";
        var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "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";
        console.log(accessKeyId);
        this.cloudwatch = new AWS.CloudWatch({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
        this.cloudwatch.getMetricWidgetImage(params, this.awsCallback);
    }
    componentWillUnmount() {
        clearInterval(this.updateTimer);
    }

    awsCallback(err, data){
            if (err) console.log(err, err.stack); // an error occurred
            else {
                var base64Data = btoa(String.fromCharCode.apply(null, data.MetricWidgetImage));
                console.log("Image is not undefined now!")
                this.setState({image: 'data:image/png;base64,' + base64Data });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Updated");
    }

    render(){
        return <div>
                <img src={this.state.image}  alt={"Aqui cargará el gráfico."}/>
            </div>
    }
}

