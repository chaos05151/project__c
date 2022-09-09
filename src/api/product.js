import {serviceb} from '../utils/request';

//获取关联版本的二级产品和渠道
export const fetchVersionProductChannelData = data => {
    const url = 'api/v1/system_b/game_versions/get_tree';
    return serviceb({
        url,
        method: 'get',
        params: data
    });
};