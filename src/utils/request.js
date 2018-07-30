import axios from 'axios'
import Cookie from 'js-cookie'
import { Toast } from 'vant';
const api = axios.create({
  baseURL: '',
  timeout: 5000
});

api.interceptors.request.use(req => {
  req.headers['authorization'] = Cookie.get('token') ? Cookie.get('token') : null
  req.headers['x-adtag'] = localStorage.getItem('adtag') ? localStorage.getItem('adtag') : null
  return req
}, err => {
  console.log('axios reponse error', err);
  return Promise.reject(err)
});

api.interceptors.response.use(res => {
  if (res.status === 401) {
    window.location.href = '/landingpage'
  }else if(res.data.err_code !==0 && res.data.err_code !== 3003 && res.data.err_code !== 1005){
    Toast("网络繁忙，请稍后再试");
  }else if(res.data.err_code === 1005){
    Toast("订单已付款，请勿重复支付");
  }else{
    return res
  }
}, err => {
  console.log('res err ------------------>', err);
  return Promise.reject(err)
});

export function request (url, options) {
  let opt = options || {};
  return new Promise((resolve, reject) => {
    api({
      url: url,
      method: opt.type || 'get',
      data: opt.params || {}
    })
      .then(res => {
        if (res && res.data && res.data.err_code === 0 || res.data.err_code === 3003){
          resolve(res.data)
        }else if(res && res.data){
          reject(res.data)
        }else {
          reject(res)
        }
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })

}

export default api;
