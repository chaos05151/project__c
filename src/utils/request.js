import axios from 'axios';

//流量商业化C端接口
const service = axios.create({
    // baseURL: process.env.NODE_ENV == 'production' ? "https://alcyoneus-api.relationshipapp.com/" : "https://alcyoneus.guanxiapp.cn/",
    // baseURL: "http://192.168.30.227:3000/",
    // baseURL: "https://flora-api.relationshipapp.com/",//生产环境
    // https://alcyoneus.guanxiapp.cn/
    timeout: 50000000000000
});

service.interceptors.request.use(
    config => {
        config.headers['x-access-token'] = localStorage.getItem('token')
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

//流量商业化B端接口
const serviceb = axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? "https://flora-api.relationshipapp.com/" : "https://flora.guanxiapp.cn/",
    // baseURL: "http://46f32bf0.cpolar.top/",
    // baseURL: "https://flora-api.relationshipapp.com/",//生产环境
    timeout: 50000000000000
});

serviceb.interceptors.request.use(
    config => {
        config.headers['x-access-token'] = localStorage.getItem('token')
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

serviceb.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export {service,serviceb};
