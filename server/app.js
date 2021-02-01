const express = require("express");
const k8s = require('@kubernetes/client-node');
const cors = require('cors')
const config = require("./config");

const app = express();
app.use(cors())

const kc = new k8s.KubeConfig();

kc.loadFromDefault();

const cluster = {
    name: config.cluster.name,
    server: config.cluster.server,
    caFile: config.cluster.certFilePath,
};

kc.clusters = [cluster]

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.get("/pods", (req, response) => {
    k8sApi.listPodForAllNamespaces().then((res) => {
        const resBody = JSON.parse(JSON.stringify(res.body));
        let resArr = [];

        if (resBody.items && resBody.items.length) {
            resBody.items.forEach((item) => {
                let resObj = {};

                resObj.name = item && item.metadata && item.metadata.name ? item.metadata.name : "";
                resObj.nameSpace = item && item.metadata && item.metadata.namespace ? item.metadata.namespace : "";
                resObj.status = item && item.status && item.status.phase ? item.status.phase : "";
                resObj.age = item && item.metadata && item.metadata.creationTimestamp ? item.metadata.creationTimestamp: "";
                resArr.push(resObj);
            });
        }
        
        response.json(resArr)
    });
})

app.listen(config.port, () => console.log("app is running"))