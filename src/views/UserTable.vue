<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>风控系统</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select
          v-model="main_product_name_selected"
          placeholder="一级游戏"
          class="m-2"
          @change="getProductAndDataList"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.main_product_name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="product_name_selected"
          placeholder="二级游戏"
          class="m-2"
          @change="getDataById"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in suboptions"
            :key="item.product_id"
            :label="item.product_name"
            :value="item.product_id"
          />
        </el-select>
        <el-input
          v-model="idnicknamephonemobile"
          @input="searchByIdNickNameIpMobile"
          style="width: 200px"
          class="w-50 m-2"
          placeholder="请输入id/用户名/手机号/ip"
        />&nbsp;&nbsp;
        <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
        <el-button type="primary" @click="withDraw()">提现设置</el-button>
        <el-button type="primary" @click="blackList()">查看黑名单</el-button>
        <el-button type="primary" @click="userFeedback()">用户反馈</el-button>
        <el-button type="primary" @click="exportExcel()">导出Excel</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="main_product_name"
          label="一级游戏"
        ></el-table-column>
        <el-table-column prop="product_name" label="二级游戏"></el-table-column>
        <el-table-column prop="id" label="用户id"></el-table-column>
        <el-table-column prop="oaid" label="数盟id"></el-table-column>
        <el-table-column prop="nickname" label="用户名"></el-table-column>
        <el-table-column prop="tel" label="手机号"></el-table-column>
        <el-table-column prop="reward" label="累积佣金"></el-table-column>
        <el-table-column
          prop="withdraw_reward"
          label="已提现佣金"
        ></el-table-column>
        <el-table-column
          prop="withdraw_times"
          label="已提现次数"
        ></el-table-column>
        <el-table-column prop="ip" label="注册ip"></el-table-column>
        <el-table-column prop="ip_address" label="ip地址"></el-table-column>
        <el-table-column prop="created_at" label="注册时间"></el-table-column>
        <!-- <el-table-column
          prop="bind_account_count"
          label="关联账号数"
        ></el-table-column>
        <el-table-column prop="illegal_time" label="拉黑时间"></el-table-column> -->
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-link"
              @click="userDetail(scope.row.id)"
              >详情
            </el-button>
            <el-button
              type="text"
              v-show="scope.row.blacklisted != 1"
              icon="el-icon-delete"
              class="red"
              @click="addBlackList(scope.row.id)"
            >
              加入黑名单
            </el-button>
            <el-button
              type="text"
              v-show="scope.row.blacklisted == 1"
              icon="el-icon-edit"
              @click="removeBlackList(scope.row.id)"
            >
              移出黑名单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { Search } from "@element-plus/icons";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchMainProductList, fetchProductList } from "../api/product";
import { fetchUserListData, addBlacklist, removeBlacklist } from "../api/user";
import moment from "moment";
import * as XLSX from "xlsx"; // Vue3 版本
// import table from "../mock/table.json";
const main_product_name_selected = ref("");
const product_name_selected = ref("");
// check_main_product_name: 0:编缉和删除的是一级产品;1:编辑和删除的是二级产品
const check_main_product_name = ref(0);
const tableData = ref([]);
const pageTotal = ref(0);
const idnicknamephonemobile = ref("");
const main_product_value_select = ref("");
const product_type = ref("一级游戏");
let options = ref([]);
let suboptions = ref([]);

/*
    * @description:
    * @param {Object} json 服务端发过来的数据
    * @param {String} name 导出Excel文件名字
   
    * @param {String} titleArr 导出Excel表头
   
    * @param {String} sheetName 导出sheetName名字
    * @return:
    */
const exportExcelData = (json, name, titleArr, sheetName) => {
  /* convert state to workbook */
  var data = new Array();
  var keyArray = new Array();
  const getLength = function (obj) {
    var count = 0;
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  };
  for (const key1 in json) {
    if (json.hasOwnProperty(key1)) {
      const element = json[key1];
      var rowDataArray = new Array();
      for (const key2 in element) {
        if (element.hasOwnProperty(key2)) {
          const element2 = element[key2];
          rowDataArray.push(element2);
          if (keyArray.length < getLength(element)) {
            keyArray.push(key2);
          }
        }
      }
      data.push(rowDataArray);
    }
  }
  // keyArray为英文字段表头
  data.splice(0, 0, keyArray, titleArr);
  console.log("data", data);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  // 此处隐藏英文字段表头
  var wsrows = [{ hidden: true }];
  ws["!rows"] = wsrows; // ws - worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* generate file and send to client */
  XLSX.writeFile(wb, name + ".xlsx");
};

