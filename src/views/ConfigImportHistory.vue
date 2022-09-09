<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 规则配置表导入
                </el-breadcrumb-item>
                <el-breadcrumb-item>配置表导入</el-breadcrumb-item>
                <el-breadcrumb-item>配置表导入历史</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="titlehead">
            <h2 style="marginRight:20px ;fontWeight:500">配置表导入历史</h2>
            <div class="handle-box">
                游戏选择: <el-select @change="query_channel" style="width:150px" v-model="product_name_selected"
                    placeholder="游戏选择" class="m-2">
                    <el-option v-for="item in productoptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>&nbsp;
                渠道选择: <el-select @change="query_version" style="width:150px" v-model="channel_name_selected"
                    placeholder="选择渠道" class="m-2">
                    <el-option value="" label="全部" key="-1"></el-option>
                    <el-option v-for="item in channeloptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>&nbsp;
                版本选择: <el-select @change="handle_version" style="width:150px" v-model="version_name_selected" placeholder="全部版本"  class="m-2">
                    <el-option value="" label="全部" key="-1"></el-option>
                    <el-option v-for="item in versionoptions" :key="item.value" :label="item.label_name"
                        :value="item.value" />
                </el-select>
            </div>
            <el-button type="primary" style="margin-left:100px" @click="goBack">返回</el-button>
        </div>
        <div class="container">
            <div class="handle-selecter">
                <div class="selecter-item">
                    <span>导入时间：</span>
                    <el-date-picker
                        v-model="dateSelect"
                        type="daterange"
                        range-separator="→"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="handleDateSelect"
                    />
                </div>
                <div class="selecter-item">
                    <span>导入状态：</span>
                    <el-select style="width:200px" v-model="status" placeholder="选择状态" @change="handleStatus" class="m-2">
                        <el-option v-for="item in import_status" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                </div>
                <div class="selecter-item">
                    <span>操作人：</span>
                    <el-select style="width:200px" v-model="operator" disabled placeholder="此功能暂不可用" class="m-2">
                        <el-option v-for="item in versionoptions" :key="item.value" 
                        :value="item.value" />
                    </el-select>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" empty-text="暂无数据">
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
                <el-table-column prop="user_name"  label="操作人员"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page_index"
                :page-size="query.page_size" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { ref,reactive} from 'vue';
import { useRouter ,useRoute} from 'vue-router';
import {
    fetchCommonResultData,
} from "../api/video";
import moment from "moment";
import {
    fetchVersionProductChannelData,
} from "../api/product";
const product_name_selected = ref('')
const channel_name_selected = ref('')
const version_name_selected = ref('')
const productoptions = ref("");
const channeloptions = ref("");
const versionoptions = ref("");
const tableData = ref();
const query=reactive({
    page_index:1,
    page_size:10,
})
const pageTotal=ref(1);
const dateSelect=ref();
const status=ref("");
const operator=ref();
const import_status=ref([
    {
        value:"",
        label:"全部"
    },{
        value:"1",
        label:"导入成功"
    },{
        value:"0",
        label:"导入失败"
    }
])


