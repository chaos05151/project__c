import request from '../utils/request';

export const fetchFindByModelName = query => {
    const url = 'api/v1/business_altman/find_by_model_name';
    return request({
        url,
        method: 'get',
        params: query
    });
};

//导入结果查询
export const fetchImportResult = () => {
    const url = 'api/v1/business_altman/import_config_result_index';
    return request({
        url,
        method: 'get'
    });
};

export const uploadByModelName = data => {
    const url = 'api/v1/business_altman/read_excel_data';
    return request({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url,
        method: 'post',
        data
    });
};