// 获取用户列表数据
const getUserListData = (data) => {
  fetchUserListData(data)
    .then((res) => {
      if(res.status ==200){
        tableData.value = res.data.map((item) => {
        return {
          ...item,
          created_at: moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      }else{
            if(res.message){
                ElMessage.error(res.message);
            }else{
                ElMessage.error('后端api接口异常！');
            }
        }
      
    })
    .catch(() => {});
};
//获取一级游戏产品信息
const getProductDataList = () => {
  fetchMainProductList()
    .then((res) => {
      console.log("getProductDataList", res.data);
      options.value = res.data;
      console.log("options.value", options.value);
    })
    .catch(() => {
      //   ElMessage.error("服务器异常！");
    });
};
//根据一级游戏获取二级游戏产品信息
const getSubProductDataList = (query) => {
  const data = {
    main_product_id: query,
  };
  fetchProductList(data)
    .then((res) => {
      console.log("getSubProductDataList", res.data);
      suboptions.value = res.data;
      console.log("suboptions.value", suboptions.value);
    })
    .catch(() => {
      //   ElMessage.error("服务器异常！");
    });
};
//加入黑名单禁止登录
const addBlackListData = (id) => {
  addBlacklist(id)
    .then((res) => {
      if (res.status == 200) {
        ElMessage.success("加入黑名单成功！");
        getUserListData();
      }
    })
    .catch(() => {
      //   ElMessage.error("服务器异常！");
    });
};
//移出黑名单禁止登录
const removeBlackListData = (id) => {
  removeBlacklist(id)
    .then((res) => {
      if (res.status == 200) {
        ElMessage.success("移出黑名单成功！");
        getUserListData();
      }
    })
    .catch(() => {
      //   ElMessage.error("服务器异常！");
    });
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
    //获取一级游戏
    getProductDataList();
    //获取用户列表
    getUserListData();

    // 加入黑名单禁止登录
    const addBlackList = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定加入黑名单？", "提示", {
        type: "warning",
      })
        .then(() => {
          addBlackListData(id);
        })
        .catch(() => {});
    };
    // 加入黑名单禁止登录
    const removeBlackList = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定移出黑名单？", "提示", {
        type: "warning",
      })
        .then(() => {
          removeBlackListData(id);
        })
        .catch(() => {});
    };
    const getProductAndDataList = () => {
      product_name_selected.value = '';
      suboptions.value = ''
      console.log(
        "main_product_name_selected.value",
        main_product_name_selected.value
      );
      //获取二级游戏列表
      if (main_product_name_selected.value == -1) {
        getUserListData();
      } else {
        const data = {
          main_product_id: main_product_name_selected.value,
        };
        getUserListData(data);
        getSubProductDataList(main_product_name_selected.value)
      }

      console.log(
        "main_product_name_selected",
        main_product_name_selected.value
      );
    };
    const getDataById = () => {
      //通过二级游戏id获取对应用户列表
      if (product_name_selected.value == -1) {
        const data = {
          main_product_id: main_product_name_selected.value,
        };
        getUserListData(data);
      } else {
        const data = {
          product_id: product_name_selected.value,
        };
        getUserListData(data);
      }

      console.log(
        "main_product_name_selected",
        main_product_name_selected.value
      );
      console.log("product_name_selected", product_name_selected.value);
    };
    const searchByIdNickNameIpMobile = () => {
      const data = {
        id: idnicknamephonemobile.value,
        nickname: idnicknamephonemobile.value,
        ip: idnicknamephonemobile.value,
        tel: idnicknamephonemobile.value,
      };
      // getUserListData(data)
      if (idnicknamephonemobile.value) {
        tableData.value = tableData.value
          .filter((item) => {
            if (checkNonnegative(idnicknamephonemobile.value))
              return (
                JSON.stringify(item.id).indexOf(idnicknamephonemobile.value) !=
                -1
              );
            else
              return (
                JSON.stringify(item).indexOf(idnicknamephonemobile.value) != -1
              );
          })
          .map((item) => {
            return {
              ...item,
              created_at: moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
            };
          });
      } else {
        getUserListData();
      }
    };
    return {
      tableData,
      removeBlackList,
      addBlackList,
      product_type,
      Search,
      checkNonnegative,
      searchByIdNickNameIpMobile,
      idnicknamephonemobile,
      options,
      suboptions,
      main_product_name_selected,
      product_name_selected,
      main_product_value_select,
      check_main_product_name,
      getProductAndDataList,
      getDataById,
    };
  },
  methods: {
    withDraw() {
      this.$router.push("/withdraw");
    },
    userDetail(id) {
      this.$router.push({
        name: "userdetail",
        params: { wechat_user_id: id },
      });
    },
    blackList() {
      this.$router.push("/blacklist");
    },
    userFeedback() {
      this.$router.push("/feedback");
    },
    exportExcel() {
      //表头中文名
      const titleArr = [
        "一级游戏",
        "二级游戏",
        "用户id",
        "数盟id",
        "用户名",
        "手机号",
        "累积佣金",
        "已提现佣金",
        "已提现次数",
        "注册ip",
        "ip地址",
        "注册时间",
      ];
      const data = tableData.value.map((item) => {
          return {
         main_product_name:item.main_product_name,
         product_name:item.product_name,
         id:item.id,
         oaid:item.oaid,
         nickname:item.nickname,
         tel:item.tel,
         reward:item.reward,
         withdraw_reward:item.withdraw_reward,
         withdraw_times:item.withdraw_times,
         ip:item.ip,
         ip_address:item.ip_address,
         created_at:item.created_at
      };
        });
      exportExcelData(data, "UserTable", titleArr, "UserTable");
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
