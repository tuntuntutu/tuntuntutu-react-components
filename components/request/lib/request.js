import axios from 'axios';
import qs from 'qs';
import React from 'react';
import { message, Modal } from 'antd';
import { render, unmountComponentAtNode } from 'react-dom';
import juicer from './juicer';
import '../request.less';


const { FormData, FileList } = window;
let reloginModal;
let dom = null;
const defaultOption = {
  method: 'get',
  dataType: 'json',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  withCredentials: false,
  timeout: 10000,
  code: 200, // 数据返回code默认为200
  rules: {
    noEmoji: true, // 默认过滤表情
    noEmptyString: false,
  },
  loading: true,
  errorToast: true, // 异常业务code时，弹出错误提示，默认弹出
  intactData: false, // 完整数据，默认false，默认只返回业务数据的data部分
  messageKey: 'message', // 有些服务端为了兼容新老系统，不会采用message弹出错误，增加message重定义入口
  authUrlKey: 'authUrl', // 有些服务端为了兼容新老系统，不会采用message弹出错误，增加message重定义入口
};


// 全局遮罩
const showLoading = (loading) => {
  if (loading && !dom) {
    dom = document.createElement('div');
    dom.setAttribute('class', 'window-loading-wrap');
    document.body.appendChild(dom);
    render(<div className="window-loading">
      <div />
      <div />
      <div />
      <div />
    </div>, dom);
  }
};

// 卸载遮罩
const hideLoading = () => {
  if (dom) {
    unmountComponentAtNode(dom);
    document.body.removeChild(dom);
    dom = null;
  }
};

const jsonToFormData = (data) => {
  if (data instanceof FormData) {
    return data;
  }
  if (typeof data === 'object') {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof FileList) {
        Array.from(data[key]).forEach((file) => {
          formData.append(key, file);
        });
      } else if (data[key] instanceof Array) {
        data[key].forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    return formData;
  }

  return new FormData();
};

const formatData = (options) => {
  const {
    dataType, data, method, headers, rules,
  } = options;
  let contentType = '';
  let newData = data;

  switch (dataType.toLowerCase()) {
    case 'json':
      contentType = 'application/json'; // 数据格式为json格式,用的多
      break;
    case 'form':
      newData = qs.stringify(data);
      contentType = 'application/x-www-form-urlencoded'; // 数据格式为"key1=value1&key2=value2"
      break;
    case 'form-data':
      newData = jsonToFormData(data);
      contentType = 'multipart/form-data'; // 用户传输文件
      break;
    default:
      contentType = 'application/json'; // 数据格式为json格式,用的多
  }
  options.headers = { ...headers, 'Content-Type': contentType };
  options.data = juicer(newData, rules);

  if (method.toLowerCase() === 'get') { // 如果是get请求，一维键值对需要放到params中
    options.params = data;
  }

  return options;
};

const request = (options) => {
  options = formatData({ ...defaultOption, ...options });

  return axios({
    ...options,
    validateStatus(status) {
      return status === 401 || status === 200;
    },
  });
};

// 请求数据拦截器
axios.interceptors.request.use((config) => {
  const { loading } = config;

  showLoading(loading);

  return config;
}, error => Promise.reject(error));

// 返回数据拦截器
axios.interceptors.response.use((response) => {
  hideLoading();
  const {
    status, data, config = {},
  } = response;

  // 处理权限不通过、cookie失效等问题
  if (status === 401) {
    if (!reloginModal) {
      reloginModal = Modal.error({
        title: '警告',
        okText: '确认',
        onOk() {
          if (window.parent.length > 0) {
            window.parent.location.href = '';
          } else {
            window.location.href = '';
          }
        },
      });
    }

    return;
  }

  // 如果请求返回的数据中的code不等于成功code（默认200）
  if (data.code !== config.code) {
    config.errorToast && message.error(data[config.messageKey] || '返回数据异常');

    return Promise.reject(new Error(`${JSON.stringify({
      success: false,
      ...data, // 展开完整的data出来
    })}`));
  }
  if (!config.intactData) {
    return Promise.resolve(data.data);
  }

  return Promise.resolve({
    ...data,
    httpCode: status,
  });
}, (error) => {
  hideLoading();
  const { response } = error;
  let msg;

  if (response && response instanceof Object) {
    const {
      data, statusText,
    } = response;

    msg = data.message || statusText;
    message.error(msg);
  } else {
    msg = error.message || '网络繁忙，请稍后再试！';
    if (msg.indexOf('timeout') > -1) {
      message.error('请求接口超时！');
    } else if (msg.indexOf('Network') > -1) {
      message.error('网络错误，请稍后再试！');
    } else {
      message.error(msg);
    }
  }

  return Promise.reject(new Error(`${JSON.stringify({
    success: false,
    message: msg,
    response,
  })}`));
});

export default request;
