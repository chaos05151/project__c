import {service} from '../utils/request';

//获取短视频记录
export const fetchVideoTableData = query => {
    const url = 'api/v1/import_table/get_video_lists';
    return service({
        url,
        method: 'get',
        params: query
    });
};

//获取上传成功的记录
export const fetchVideoImportRecord = () => {
    const url = 'api/v1/import_table/get_import_log';
    return service({
        url,
        method: 'get'
    });
};




//修改短视频记录
export const updateVideoImportRecord = (id,data) => {
    const url = 'short_video/infos/' + id;
    return service({
        url,
        method: 'patch',
        data
    });
};

//删除短视频记录
export const deleteVideoImportRecord = (id) => {
    const url = 'short_video/infos/' + id;
    return service({
        url,
        method: 'delete'
    });
};

//导入视频推荐配置文件
export const importVideoExcelData = (data) => {
    const url = '/api/v1/import_table/read_excel_data';
    return service({
        url,
        method: 'post',
        data
    });
};

//导入规则表配置文件
export const importCommonExcelData = (data) => {
    const url = '/api/backend/import_excel';
    return service({
        url,
        method: 'post',
        data
    });
};

//查询通用配置数据
export const fetchCommonExcelData = query => {
    const url = 'api/backend/game_config_messages';
    return service({
        url,
        method: 'get',
        params: query
    });
};

//查询通用配置导入记录 
export const fetchCommonResultData = data => {
    const url = 'api/backend/import_config_result';
    return service({
        url,
        method: 'get',
        params: data
    });
};