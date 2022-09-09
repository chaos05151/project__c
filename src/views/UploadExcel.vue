<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 规则配置表导入
                </el-breadcrumb-item>
                <el-breadcrumb-item>配置表导入</el-breadcrumb-item>
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
                版本选择: <el-select style="width:13%" v-model="version_name_selected" placeholder="版本选择" class="m-2">
                    <el-option v-for="item in versionoptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>
                <el-button type="primary" style="margin-left:260px;" @click="configimporthistory">配置表导入历史</el-button>
            </div>

            <el-steps :active="active" finish-status="success">
                <el-step title="选择文件" />
                <el-step title="导入数据" />
                <el-step title="导入完成" />
            </el-steps>
            <div class="content-title">支持拖拽</div>
            <el-upload class="upload-demo" drag multiple action :auto-upload="false" ref="upload"
                :http-request="ImportExcelData">
                <template #trigger>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                </template>

                <template #tip>
                    <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
                </template>
                <div>
                    <el-button class="ml-3" type="primary" @click="submitUpload">
                        一键上传
                    </el-button>
                </div>

            </el-upload>
            <el-divider />
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="file_name" label="文件名称"></el-table-column>
                <el-table-column prop="import_status" label="状态">
                    <template #default="scope">
                        <el-tag :type="
                            scope.row.import_status === '导入成功'
                                ? 'success'
                                : scope.row.import_status === '导入失败'
                                    ? 'danger'
                                    : ''
                        ">{{ scope.row.import_status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="导入时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page_index"
                :page-size="query.page_size" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,reactive} from "vue";
import { ElMessage } from "element-plus";
import {
    fetchCommonResultData,
    importCommonExcelData,
} from "../api/video";
import moment from "moment";
import UploadInstance from "element-plus";
import {
    fetchVersionProductChannelData,
} from "../api/product";
import { useRouter } from "vue-router";
import { setLocale } from "element-plus/lib/locale";
const product_name_selected = ref('')
const channel_name_selected = ref('')
const version_name_selected = ref('')
const productoptions = ref([]);
const channeloptions = ref([]);
const versionoptions = ref([]);
const active = ref(1)
const tableData = ref([]);
const upload = ref(UploadInstance)
const router=useRouter();
const query=reactive({
    page_index:1,
    page_size:10,
})
const pageTotal=ref(1);
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
const submitUpload = () => {
    if (product_name_selected.value && channel_name_selected.value && version_name_selected.value) {
        console.log('product_name_selected.value', product_name_selected.value)
        console.log('channel_name_selected.value', channel_name_selected.value)
        console.log('version_name_selected.value', version_name_selected.value)
        upload.value.submit()
    }
    else if (!product_name_selected.value)
        ElMessage.error('请选择游戏!')
    else if (!channel_name_selected.value)
        ElMessage.error('请选择渠道!')
    else if (!version_name_selected.value)
        ElMessage.error('请选择版本号!')
}
//导入excel
const ImportExcelData = (file) => {
    active.value = 2
    if (product_name_selected.value && channel_name_selected.value && version_name_selected.value) {
        let formDatas = new FormData();
        formDatas.append("file", file.file);
        formDatas.append("product_id", product_name_selected.value);
        formDatas.append("channel", channel_name_selected.value);
        formDatas.append("versions_b", version_name_selected.value);
        importCommonExcelData(formDatas)
            .then((res) => {
                if (res.status == 200) {
                    active.value = 3
                    ElMessage.success(res.message);
                    fetchImportResultData()
                    upload.value.clearFiles()
                } else {
                    ElMessage.error(res?.message);
                    active.value = 1
                }
                setTimeout(() => {
                    active.value = 1
                }, 3000)
            })
            .catch(() => {
            });
    }
};

//配置表导入历史
const configimporthistory=()=>{
    console.log(product_name_selected.value,channel_name_selected.value,version_name_selected.value);
    localStorage.setItem('productoptions',JSON.stringify(productoptions.value))
    localStorage.setItem('channeloptions',JSON.stringify(productoptions.value[0].children))
    localStorage.setItem('versionoptions',JSON.stringify(versionoptions.value))
    router.push({
        name:'configimporthistory',
    })
}

//导入结果查询
const fetchImportResultData = (data) => {
    fetchCommonResultData(data)
        .then((res) => {
            pageTotal.value=res.data.total_count
            tableData.value = res.data.lists.map((item) => {
                return {
                    ...item,
                    import_status:item.import_status=="1"?"导入成功":"导入失败",
                    updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
                };
            });
        })
        .catch(() => {
        });
};
//分页
const handlePageChange=(val)=>{
    query.page_index=val
    fetchImportResultData(query)
}

//从流量商业化B端加载版本游戏渠道数据
getVersionProductChannelData()
console.log('environment', process.env.NODE_ENV)
//加载excel导入记录
fetchImportResultData(query)

</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}

.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}

.crop-demo {
    display: flex;
    align-items: flex-end;
}

.handle-box {
    margin-bottom: 20px;
}

.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}

.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>