import http from '../requset';
import { toMD5 } from '@/utils';

// 获取二维码key
export const getTwoCodeKey = () => http.get('/login/qr/key');
// 生成二维码
export const createTwoCodeKey = (key: string) => http.get('/login/qr/create', { key, qrimg: true, });
// 检测二维码是否过期
export const checkTwoCodeEffective = (key: string) => http.get('/login/qr/check', { key, });
// 邮箱登录
export const emailLogin = (email: string, password: string) => http.get('/login', { email, 'md5_password': toMD5(password), });
// 手机登录
export const phoneLogin = (phone: number, password: string) => http.get('/login/cellphone', { phone, 'md5_password': toMD5(password), });
// 登录状态
export const getStatus = () => http.get('/login/status');
// 退出登录
export const logout = () => http.get('/logout');
// 获取验证码
export const getCaptcha = (phone: string) => http.get('/captcha/sent', { phone, });
// 校验手机是否已经注册过
export const checkPhoneExistence = (phone: string) => http.get('/cellphone/existence/check', {phone, });
// 校验验证码
export const verifyCaptcha = (phone: string, captcha: string) => http.get('/captcha/verify', { phone, captcha, });
// 注册手机
export const registerPhone = (phone: string, password: string, captcha: string, nickname = '准点上线') => http.get('/register/cellphone',{phone, password, captcha, nickname, });
