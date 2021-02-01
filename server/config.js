var config = {};

config.port = 8060;

config.cluster = {};
config.cluster.name = 'minikube';
config.cluster.server = 'https://192.168.99.100:8443';
config.cluster.certFilePath = '/home/achoudhuri/.minikube/ca.crt';

config.user = {};
config.user.name = "";
config.user.password = "";

config.context = {};
config.context.name = "";
config.context.user = "";
config.context.cluster = "";

module.exports = config;