//获取游戏版本渠道信息
const getVersionProductChannelData = () => {
    fetchVersionProductChannelData().then((res) => {
        console.log("fetchVersionProductChannelData", res.data);
        productoptions.value = res.data
        product_name_selected.value=res.data[0].value
    }).catch(() => {
        // ElMessage.error("服务器异常！");
    });
};
//根据游戏获取渠道
const query_channel = (val) => {
    channel_name_selected.value = ''
    version_name_selected.value = ''
    delete query.channel
    delete query.versions
    channeloptions.value = productoptions.value.filter((column) => column.value == product_name_selected.value
    )[0].children
    console.log('query_channel',val);
    query.product_id=val
    fetchImportResultData(query)
}
//根据渠道获取版本
const query_version = (val) => {
    version_name_selected.value = ''
    delete query.versions
    if(val!=""){
        versionoptions.value = channeloptions.value.filter((column) => column.value == channel_name_selected.value)[0].children;
        query.channel=val
    }else{
        delete query.channel;
    }
    console.log('query_version',val);
    fetchImportResultData(query)
}
//版本选择
const handle_version=(val)=>{
    console.log("handle_version",val);
    if(val!=""){
        query.versions=val
    }else{
        delete query.versions
    }
    
    fetchImportResultData(query)
}
//导入结果查询
const fetchImportResultData = (data) => {
    fetchCommonResultData(data)
        .then((res) => {
            console.log(res.data);
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


//时间选择
const handleDateSelect=(val)=>{
    console.log(val);
    if(val!=null){
        let startDate=moment(val[0]).format("YYYY-MM-DD HH:mm:ss")
        let endDate=moment(val[1]).format("YYYY-MM-DD HH:mm:ss")
        console.log(startDate,endDate);
        query.start_time=startDate;
        query.end_time=endDate
    }else{
        delete query.start_time
        delete query.end_time
    }
    fetchImportResultData(query)
}

//状态改变
const handleStatus=(val)=>{
    status.value=val
    if(val==""){
        delete query.status
    }else{
        query.status=val
    }
    console.log(val);
    fetchImportResultData(query)
}


export default {
    setup () {
    //从流量商业化B端加载版本游戏渠道数据
    delete query.product_id
    delete query.channel
    delete query.versions
    console.log('environment', process.env.NODE_ENV)
    const router=useRouter()
    const route=useRoute()
    //通过localStorage获取游戏版本渠道信息
    if(localStorage.getItem('productoptions')!=null){
        productoptions.value=JSON.parse(localStorage.getItem('productoptions'))
        product_name_selected.value=productoptions.value[0].value
        query.product_id=productoptions.value[0].value
        channeloptions.value=JSON.parse(localStorage.getItem('channeloptions'))
        versionoptions.value=JSON.parse(localStorage.getItem('versionoptions'))
    }else{
        //通过请求方式获取游戏版本渠道信息
        console.log("通过请求方式获取游戏版本渠道信息");
        getVersionProductChannelData()
    }
    

    // if(route.params.version_name_selected){
    //     product_name_selected.value=route.params.product_name_selected;
    //     channel_name_selected.value=route.params.channel_name_selected;
    //     version_name_selected.value=route.params.version_name_selected;
    
    //     query.product_id=route.params.product_name_selected;
    //     query.channel=route.params.channel_name_selected;
    //     query.versions=route.params.version_name_selected;
    // }else if(route.params.channel_name_selected){
    //     product_name_selected.value=route.params.product_name_selected;
    //     channel_name_selected.value=route.params.channel_name_selected;
       

    //     query.product_id=route.params.product_name_selected;
    //     query.channel=route.params.channel_name_selected;
    // }else if(product_name_selected.value=route.params.product_name_selected){
    //     product_name_selected.value=route.params.product_name_selected;

    //     query.product_id=route.params.product_name_selected;
    // }
    console.log(productoptions.value);
    fetchImportResultData(query)
   


//返回按钮
const goBack=()=>{
    product_name_selected.value="";
    channel_name_selected.value="";
    version_name_selected.value="";
    status.value="";
    dateSelect.value=null;
    localStorage.removeItem('productoptions')
    localStorage.removeItem('channeloptions')
    localStorage.removeItem('versionoptions')
    router.go(-1)
}




console.log(tableData.value);

        return {
            product_name_selected,
            channel_name_selected,
            version_name_selected,
            productoptions,
            channeloptions,
            versionoptions,
            tableData,
            query,
            pageTotal,
            import_status,
            status,
            dateSelect,
            operator,
            getVersionProductChannelData,
            query_channel,
            query_version,
            fetchImportResultData,
            handlePageChange,
            handleStatus,
            handleDateSelect,
            goBack,
            handle_version
        }
    }
}
</script>

<style  scoped>
    .titlehead{
        background-color:#fff;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
    }

     .handle-selecter{
        display: flex;
        align-items: center;
        justify-content:space-around;
        margin-bottom: 20px;
     }

     /* .pagination{
        position: absolute;
        left: 0;
        top: 0;
     } */
</style>