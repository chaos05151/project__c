import request from '../utils/request';

//登录设备限制
export const fetchDeviceLoginTableData = query => {
    const url = 'product_management/device_login_ban_picks';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//添加登录设备限制
export const addDeviceLogin = data => {
    const url = 'product_management/device_login_ban_picks';
    return request({
        url,
        method: 'post',
        data
    });
};

//修改登录设备限制
export const updateDeviceLogin = (id,data) => {
    const url = 'product_management/device_login_ban_picks/' + id;
    return request({
        url,
        method: 'put',
        data
    });
};

//删除登录设备限制
export const deleteDeviceLogin = (id) => {
    const url = 'product_management/device_login_ban_picks/' + id;
    return request({
        url,
        method: 'delete'
    });
};

//微信账号绑定
export const fetchWechatBindTableData = query => {
    const url = 'product_management/wechat_account_binds';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//添加微信账号绑定
export const addWechatBind = data => {
    const url = 'product_management/wechat_account_binds';
    return request({
        url,
        method: 'post',
        data
    });
};

//修改微信账号绑定
export const updateWechatBind = (id,data) => {
    const url = 'product_management/wechat_account_binds/' + id;
    return request({
        url,
        method: 'put',
        data
    });
};

//删除微信账号绑定
export const deleteWechatBind = (id) => {
    const url = 'product_management/wechat_account_binds/' + id;
    return request({
        url,
        method: 'delete'
    });
};

//实名认证&防沉迷
export const fetchRealNameTableData = query => {
    const url = 'product_management/real_name_authentication_and_anti_addictions';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//添加实名认证&防沉迷
export const addRealName = data => {
    const url = 'product_management/real_name_authentication_and_anti_addictions';
    return request({
        url,
        method: 'post',
        data
    });
};

//修改实名认证
export const updateRealName = (id,data) => {
    const url = 'product_management/real_name_authentication_and_anti_addictions/' + id;
    return request({
        url,
        method: 'put',
        data
    });
};

//删除实名认证
export const deleteRealName = (id) => {
    const url = 'product_management/real_name_authentication_and_anti_addictions/' + id;
    return request({
        url,
        method: 'delete'
    });
};

//手机绑定
export const fetchPhoneBindTableData = query => {
    const url = 'product_management/mobile_phone_binds';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//添加手机绑定
export const addPhoneBind = data => {
    const url = 'product_management/mobile_phone_binds';
    return request({
        url,
        method: 'post',
        data
    });
};

//修改实名认证
export const updatePhoneBind = (id,data) => {
    const url = 'product_management/mobile_phone_binds/' + id;
    return request({
        url,
        method: 'put',
        data
    });
};

//删除实名认证
export const deletePhoneBind = (id) => {
    const url = 'product_management/mobile_phone_binds/' + id;
    return request({
        url,
        method: 'delete'
    });
};

//隐私协议
export const fetchPrivacyTableData = query => {
    const url = 'product_management/privacy_agreements';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//添加隐私协议
export const addPrivacy = data => {
    const url = 'product_management/privacy_agreements';
    return request({
        url,
        method: 'post',
        data
    });
};

//修改隐私协议
export const updatePrivacy = (id,data) => {
    const url = 'product_management/privacy_agreements/' + id;
    return request({
        url,
        method: 'put',
        data
    });
};

//删除隐私协议
export const deletePrivacy = (id) => {
    const url = 'product_management/privacy_agreements/' + id;
    return request({
        url,
        method: 'delete'
    });
};