<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>风控系统</el-breadcrumb-item>
                <el-breadcrumb-item>提现列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="main_product_name_selected" placeholder="一级游戏" class="m-2"
                    @change="getProductAndDataList">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option v-for="item in options" :key="item.id" :label="item.main_product_name"
                        :value="item.id" />
                </el-select>
                <el-select v-model="product_name_selected" placeholder="二级游戏" class="m-2" @change="getDataById">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option v-for="item in suboptions" :key="item.product_id" :label="item.product_name"
                        :value="item.product_id" />
                </el-select>&nbsp;&nbsp;
                <el-button v-show="showWithdraw" type="primary" @click="withdrawShow = true"> 全局配置</el-button>
                <el-button type="primary" @click="handleAdd">提现设置</el-button>
                <el-drawer v-model="withdrawShow" title="提现全局配置信息：" direction="rtl" size="50%">
                    <el-form ref="formRef" :model="form" label-width="280px">
                        <el-form-item label="是否禁止所有用户提现" prop="user_withdrawal_status">
                            <el-switch disabled v-model="form.user_withdrawal_status"></el-switch>
                        </el-form-item>
                        <el-form-item label="是否允许自然量登录" prop="biomass_login_status">
                            <el-switch disabled v-model="form.biomass_login_status"></el-switch>
                        </el-form-item>
                        <el-form-item label="提现审核标准" prop="withdrawal_audit_standard">
                            <el-input disabled style="width: 150px" v-model="form.withdrawal_audit_standard"></el-input>
                        </el-form-item>
                        <el-form-item label="提现次数" prop="withdrawal_count">
                            <el-input disabled style="width: 150px" v-model="form.withdrawal_count">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-drawer>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <!-- <el-table-column prop="main_product_id" sortable label="父游戏ID"></el-table-column> -->
                <el-table-column prop="main_product_name" label="父游戏"></el-table-column>
                <!-- <el-table-column prop="product_id" label="子游戏ID"></el-table-column> -->
                <el-table-column prop="product_name" label="子游戏"></el-table-column>
                <el-table-column prop="unaudit_orders_count" label="未审核订单数"></el-table-column>
                <el-table-column prop="unaudit_reward_sum" label="未审核总金额"></el-table-column>
                <el-table-column prop="apply_users_count" label="申请人数"></el-table-column>
                <el-table-column prop="user_withdrawal_status" label="用户提现"></el-table-column>
                <el-table-column prop="biomass_login_status" label="自然量登录"></el-table-column>
                <el-table-column prop="withdrawal_audit_standard" label="提现审核标准"></el-table-column>
                <el-table-column prop="withdrawal_count" label="单用户当天提现次数"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-link" @click="withdrawDetail(scope.row.id)">详情
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑提现配置" v-model="editVisible" width="60%">
            <el-form ref="formRef" :rules="rules" :model="formEdit" label-width="280px">
                <el-form-item label="禁止所有用户提现" prop="user_withdrawal_status">
                    <el-switch v-model="formEdit.user_withdrawal_status"></el-switch>
                </el-form-item>
                <el-form-item label="是否允许自然量登录" prop="biomass_login_status">
                    <el-switch v-model="formEdit.biomass_login_status"></el-switch>
                </el-form-item>
                <el-form-item label="提现审核标准" prop="withdrawal_audit_standard">
                    <el-input style="width: 150px" v-model="formEdit.withdrawal_audit_standard"></el-input>
                </el-form-item>
                <el-form-item label="提现次数" prop="withdrawal_count">
                    <el-input style="width: 150px" v-model="formEdit.withdrawal_count">
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增提现配置" v-model="addVisible" width="60%">
            <el-form ref="formRef" :rules="rules" :model="formAdd" label-width="280px">
                <el-form-item label="配置类型" prop="config_type">
                    <el-radio-group v-model="formAdd.config_type">
                        <el-radio label="0">所有项目</el-radio>
                        <el-radio label="1">指定项目</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="formAdd.config_type == 1" label="一级游戏" prop="main_product_name_selected">
                    <el-select v-model="main_product_name_selected" placeholder="一级游戏" class="m-2"
                        @change="getProductAndDataList">
                        <el-option v-for="item in options" :key="item.id" :label="item.main_product_name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item v-show="formAdd.config_type == 1" label="二级游戏" prop="product_name_selected">
                    <el-select multiple v-model="product_name_selected" placeholder="二级游戏" class="m-2">
                        <el-option v-for="item in suboptions" :key="item.product_id" :label="item.product_name"
                            :value="item.product_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="禁止所有用户提现" prop="user_withdrawal_status">
                    <el-switch v-model="formAdd.user_withdrawal_status"></el-switch>
                </el-form-item>
                <el-form-item label="是否允许自然量登录" prop="biomass_login_status">
                    <el-switch v-model="formAdd.biomass_login_status"></el-switch>
                </el-form-item>
                <el-form-item label="提现审核标准" prop="withdrawal_audit_standard">
                    <el-input style="width: 150px" v-model="formAdd.withdrawal_audit_standard"></el-input>
                </el-form-item>
                <el-form-item label="提现次数" prop="withdrawal_count">
                    <el-input style="width: 150px" v-model="formAdd.withdrawal_count">
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import {
    fetchProductTableDataById,
    fetchMainProductList,
    fetchProductList,
} from "../api/product";
import {
    withdrawAdd,
    withdrawList,
    withdrawUpdate,
} from "../api/user";
// import table from "../mock/table.json";
const main_product_name_selected = ref('')
const product_name_selected = ref('')

