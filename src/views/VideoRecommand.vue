<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>短视频后台</el-breadcrumb-item>
                <el-breadcrumb-item>视频推荐</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="idnicknamephonemobile" @input="searchByIdNickNameIpMobile" style="width: 260px"
                    class="w-50 m-2" placeholder="请输入推荐值/视频名称" />&nbsp;&nbsp;
                <el-button type="primary" @click="importExcel()">上传</el-button>
                <!-- <el-button type="primary" @click="exportExcel()">下载</el-button> -->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column width="88" sortable prop="recommend_num" label="推荐值"></el-table-column>
                <el-table-column width="185" prop="subject_name" label="视频名称"></el-table-column>
                <el-table-column prop="play_url" label="视频地址"></el-table-column>
                <el-table-column width="178" prop="updated_at" label="操作记录"></el-table-column>
                <!-- <el-table-column
          prop="bind_account_count"
          label="关联账号数"
        ></el-table-column>
        <el-table-column prop="illegal_time" label="拉黑时间"></el-table-column> -->
                <el-table-column label="操作" width="150" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-link" @click="handleEdit(scope.row.id, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page_index"
                    :page-size="query.page_size" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="60%">
            <el-form label-width="110px">
                <el-form-item label="视频id">
                    <el-input style="width: 160px" disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="视频名称">
                    <el-input style="width: 160px" disabled v-model="form.subject_name"></el-input>
                </el-form-item>
                <el-form-item label="视频地址">
                    <el-input style="width: 160px" disabled v-model="form.play_url"></el-input>
                </el-form-item>
                <el-form-item label="推荐值设置">
                    <el-input style="width: 160px" v-model="form.recommend_num"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchVideoTableData, updateVideoImportRecord, deleteVideoImportRecord } from "../api/video";
import moment from "moment";
import {exportExcelData} from "../utils/export2excel"
const tableData = ref([]);
const pageTotal = ref(0);
const idnicknamephonemobile = ref("");
const query = reactive({
    keywords: '',
    page_index: 1,
    page_size: 10,
});
const form = reactive({
    id: '',
    subject_name: '',
    play_url: '',
    recommend_num: ''
});

//修改推荐值
const updateVideoImportRecordData = (id, data) => {
    updateVideoImportRecord(id, data).then((res) => {
        if (res.status == 200) {
            ElMessage.success("修改推荐值成功");
            getVideoTableData(query);
        } else {
            ElMessage.error(res.message);
        }
    });
};

//删除微信账号绑定
const deleteVideoImportRecordData = (id) => {
    deleteVideoImportRecord(id).then((res) => {
        if (res.status == 200) {
            ElMessage.success("删除成功");
            getVideoTableData(query);
        }
    });
};

// 获取用户列表数据
const getVideoTableData = (data) => {
    fetchVideoTableData(data)
        .then((res) => {
            if (res.status == 200) {
                tableData.value = res.data.lists.map((item) => {
                    return {
                        ...item,
                        updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
                    };
                });
                pageTotal.value = res.data.total_count
            } else {
                ElMessage.error(res?.message);
            }

        })
        .catch(() => { });
};
//数字校验
const checkNonnegative = (value) => {
    if (value) {
        let z_reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!z_reg.test(value)) {
            return false;
        } else {
            return true;
        }
    }
};
export default {
    name: "basetable",
    setup() {
        //获取用户列表
        getVideoTableData(query);
        // 分页导航
        const handlePageChange = (val) => {
            query.page_index = val;
            getVideoTableData(query);
        };
        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        const handleEdit = (index, row) => {
            console.log('handelEdit index', index)
            console.log('handleEdit row', row)
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            console.log('handleEdit form', form)
            editVisible.value = true;
        };
        const saveEdit = () => {
            editVisible.value = false;
            console.log('saveEdit form', form)
            const data = {
                recommend_num: form.recommend_num
            }
            updateVideoImportRecordData(form.id, data)
        };
        // 删除操作
        const handleDelete = (id) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    deleteVideoImportRecordData(id)
                })
                .catch(() => { });
        };
        const searchByIdNickNameIpMobile = () => {
            if (idnicknamephonemobile.value) {
                query.keywords = idnicknamephonemobile.value
                getVideoTableData(query)
            } else {
                idnicknamephonemobile.value = ''
                query.keywords = ''
                getVideoTableData(query)
            }
        };
        return {
            tableData,
            checkNonnegative,
            searchByIdNickNameIpMobile,
            idnicknamephonemobile,
            handleEdit,
            saveEdit,
            editVisible,
            form,
            handlePageChange,
            query,
            pageTotal,
            handleDelete,
        };
    },
    methods: {
        importExcel() {
            this.$router.push("/videoexcel");
        },
        exportExcel() {
            //表头中文名
            const titleArr = [
                "推荐值",
                "视频名称",
                "视频地址",
                "操作记录",
            ];
            const data = tableData.value.map((item) => {
                return {
                    recommend_num: item.recommend_num,
                    subject_name: item.subject_name,
                    play_url: item.play_url,
                    updated_at: item.updated_at
                };
            });
            console.log('data', data.length)
            if (data.length > 0)
                exportExcelData(data, "ShortVideo", titleArr, "视频推荐");
            else
                ElMessage.error('暂无数据下载！');
        },
    },
};
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
</style>
