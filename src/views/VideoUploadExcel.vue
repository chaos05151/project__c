<template>
    <div>
        <div class="crumbs" style="position:relative">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 短视频后台
                </el-breadcrumb-item>
                <el-breadcrumb-item>视频推荐配置表导入</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="ml-3" type="primary" @click="submitReturn" style="position: absolute; right: 10px; bottom: -7px;">
                    返回
                </el-button>
        </div>
        <div class="container">
            <el-steps :active="active" finish-status="success">
                <el-step title="选择文件" />
                <el-step title="导入数据" />
                <el-step title="导入完成" />
            </el-steps>
            <div class="content-title">支持拖拽</div>
            <el-upload class="upload-demo" drag multiple :show-file-list="true" action :auto-upload="false"
              ref="upload"
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
                <div><el-button class="ml-3" type="primary" @click="submitUpload">
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
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
    fetchVideoImportRecord,
    importVideoExcelData,
} from "../api/video";
import moment from "moment";
import UploadInstance from "element-plus";
const active = ref(1)
const tableData = ref([]);
const upload = ref(UploadInstance)
const submitUpload = () => {
  upload.value.submit()
}
//导入excel
const ImportExcelData = (file) => {
    active.value = 2
    let formDatas = new FormData();
    formDatas.append("file", file.file);
    importVideoExcelData(formDatas)
        .then((res) => {
            if (res.status == 200) {
                active.value = 3
                ElMessage.success(res.message);
                fetchImportResultData()
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
};
//导入结果查询
const fetchImportResultData = () => {
    fetchVideoImportRecord()
        .then((res) => {
            tableData.value = res.data.map((item) => {
                return {
                    ...item,
                    updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
                };
            });
        })
        .catch(() => {
        });
};
export default {
    name: "upload",
    setup() {
        console.log('environment', process.env.NODE_ENV)
        fetchImportResultData()
        return {
            active,
            tableData,
            ImportExcelData,
            submitUpload,
            upload,
        };
    },
    methods: {
                submitReturn() {
            this.$router.push({
                name: "video"
                // params: { whichTab: whichTab.value },
            });
        },
    }
};
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