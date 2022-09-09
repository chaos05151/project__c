<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>风控系统</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>申请提现列表</el-breadcrumb-item>
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
                </el-select>
            </div>
            <el-form :model="widthdrawDetail" :inline="true">
        <el-form-item label="未审订单数">
          {{ widthdrawDetail.unaudit_orders_count }}
        </el-form-item>
        <el-form-item label="申请人数">
          {{ widthdrawDetail.apply_users_count }}
        </el-form-item>
        <el-form-item label="未审总金额">
          {{ widthdrawDetail.unaudit_reward_sum }}
        </el-form-item>
      </el-form>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="main_product_name" label="父游戏"></el-table-column>
                <el-table-column prop="product_name" label="子游戏"></el-table-column>
                <el-table-column prop="nickname" label="用户名"></el-table-column>
                <el-table-column prop="bind_account_count" label="设备关联账号"></el-table-column>
                <el-table-column prop="amount" label="申请提现金额"></el-table-column>
                <el-table-column prop="oaid" label="数盟id"></el-table-column>
                <el-table-column prop="ip" label="ip"></el-table-column>
                <el-table-column prop="ip_address" label="ip地址"></el-table-column>
                <el-table-column prop="updated_at" label="提现时间"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-link" @click="withdrawDetail(scope.row.wechat_user_id)">详情
                        </el-button>
                        <el-button type="text" v-show="scope.row.status ==1" icon="el-icon-edit" @click="handleOk(scope.row.id)">同意
                        </el-button>
                        <el-button type="text" v-show="scope.row.status ==1" icon="el-icon-delete" @click="handleDelete(scope.row.id)">拒绝
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    fetchProductTableDataById,
    fetchMainProductList,
    fetchProductList,
} from "../api/product";
import moment from "moment";
import {
    withdrawCheckList,
    withdrawCheck
} from "../api/user";
// import table from "../mock/table.json";
const main_product_name_selected = ref('')
const product_name_selected = ref('')
const tableData = ref([]);
const product_type = ref("一级游戏");
const widthdrawDetail = reactive({
});
let options = ref([]);
let suboptions = ref([]);
let addoptions = ref([]);

// 获取提现审核列表
const getData = (data) => {
    withdrawCheckList(data).then((res) => {
        console.log("withdrawCheckList", res.data);
        tableData.value = res.data.list.map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });;
        widthdrawDetail.apply_users_count = res.data.apply_users_count
        widthdrawDetail.unaudit_orders_count = res.data.unaudit_orders_count
        widthdrawDetail.unaudit_reward_sum = res.data.unaudit_reward_sum
    }).catch(() => {
    });
};
// 获取具体的二级产品
const getSubDataById = (product_id) => {
    fetchProductTableDataById(product_id).then((res) => {
        console.log("getSubDataById", res.data);
    }).catch(() => {
        // ElMessage.error("服务器异常！");
    });
};
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
        console.log('suboptions.value', suboptions.value)
    }).catch(() => {
        // ElMessage.error("服务器异常！");
    });
};
//提现审批：2：同意；1：拒绝
const withdrawCheckData = (id,status) => {
    const data ={
        id,
        status
    }
    withdrawCheck(data).then((res) => {
        if (res.status == 200) {
            ElMessage.success("审核成功！");
            getData()
        }
    }).catch(() => {
    });
};
export default {
    name: "basetable",
    setup() {
        getData();
        getProductDataList();
                // 删除操作
        const handleOk = (id) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要同意吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    withdrawCheckData(id,2)
                })
                .catch(() => { });
        };

        // 删除操作
        const handleDelete = (id) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要拒绝吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    withdrawCheckData(id,4)
                })
                .catch(() => { });
        };

        const getProductAndDataList = () => {
            product_name_selected.value = ref('')
            console.log('main_product_name_selected.value', main_product_name_selected.value)
            //获取二级游戏列表
            if (main_product_name_selected.value == -1) {
                getData()
            } else {
                const data ={
                    main_product_id: main_product_name_selected.value
                }
                getData(data)
                getSubProductDataList(main_product_name_selected.value)
            }

            console.log('main_product_name_selected', main_product_name_selected.value)
        }
        const getDataById = () => {
            //通过二级游戏id获取对应二级游戏
            if (product_name_selected.value == -1) {
                const data ={
                    main_product_id: main_product_name_selected.value
                }
                getData(data)
            } else {
                const data ={
                    product_id: product_name_selected.value
                }
                getData(data)
            }

            console.log('main_product_name_selected', main_product_name_selected.value)
            console.log('product_name_selected', product_name_selected.value)
        }
        return {
            tableData,
            widthdrawDetail,
            handleDelete,
            handleOk,
            product_type,
            options,
            suboptions,
            addoptions,
            main_product_name_selected,
            product_name_selected,
            getProductAndDataList,
            getDataById
        };
    },
    methods: {
        withdrawDetail(id) {
            this.$router.push({
                name: "userdetail",
                params: { wechat_user_id: id },
            });
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
