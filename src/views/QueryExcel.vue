<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>规则配置</el-breadcrumb-item>
                <el-breadcrumb-item>规则展示</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                游戏选择: <el-select @change="query_channel" style="width:13%" v-model="product_name_selected"
                    placeholder="游戏选择" class="m-2">
                    <el-option v-for="item in productoptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>&nbsp;
                渠道选择: <el-select @change="query_version" style="width:13%" v-model="channel_name_selected"
                    placeholder="渠道选择" class="m-2">
                    <el-option v-for="item in channeloptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>&nbsp;
                版本选择: <el-select @change="query_table" style="width:13%" v-model="version_name_selected"
                    placeholder="版本选择" class="m-2">
                    <el-option v-for="item in versionoptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>
            </div>
            <el-tabs v-show="activeName" v-model="activeName" type="border-card" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in tab_names" :key="index" :label="item" :name="item">
                    <el-table height="450" ref="table" v-loading="loading" element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading" :data="current_table_data">
                        <template v-for="(header, header_index) in current_table_header" :key="header">
                            <el-table-column :label="header" width="180">
                                <el-table-column :label="current_table_type[header_index]">
                                    <el-table-column :label="current_table_desc[header_index]">
                                        <el-table-column :label="current_table_cs[header_index]" :prop="header">
                                        </el-table-column>
                                    </el-table-column>
                                </el-table-column>
                            </el-table-column>
                        </template>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { fetchCommonExcelData } from "../api/video";
import {
    fetchVersionProductChannelData,
} from "../api/product";
import moment from "moment";
const product_name_selected = ref("");
const channel_name_selected = ref("");
const version_name_selected = ref("");
const productoptions = ref([]);
const channeloptions = ref([]);
const versionoptions = ref([]);
const table = ref("");
const tab_names = ref([]);
const new_table_data = ref([]);
const current_table_data = ref([]);
const current_table_header = ref([]);
const current_table_type = ref([]);
const current_table_desc = ref([]);
const current_table_cs = ref([]);
const activeName = ref("");
const loading = ref(true);

console.log('this.$refs.table ', table)

//获取游戏版本渠道信息
const getVersionProductChannelData = () => {
    fetchVersionProductChannelData().then((res) => {
        console.log("fetchVersionProductChannelData", res.data);
        productoptions.value = res.data
    }).catch(() => {
        // ElMessage.error("服务器异常！");
    });
};
//根据游戏获取渠道
const query_channel = () => {
    channel_name_selected.value = ''
    version_name_selected.value = ''
    channeloptions.value = productoptions.value.filter((column) => column.value == product_name_selected.value
    )[0].children
}
//根据渠道获取版本
const query_version = () => {
    version_name_selected.value = ''
    versionoptions.value = channeloptions.value.filter((column) => column.value == channel_name_selected.value)[0].children
}
const query_table = () => {
    let data = {
        product_id: product_name_selected.value,
        versions_b: version_name_selected.value,
        channel: channel_name_selected.value,
    };
    fetchCommonExcelData(data).then((res) => {
        if (res.status == 200) {
            loading.value = false;
            tab_names.value = res.data?.tab_name.filter((column) => column > "");
            if (tab_names.value > '') {
                activeName.value = res.data?.tab_name[0];
                new_table_data.value = res.data?.rules;
                current_table_data.value = res.data?.rules[0]?.config_data.slice(0, 10);
                current_table_header.value = res.data?.rules[0]?.tab_filed_name;
                current_table_type.value = res.data?.rules[0]?.tab_filed_type;
                current_table_desc.value = res.data?.rules[0]?.tab_filed_desc;
                current_table_cs.value = res.data?.rules[0]?.tab_filed_cs;

                //滚动加载数据，触底后每次加载20条
                document.addEventListener(
                    "scroll",
                    (re) => {
                        if (res.data?.rules[0]?.config_data.length > 10) {
                            let times = 1;
                            // 监听滚动事件
                            const height = re.target;
                            const clientHeight = height.clientHeight; // 表格视窗高度 即wraper
                            const scrollTop = height.scrollTop; // 表格内容已滚动的高度
                            const scrollHeight = height.scrollHeight; // 表格内容撑起的高度
                            if (clientHeight + scrollTop === scrollHeight) {
                                // 表格滚动已经触底 更新表格数据
                                times = times + 1;
                                const length =
                                    100 * times > res.data?.rules[0]?.config_data.length
                                        ? res.data?.rules[0]?.config_data.length
                                        : 100 * times;
                                current_table_data.value = res.data?.rules[0]?.config_data.slice(0, length);
                            }
                            else {
                                current_table_data.value = res.data?.rules[0]?.config_data.slice(0, 100 * times);
                            }
                        } else {
                            current_table_data.value = res.data?.rules[0]?.config_data.slice(0, 10);
                        }
                    },
                    true
                );


            } else
                ElMessage.error('没有匹配到数据！');
        } else {
            ElMessage.error(res?.message);
        }
    });
};
const handleTabClick = (tabname) => {
    const table_data = new_table_data.value[tabname.index];
    //   current_table_data.value = table_data?.config_data;
    current_table_data.value = table_data?.config_data.slice(0, 10);
    current_table_header.value = table_data?.tab_filed_name;
    current_table_type.value = table_data?.tab_filed_type;
    current_table_desc.value = table_data?.tab_filed_desc;
    current_table_cs.value = table_data?.tab_filed_cs;
    console.log('table_data?.config_data', table_data?.config_data)
    console.log('table_data?.config_data.length', table_data?.config_data.length)
    //滚动加载数据，触底后每次加载20条
    document.addEventListener(
        "scroll",
        (res) => {
            if (table_data?.config_data.length > 10) {
                let times = 1;
                // 监听滚动事件
                const height = res.target;
                const clientHeight = height.clientHeight; // 表格视窗高度 即wraper
                const scrollTop = height.scrollTop; // 表格内容已滚动的高度
                const scrollHeight = height.scrollHeight; // 表格内容撑起的高度
                if (clientHeight + scrollTop === scrollHeight) {
                    // 表格滚动已经触底 更新表格数据
                    times = times + 1;
                    const length =
                        100 * times > table_data?.config_data.length
                            ? table_data?.config_data.length
                            : 100 * times;
                    current_table_data.value = table_data?.config_data.slice(0, length);
                }
                else {
                    current_table_data.value = table_data?.config_data.slice(0, 100 * times)
                }
            } else {
                current_table_data.value = table_data?.config_data.slice(0, 10);
            }
        },
        true
    );
    // }
    // else{
    //     console.log('handleTabClick table_data?.config_data', table_data?.config_data)
    //     current_table_data.value = table_data?.config_data.slice(0, 10);
    //     console.log('handleTabClick current_table_data.value', current_table_data.value)
    // }

};
getVersionProductChannelData()
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

body {
    margin: 0;
}

.example-showcase .el-loading-mask {
    z-index: 9;
}
</style>