const search_main_product_name_selected = ref('')
const search_product_name_selected = ref('')
const form = reactive({
});
const formAdd = reactive({
})
// const formEdit = reactive({
// });
const formRef = ref(null);
const showWithdraw = ref(false)
const withdrawShow = ref(false)
const tableData = ref([]);
const pageTotal = ref(0);
const main_product_value_select = ref('')
const product_type = ref("一级游戏");
let options = ref([]);
let suboptions = ref([]);
let addoptions = ref([]);

// 获取提现列表
const getData = (data) => {
    withdrawList(data).then((res) => {
        if(res.status == 200){
tableData.value = res.data.filter(
            (column) => column.config_type != 0
        );
        form.value = res.data.filter(
            (column) => column.config_type == 0
        )[0];
        console.log('withdrawList form.value', form.value)
        if (form.value.config_type == 0) {
            showWithdraw.value = true
            form.user_withdrawal_status = form.value.user_withdrawal_status == 1 ? true : false
            form.biomass_login_status = form.value.biomass_login_status == 1 ? true : false //隐私协议
            form.withdrawal_audit_standard = form.value.withdrawal_audit_standard//提现审核标准
            form.withdrawal_count = form.value.withdrawal_count //单日用户提现次数
        }
        }else{
            if(res.message){
                ElMessage.error(res.message);
            }else{
                ElMessage.error('后端api接口异常！');
            }
        }
        
    }).catch(() => {
    });
};
//数字状态值转换：0：不允许；1：允许
const convertNumToString = idValue => {
    if (idValue == 1) return '允许'
    if (idValue == 0) return '不允许'
}
// 获取具体的二级产品
// const getSubDataById = (product_id) => {
//     fetchProductTableDataById(product_id).then((res) => {
//         console.log("getSubDataById", res.data);
//         tableData.value = res.data;
//     }).catch(() => {
//         ElMessage.error("服务器异常！");
//     });
// };
//获取一级游戏产品信息
const getProductDataList = () => {
    fetchMainProductList().then((res) => {
        console.log("getProductDataList", res.data);
        options.value = res.data;
        addoptions.value = res.data;
        console.log('options.value', options.value)
    }).catch(() => {
        // ElMessage.error("服务器异常！");
    });
};
//根据一级游戏获取二级游戏产品信息
const getSubProductDataList = (query) => {
    const data = {
        main_product_id: query
    }
    fetchProductList(data).then((res) => {
        console.log("getSubProductDataList", res.data);
        suboptions.value = res.data;
        // tableData.value = res.data;
        console.log('suboptions.value', suboptions.value)
    }).catch(() => {
        // ElMessage.error("getSubProductDataList服务器异常！");
    });
};
//添加提现配置
const withdrawAddData = (data) => {
    withdrawAdd(data).then((res) => {
        // formRef.value.resetFields();
        if (res.status == 200) {
            ElMessage.success("添加提现配置成功");
            getData()
        } else if (res.status == -1) {
            ElMessage.error("此游戏配置已存在！");
        }
    });
};
//添加提现配置
const withdrawUpdateData = (id, data) => {
    withdrawUpdate(id, data).then((res) => {
        // formRef.value.resetFields();
        if (res.status == 200) {
            ElMessage.success("修改提现配置成功");
            getData()
        }
    });
};
//数字校验
const checkNonnegative = (value) => {
    if (value) {
        let z_reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!z_reg.test(value)) {
            ElMessage.error("请先选择产品！");
            return false;
        } else {
            return true;
        }
    } else {
        ElMessage.error("请选择游戏！");
        return false;
    }
};
//验证是否是非负数
const checkNonnegate = (value) => {
    if (value) {
        let z_reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!z_reg.test(value)) {
            ElMessage.error("请输入数字！");
            return false;
        } else {
            return true;
        }
    }
};
export default {
    name: "basetable",
    setup() {
        const rules = {
        };
        getData();
        getProductDataList();

        let formEdit = reactive({
            id: "",
            main_product_id: "",
            product_id: "",
            main_product_name: "",
            product_name: "",
            user_withdrawal_status: "",
            biomass_login_status: "",
            withdrawal_audit_standard: "",
            withdrawal_count: ""
        });

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        const addVisible = ref(false);
        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            console.log('handelEdit index', index)
            console.log('handleEdit row', row)
            Object.keys(formEdit).forEach((item) => {
                console.log('handleEdit item', item)
                if (item == 'user_withdrawal_status') {
                    formEdit[item] = row[item] == 1 ? true : false
                }
                else if (item == 'biomass_login_status') { formEdit[item] = row[item] == 1 ? true : false }
                else {
                    formEdit[item] = row[item];
                }

            });
            console.log('formEdit', formEdit)
            editVisible.value = true;
        };
        const handleAdd = () => {
            addVisible.value = true;
        };
        const saveEdit = () => {
            editVisible.value = false;
            if (formEdit.withdrawal_audit_standard) {
                if (!checkNonnegate(formEdit.withdrawal_audit_standard)) return
            }
            if (formEdit.withdrawal_count) {
                if (!checkNonnegate(formEdit.withdrawal_count)) return
            }
            const data = {
                user_withdrawal_status: formEdit.user_withdrawal_status ? 1 : 0, //用户协议
                biomass_login_status: formEdit.biomass_login_status ? 1 : 0, //隐私协议
                withdrawal_audit_standard: formEdit.withdrawal_audit_standard,//提现审核标准
                withdrawal_count: formEdit.withdrawal_count, //单日用户提现次数
            };
            console.log('saveEdit data', data)
            withdrawUpdateData(formEdit.id, data);
        };
        const saveAdd = () => {
            addVisible.value = false;
            if (formAdd.withdrawal_audit_standard) {
                if (!checkNonnegate(formAdd.withdrawal_audit_standard)) return
            }
            if (formAdd.withdrawal_count) {
                if (!checkNonnegate(formAdd.withdrawal_count)) return
            }
            console.log('formAdd config_type', formAdd)

            if (formAdd.config_type) {
                if (formAdd.config_type == 1) {
                    if (!checkNonnegative(main_product_name_selected.value)) return;
                    product_name_selected.value.forEach(function (val) {
                        if (!checkNonnegative(val)) return;
                        const product_name = suboptions.value.filter(
                            (column) => column.product_id == val
                        );
                        const data = {
                            config_type: 1, //配置类型：0，所有项目；1：指定项目
                            main_product_id: product_name[0].main_product_id, //父游戏id选填，选择父游戏id之后，只展示对应父游戏项目
                            main_product_name: product_name[0].main_product_name,
                            product_id: product_name[0].product_id, //子游戏id
                            product_name: product_name[0].product_name,
                            user_withdrawal_status: formAdd.user_withdrawal_status ? 1 : 0, //用户协议
                            biomass_login_status: formAdd.biomass_login_status ? 1 : 0, //隐私协议
                            withdrawal_audit_standard: formAdd.withdrawal_audit_standard,//提现审核标准
                            withdrawal_count: formAdd.withdrawal_count, //单日用户提现次数
                        };
                        console.log('saveAdd data', data)
                        withdrawAddData(data);
                    });
                    //查询和新增是共用的选择框，需要清除选择的二级游戏
                    main_product_name_selected.value = '';
                    product_name_selected.value = '';
                    suboptions.value = ''
                } else {
                    const globaldata = {
                        config_type: 0, //配置类型：0，所有项目；1：指定项目
                        user_withdrawal_status: formAdd.user_withdrawal_status ? 1 : 0, //用户协议
                        biomass_login_status: formAdd.biomass_login_status ? 1 : 0, //隐私协议
                        withdrawal_audit_standard: formAdd.withdrawal_audit_standard,//提现审核标准
                        withdrawal_count: formAdd.withdrawal_count, //单日用户提现次数
                    };
                    console.log('saveAdd globaldata', globaldata)
                    withdrawAddData(globaldata);
                }
            } else {
                ElMessage.error("必须选择配置类型！");
                return;
            }
        };
        const getProductAndDataList = () => {
            product_name_selected.value = ''
            suboptions.value = ''
            //获取二级游戏列表
            if (main_product_name_selected.value == -1) {
                getData()
            } else {
                const data = {
                    main_product_id: main_product_name_selected.value
                }
                getData(data)
                getSubProductDataList(main_product_name_selected.value)
            }
        }
        const getDataById = () => {
            //通过二级游戏id获取对应二级游戏
            if (main_product_name_selected.value == -1) {
                getData()
            }
            else if (product_name_selected.value == -1) {
                const data = {
                    main_product_id: main_product_name_selected.value
                }
                getData(data)
            } else {
                const data = {
                    product_id: product_name_selected.value
                }
                getData(data)
            }

            console.log('main_product_name_selected', main_product_name_selected.value)
            console.log('product_name_selected', product_name_selected.value)
        }
        return {
            tableData,
            pageTotal,
            editVisible,
            addVisible,
            form,
            formEdit,
            formAdd,
            showWithdraw,
            withdrawShow,
            handleEdit,
            handleAdd,
            saveEdit,
            saveAdd,
            product_type,
            options,
            suboptions,
            addoptions,
            main_product_name_selected,
            product_name_selected,
            main_product_value_select,
            getProductAndDataList,
            getDataById,
            rules,
            form,
            formRef,
        };
    },
    methods: {
        withdrawDetail() {
            this.$router.push("/withdrawdetail")
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
