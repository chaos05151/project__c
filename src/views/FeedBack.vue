<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>风控系统</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
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
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="main_product_id" sortable label="父游戏ID"></el-table-column>
                <el-table-column prop="main_product_name" label="父游戏"></el-table-column>
                <el-table-column prop="product_id" label="子游戏ID"></el-table-column>
                <el-table-column prop="product_name" label="子游戏"></el-table-column>
                <el-table-column prop="nickname" label="用户名字"></el-table-column>
                <el-table-column prop="tel" label="电话"></el-table-column>
                <el-table-column label="反馈详情" width="220" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-link"
                            @click="feedBackDetail(scope.row.uid)">详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
    fetchFeedBackData
} from "../api/user";
const main_product_name_selected = ref('')
const product_name_selected = ref('')
// check_main_product_name: 0:编缉和删除的是一级产品;1:编辑和删除的是二级产品
const check_main_product_name = ref(0)
const tableData = ref([]);
const pageTotal = ref(0);
const main_product_value_select = ref('')
const product_type = ref("一级游戏");
let options = ref([]);
let suboptions = ref([]);
const form = reactive({
});

// 获取用户反馈
const getData = (data) => {
    fetchFeedBackData(data).then((res) => {
        console.log("getData", res.data);
        tableData.value = res.data;
    }).catch(() => {
        
    });
};
// 获取具体的二级产品
const getSubDataById = (product_id) => {
    fetchProductTableDataById(product_id).then((res) => {
        console.log("getSubDataById", res.data);
    }).catch(() => {
        
    });
};
//获取一级游戏产品信息
const getProductDataList = () => {
    fetchMainProductList().then((res) => {
        console.log("getProductDataList", res.data);
        options.value = res.data;
        console.log('options.value', options.value)
    }).catch(() => {
        
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
        tableData.value = res.data;
        console.log('suboptions.value', suboptions.value)
    }).catch(() => {
        
    });
};
export default {
    name: "basetable",
    setup() {
        getData();
        getProductDataList();
        const getProductAndDataList = () => {
            product_name_selected.value = ''
            suboptions.value = ''
            console.log('main_product_name_selected.value', main_product_name_selected.value)
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
            form,
            tableData,
            product_type,
            options,
            suboptions,
            main_product_name_selected,
            product_name_selected,
            main_product_value_select,
            check_main_product_name,
            getProductAndDataList,
            getDataById
        };
    },
    methods: {
        feedBackDetail(id) {
            this.$router.push({
                name: "feedbackdetail",
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
