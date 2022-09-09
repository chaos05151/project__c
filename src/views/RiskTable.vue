<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>风控系统</el-breadcrumb-item>
        <el-breadcrumb-item>风控配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- 一级游戏:&nbsp;&nbsp; -->
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
          /> </el-select
        >&nbsp;&nbsp;
        <el-button
          v-show="showDeviceLogin && whichTab == 0"
          type="primary"
          @click="deviceLoginShow = true"
        >
          全局配置
        </el-button>
        <el-button
          v-show="showWechatBind && whichTab == 1"
          type="primary"
          @click="wechatBindShow = true"
        >
          全局配置
        </el-button>
        <el-button
          v-show="showRealName && whichTab == 2"
          type="primary"
          @click="realNameShow = true"
        >
          全局配置
        </el-button>
        <el-button
          v-show="showPhoneBind && whichTab == 3"
          type="primary"
          @click="phoneBindShow = true"
        >
          全局配置
        </el-button>
        <el-button
          v-show="showPrivacy && whichTab == 4"
          type="primary"
          @click="privacyShow = true"
        >
          全局配置
        </el-button>
        <el-button type="primary" @click="addRule"> 新增项目 </el-button>
        <el-drawer
          v-model="deviceLoginShow"
          title="设备登录限制全局配置信息："
          direction="rtl"
          size="50%"
        >
          <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="280px"
          >
            <el-form-item label="允许模拟器登录" prop="simulator_login_status">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.simulator_login_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="允许多开设备登录"
              prop="more_open_login_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.more_open_login_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="允许异常设备登录"
              prop="exception_login_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.exception_login_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="单设备允许登录账号数"
              prop="one_device_login_num"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.one_device_login_num"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="允许模拟器设备看广告"
              prop="simulator_watch_advertisement_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.simulator_watch_advertisement_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="允许多开设备看广告"
              prop="more_open_watch_advertisement_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.more_open_watch_advertisement_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="允许异常设备看广告"
              prop="exception_device_watch_advertisement_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.exception_device_watch_advertisement_status"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="异常设备观看广告数量"
              prop="exception_device_watch_advertisement_num"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.exception_device_watch_advertisement_num"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="appoint_time">
              <el-input
                disabled
                style="width: 300px"
                v-model="form.appoint_time"
              />
            </el-form-item>
          </el-form>
        </el-drawer>
        <el-drawer
          v-model="wechatBindShow"
          title="微信账号绑定全局配置信息："
          direction="rtl"
          size="50%"
        >
          <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="280px"
          >
            <el-form-item label="最多绑定数量" prop="account_bind_num">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.account_bind_num"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="每日提现次数" prop="one_day_withdrawal_count">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.one_day_withdrawal_count"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="appoint_time">
              <el-input
                disabled
                style="width: 300px"
                v-model="form.appoint_time"
              />
            </el-form-item>
          </el-form>
        </el-drawer>
        <el-drawer
          v-model="realNameShow"
          title="实名认证&防沉迷全局配置信息："
          direction="rtl"
          size="50%"
        >
          <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="280px"
          >
            <el-form-item
              label="是否开启实名认证"
              prop="open_real_name_authentication_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.open_real_name_authentication_status"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="实名认证节点"
              prop="real_name_authentication_node"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.real_name_authentication_node"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="实名认证接口"
              prop="real_name_authentication_api"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.real_name_authentication_api"
              ></el-input>
            </el-form-item>
            <el-form-item label="阿里云接口" prop="aliyun_app_code">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.aliyun_app_code"
              ></el-input>
            </el-form-item>
            <el-form-item label="防沉迷开启" prop="anti_addiction_status">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.anti_addiction_status"
              ></el-input>
            </el-form-item>
            <el-form-item label="开启条件" prop="anti_addiction_open_condition">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.anti_addiction_open_condition"
              ></el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="appoint_time">
              <el-input
                disabled
                style="width: 300px"
                v-model="form.appoint_time"
              />
            </el-form-item>
          </el-form>
        </el-drawer>
        <el-drawer
          v-model="phoneBindShow"
          title="手机绑定全局配置信息："
          direction="rtl"
          size="50%"
        >
          <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="280px"
          >
            <el-form-item
              label="是否开启手机绑定"
              prop="mobile_phone_bind_status"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.mobile_phone_bind_status"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="手机绑定条件"
              prop="mobile_phone_bind_condition"
            >
              <el-input
                disabled
                style="width: 150px"
                v-model="form.mobile_phone_bind_condition"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="appoint_time">
              <el-input
                disabled
                style="width: 300px"
                v-model="form.appoint_time"
              />
            </el-form-item>
          </el-form>
        </el-drawer>
        <el-drawer
          v-model="privacyShow"
          title="隐私协议全局配置信息："
          direction="rtl"
          size="50%"
        >
          <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="280px"
          >
            <el-form-item label="用户协议" prop="user_agreement_url">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.user_agreement_url"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="隐私协议" prop="privacy_agreement_url">
              <el-input
                disabled
                style="width: 150px"
                v-model="form.privacy_agreement_url"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="appoint_time">
              <el-input
                disabled
                style="width: 300px"
                v-model="form.appoint_time"
              />
            </el-form-item>
          </el-form>
        </el-drawer>
      </div>
      <!-- <el-button type="primary" style='position: absolute;right:10px;top:1px;'>添加规则</el-button> -->
      <div>
        <el-tabs
          v-model="message"
          type="border-card"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="设备登录限制" name="first">
            <el-table :data="tableDataAAAA" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in tableHeaderFirstTab"
                :key="item.prop"
              >
                <template #default="scope">
                  <div
                    v-show="item.editable || scope.row.editable"
                    class="editable-row"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        :disabled="item.isedited"
                        v-show="item.show"
                        size="small"
                        v-model="scope.row[item.prop]"
                        :placeholder="`请输入${item.label}`"
                      />
                    </template>
                  </div>
                  <div
                    v-show="!item.editable && !scope.row.editable"
                    class="editable-row"
                  >
                    <span class="editable-row-span">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDeviceLoginEdit(scope.row.id, scope.row)"
                    >编辑
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDeviceLoginDelete(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="微信账号绑定" name="second">
            <el-table :data="tableDataBBBB" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in tableHeaderSecondTab"
                :key="item.prop"
              >
                <template #default="scope">
                  <div
                    v-show="item.editable || scope.row.editable"
                    class="editable-row"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        :disabled="item.isedited"
                        size="small"
                        v-model="scope.row[item.prop]"
                        :placeholder="`请输入${item.label}`"
                      />
                    </template>
                  </div>
                  <div
                    v-show="!item.editable && !scope.row.editable"
                    class="editable-row"
                  >
                    <span class="editable-row-span">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleWechatBindEdit(scope.row.id, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleWechatBindDelete(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="实名认证&防沉迷" name="third">
            <el-table :data="tableDataCCCC" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in tableHeaderThirdTab"
                :key="item.prop"
              >
                <template #default="scope">
                  <div
                    v-show="item.editable || scope.row.editable"
                    class="editable-row"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        :disabled="item.isedited"
                        size="small"
                        v-model="scope.row[item.prop]"
                        :placeholder="`请输入${item.label}`"
                      />
                    </template>
                  </div>
                  <div
                    v-show="!item.editable && !scope.row.editable"
                    class="editable-row"
                  >
                    <span class="editable-row-span">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleRealNameEdit(scope.row.id, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleRealNameDelete(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="手机绑定" name="four">
            <el-table :data="tableDataDDDD" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in tableHeaderFourTab"
                :key="item.prop"
              >
                <template #default="scope">
                  <div
                    v-show="item.editable || scope.row.editable"
                    class="editable-row"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        :disabled="item.isedited"
                        size="small"
                        v-model="scope.row[item.prop]"
                        :placeholder="`请输入${item.label}`"
                      />
                    </template>
                  </div>
                  <div
                    v-show="!item.editable && !scope.row.editable"
                    class="editable-row"
                  >
                    <span class="editable-row-span">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handlePhoneBindEdit(scope.row.id, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handlePhoneBindDelete(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="隐私协议" name="five">
            <el-table :data="tableDataEEEE" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in tableHeaderFiveTab"
                :key="item.prop"
              >
                <template #default="scope">
                  <div
                    v-show="item.editable || scope.row.editable"
                    class="editable-row"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        :disabled="item.isedited"
                        size="small"
                        v-model="scope.row[item.prop]"
                        :placeholder="`请输入${item.label}`"
                      />
                    </template>
                  </div>
                  <div
                    v-show="!item.editable && !scope.row.editable"
                    class="editable-row"
                  >
                    <span class="editable-row-span">{{
                      scope.row[item.prop]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handlePrivacyEdit(scope.row.id, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handlePrivacyDelete(scope.row.id)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import riskjson from "../config/risk.json";
import { fetchMainProductList } from "../api/product";
import {
  fetchDeviceLoginTableData,
  fetchWechatBindTableData,
  fetchPrivacyTableData,
  fetchRealNameTableData,
  fetchPhoneBindTableData,
  deleteDeviceLogin,
  deleteWechatBind,
  deleteRealName,
  deletePhoneBind,
  deletePrivacy,
} from "../api/risk";
import moment from "moment";
const main_product_name_selected = ref("");
const formRef = ref(null);
const whichTab = ref(0);
const message = ref("first");
let options = ref([]);
const deviceLoginShow = ref(false);
const wechatBindShow = ref(false);
const phoneBindShow = ref(false);
const realNameShow = ref(false);
const privacyShow = ref(false);
const showDeviceLogin = ref(false);
const showWechatBind = ref(false);
const showPhoneBind = ref(false);
const showRealName = ref(false);
const showPrivacy = ref(false);
const form = reactive({});
const tableDataAAAA = ref([]);
const tableDataBBBB = ref([]);
const tableDataCCCC = ref([]);
const tableDataDDDD = ref([]);
const tableDataEEEE = ref([]);
const tableHeaderFirstTab = riskjson.RiskHeaderFirstTab.filter(
  (column) => column.show
);
const tableHeaderSecondTab = riskjson.RiskHeaderSecondTab.filter(
  (column) => column.show
);
const tableHeaderThirdTab = riskjson.RiskHeaderThirdTab.filter(
  (column) => column.show
);
const tableHeaderFourTab = riskjson.RiskHeaderFourTab.filter(
  (column) => column.show
);
const tableHeaderFiveTab = riskjson.RiskHeaderFiveTab.filter(
  (column) => column.show
);
//数字状态值转换：0：不允许；1：允许
const convertNumToString = (idValue) => {
  if (idValue == 1) return "允许";
  if (idValue == 0) return "不允许";
};
//获取一级游戏产品信息 select框
const getProductDataList = () => {
  fetchMainProductList()
    .then((res) => {
      console.log("getProductDataList", res.data);
      options.value = res.data;
      console.log("options.value", options.value);
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取设备登录信息所有数据
const getDeviceLoginDataList = () => {
  fetchDeviceLoginTableData()
    .then((res) => {
      if(res.status ==200){
//config_type:0,全局配置;1,单个产品配置
      //表格数据展示单个产品的配置
      tableDataAAAA.value = res.data
        .filter((column) => column.config_type != 0)
        .map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
            simulator_login_status:
              item.simulator_login_status == 1 ? "允许" : "不允许",
            more_open_login_status:
              item.more_open_login_status == 1 ? "允许" : "不允许",
            exception_login_status:
              item.exception_login_status == 1 ? "允许" : "不允许",
            simulator_watch_advertisement_status:
              item.simulator_watch_advertisement_status == 1
                ? "允许"
                : "不允许",
            more_open_watch_advertisement_status:
              item.more_open_watch_advertisement_status == 1
                ? "允许"
                : "不允许"
          };
        });
      //全局配置信息不展现在表格中
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showDeviceLogin.value = true;
        form.appoint_time = form.value.appoint_time;
        form.one_device_login_num = form.value.one_device_login_num;
        form.exception_device_watch_advertisement_num =
          form.value.exception_device_watch_advertisement_num;
        form.simulator_login_status = convertNumToString(
          form.value.simulator_login_status
        );
        form.more_open_login_status = convertNumToString(
          form.value.more_open_login_status
        );
        form.exception_login_status = convertNumToString(
          form.value.exception_login_status
        );
        form.simulator_watch_advertisement_status = convertNumToString(
          form.value.simulator_watch_advertisement_status
        );
        form.more_open_watch_advertisement_status = convertNumToString(
          form.value.more_open_watch_advertisement_status
        );
        form.exception_device_watch_advertisement_status = convertNumToString(
          form.value.exception_device_watch_advertisement_status
        );
      }
      }else{
            if(res.message){
                ElMessage.error(res.message);
            }else{
                ElMessage.error('后端api接口异常！');
            }
        }
      
    })
    .catch(() => {
      ElMessage.error("服务器异常！");
    });
};
//获取设备登录信息所对应的一级游戏数据
const getSelectedDeviceLoginDataList = (main_product_id) => {
  const data = {
    main_product_id,
  };
  fetchDeviceLoginTableData(data)
    .then((res) => {
      console.log("getSelectedDeviceLoginDataList", res.data);
      tableDataAAAA.value = res.data
        .filter((column) => column.config_type != 0)
        .map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
            simulator_login_status:
              item.simulator_login_status == 1 ? "允许" : "不允许",
            more_open_login_status:
              item.more_open_login_status == 1 ? "允许" : "不允许",
            exception_login_status:
              item.exception_login_status == 1 ? "允许" : "不允许",
            simulator_watch_advertisement_status:
              item.simulator_watch_advertisement_status == 1
                ? "允许"
                : "不允许",
            more_open_watch_advertisement_status:
              item.more_open_watch_advertisement_status == 1
                ? "允许"
                : "不允许"
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showDeviceLogin.value = true;
        form.appoint_time = form.value.appoint_time;
        form.one_device_login_num = form.value.one_device_login_num;
        form.exception_device_watch_advertisement_num =
          form.value.exception_device_watch_advertisement_num;
        form.simulator_login_status = convertNumToString(
          form.value.simulator_login_status
        );
        form.more_open_login_status = convertNumToString(
          form.value.more_open_login_status
        );
        form.exception_login_status = convertNumToString(
          form.value.exception_login_status
        );
        form.simulator_watch_advertisement_status = convertNumToString(
          form.value.simulator_watch_advertisement_status
        );
        form.more_open_watch_advertisement_status = convertNumToString(
          form.value.more_open_watch_advertisement_status
        );
        form.exception_device_watch_advertisement_status = convertNumToString(
          form.value.exception_device_watch_advertisement_status
        );
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取微信账号绑定所有数据
const getWechatBindDataList = () => {
  fetchWechatBindTableData()
    .then((res) => {
      console.log("getWechatBindDataList", res.data);
      tableDataBBBB.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      console.log("wechatbind form.value", form.value);
      if (form.value.config_type == 0) {
        showWechatBind.value = true;
        form.account_bind_num = form.value.account_bind_num;
        form.one_day_withdrawal_count = form.value.one_day_withdrawal_count;
        form.appoint_time = form.value.appoint_time;
      }
      console.log("tableDataBBBB.value", tableDataBBBB.value);
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取微信账号绑定所对应的一级游戏数据
const getSelectedWechatBindDataList = (main_product_id) => {
  const data = {
    main_product_id,
  };
  fetchWechatBindTableData(data)
    .then((res) => {
      console.log("getSelectedWechatBindDataList", res.data);
      tableDataBBBB.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      console.log("wechatbind form.value", form.value);
      if (form.value.config_type == 0) {
        showWechatBind.value = true;
        form.account_bind_num = form.value.account_bind_num;
        form.one_day_withdrawal_count = form.value.one_day_withdrawal_count;
        form.appoint_time = form.value.appoint_time;
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//实名认证&防沉迷
const getRealNameDataList = () => {
  fetchRealNameTableData()
    .then((res) => {
      console.log("getRealNameDataList", res.data);
      tableDataCCCC.value = res.data
        .filter((column) => column.config_type != 0)
        .map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
            open_real_name_authentication_status:
            item.open_real_name_authentication_status == 1
                ? "不开启"
                : item.open_real_name_authentication_status == 2
                ? "开启(非强制)"
                : "开启(强制)",
            real_name_authentication_node:
              item.real_name_authentication_node == 1
                ? "登录前"
                : item.anti_addiction_open_condition == 2
                ? "登录成功XX后"
                : item.anti_addiction_open_condition == 3
                ? "提现X次后"
                : "绑定微信后第二次登录",
            anti_addiction_status:
              item.anti_addiction_status == 1
                ? "关闭"
                : item.anti_addiction_status == 2
                ? "部分开启"
                : "全部开启",
            anti_addiction_open_condition:
              item.anti_addiction_open_condition == 1
                ? "所有用户"
                : item.anti_addiction_open_condition == 2
                ? "新用户"
                : "老用户",
            real_name_authentication_api:
              item.real_name_authentication_api == 1 ? "阿里云" : "中宣部"
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showRealName.value = true;
        form.open_real_name_authentication_status=
            form.value.open_real_name_authentication_status == 1
                ? "不开启"
                : form.value.open_real_name_authentication_status == 2
                ? "开启(非强制)"
                : "开启(强制)";
            form.real_name_authentication_node=
              form.value.real_name_authentication_node == 1
                ? "登录前"
                : form.value.anti_addiction_open_condition == 2
                ? "登录成功XX后"
                : form.value.anti_addiction_open_condition == 3
                ? "提现X次后"
                : "绑定微信后第二次登录";
            form.anti_addiction_status=
              form.value.anti_addiction_status == 1
                ? "关闭"
                : form.value.anti_addiction_status == 2
                ? "部分开启"
                : "全部开启";
            form.anti_addiction_open_condition=
              form.value.anti_addiction_open_condition == 1
                ? "所有用户"
                : form.value.anti_addiction_open_condition == 2
                ? "新用户"
                : "老用户";
            form.real_name_authentication_api=
              form.value.real_name_authentication_api == 1 ? "阿里云" : "中宣部";
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取实名认证&防沉迷所对应的一级游戏数据
const getSelectedRealNameList = (main_product_id) => {
  const data = {
    main_product_id,
  };
  fetchRealNameTableData(data)
    .then((res) => {
      console.log("getSelectedRealNameList", res.data);
      tableDataCCCC.value = res.data
        .filter((column) => column.config_type != 0)
        .map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
            open_real_name_authentication_status:
            item.open_real_name_authentication_status == 1
                ? "不开启"
                : item.open_real_name_authentication_status == 2
                ? "开启(非强制)"
                : "开启(强制)",
            real_name_authentication_node:
              item.real_name_authentication_node == 1
                ? "登录前"
                : item.anti_addiction_open_condition == 2
                ? "登录成功XX后"
                : item.anti_addiction_open_condition == 3
                ? "提现X次后"
                : "绑定微信后第二次登录",
            anti_addiction_status:
              item.anti_addiction_status == 1
                ? "关闭"
                : item.anti_addiction_status == 2
                ? "部分开启"
                : "全部开启",
            anti_addiction_open_condition:
              item.anti_addiction_open_condition == 1
                ? "所有用户"
                : item.anti_addiction_open_condition == 2
                ? "新用户"
                : "老用户",
            real_name_authentication_api:
              item.real_name_authentication_api == 1 ? "阿里云" : "中宣部"
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showRealName.value = true;
        form.open_real_name_authentication_status=
            form.value.open_real_name_authentication_status == 1
                ? "不开启"
                : form.value.open_real_name_authentication_status == 2
                ? "开启(非强制)"
                : "开启(强制)";
            form.real_name_authentication_node=
              form.value.real_name_authentication_node == 1
                ? "登录前"
                : form.value.anti_addiction_open_condition == 2
                ? "登录成功XX后"
                : form.value.anti_addiction_open_condition == 3
                ? "提现X次后"
                : "绑定微信后第二次登录";
            form.anti_addiction_status=
              form.value.anti_addiction_status == 1
                ? "关闭"
                : form.value.anti_addiction_status == 2
                ? "部分开启"
                : "全部开启";
            form.anti_addiction_open_condition=
              form.value.anti_addiction_open_condition == 1
                ? "所有用户"
                : form.value.anti_addiction_open_condition == 2
                ? "新用户"
                : "老用户";
            form.real_name_authentication_api=
              form.value.real_name_authentication_api == 1 ? "阿里云" : "中宣部";
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//手机绑定
const getPhoneBindDataList = () => {
  fetchPhoneBindTableData()
    .then((res) => {
      console.log("getPhoneBindDataList", res.data);
      tableDataDDDD.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            mobile_phone_bind_status:item.mobile_phone_bind_status == 1 ? '开启' : '不开启',
            mobile_phone_bind_condition:item.mobile_phone_bind_condition == 1 ? '全部用户' : item.mobile_phone_bind_condition == 2 ? '新用户' : '老用户',
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showPhoneBind.value = true;
        form.mobile_phone_bind_status = form.value.mobile_phone_bind_status;
        form.mobile_phone_bind_condition =
          form.value.mobile_phone_bind_condition;
        form.appoint_time = form.value.appoint_time;
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//手机绑定
const getSelectedPhoneBindList = (main_product_id) => {
  const data = {
    main_product_id,
  };
  fetchPhoneBindTableData(data)
    .then((res) => {
      console.log("getSelectedPhoneBindList", res.data);
      tableDataDDDD.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            mobile_phone_bind_status:item.mobile_phone_bind_status == 1 ? '开启' : '不开启',
            mobile_phone_bind_condition:item.mobile_phone_bind_condition == 1 ? '全部用户' : item.mobile_phone_bind_condition == 2 ? '新用户' : '老用户',
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showPhoneBind.value = true;
        form.mobile_phone_bind_status = form.value.mobile_phone_bind_status;
        form.mobile_phone_bind_condition =
          form.value.mobile_phone_bind_condition;
        form.appoint_time = form.value.appoint_time;
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取隐私协议所有数据
const getPrivacyDataList = () => {
  fetchPrivacyTableData()
    .then((res) => {
      console.log("getPrivacyDataList", res.data);
      tableDataEEEE.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showPrivacy.value = true;
        form.user_agreement_url = form.value.user_agreement_url;
        form.privacy_agreement_url = form.value.privacy_agreement_url;
        form.appoint_time = form.value.appoint_time;
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
//获取隐私协议所对应的一级游戏数据
const getSelectedPrivacyDataList = (main_product_id) => {
  const data = {
    main_product_id,
  };
  fetchPrivacyTableData(data)
    .then((res) => {
      console.log("getSelectedPrivacyDataList", res.data);
      tableDataEEEE.value = res.data.filter(
        (column) => column.config_type != 0
      ).map((item) => {
          return {
            ...item,
            updated_at: moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")
          };
        });
      form.value = res.data.filter((column) => column.config_type != 1)[0];
      if (form.value.config_type == 0) {
        showPrivacy.value = true;
        form.user_agreement_url = form.value.user_agreement_url;
        form.privacy_agreement_url = form.value.privacy_agreement_url;
        form.appoint_time = form.value.appoint_time;
      }
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};
// 获取表格数据
const getData = () => {
  console.log("getData whichTab.value", whichTab.value);
  console.log(
    "main_product_name_selected.value",
    main_product_name_selected.value
  );
  if (whichTab.value == 0) {
    if (main_product_name_selected.value > 0) {
      getSelectedDeviceLoginDataList(main_product_name_selected.value);
    } else {
      getDeviceLoginDataList();
    }
  } else if (whichTab.value == 1) {
    if (main_product_name_selected.value > 0) {
      getSelectedWechatBindDataList(main_product_name_selected.value);
    } else {
      getWechatBindDataList();
    }
  } else if (whichTab.value == 2) {
    if (main_product_name_selected.value > 0) {
      getSelectedRealNameList(main_product_name_selected.value);
    } else {
      getRealNameDataList();
    }
  } else if (whichTab.value == 3) {
    if (main_product_name_selected.value > 0) {
      getSelectedPhoneBindList(main_product_name_selected.value);
    } else {
      getPhoneBindDataList();
    }
  } else if (whichTab.value == 4) {
    if (main_product_name_selected.value > 0) {
      getSelectedPrivacyDataList(main_product_name_selected.value);
    } else {
      getPrivacyDataList();
    }
  }
};
//删除微信账号绑定
const deleteDeviceLoginData = (id) => {
  deleteDeviceLogin(id).then((res) => {
    if (res.status == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};
//删除微信账号绑定
const deleteWechatBindData = (id) => {
  deleteWechatBind(id).then((res) => {
    if (res.status == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};
//删除实名认证
const deleteRealNameData = (id) => {
  deleteRealName(id).then((res) => {
    if (res.status == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};
//删除手机绑定
const deletePhoneBindData = (id) => {
  deletePhoneBind(id).then((res) => {
    if (res.status == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};
//删除隐私协议
const deletePrivacyData = (id) => {
  deletePrivacy(id).then((res) => {
    if (res.status == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  });
};

export default {
  name: "DynamicModifyTable",
  setup() {
    getData();
    getProductDataList();
    const getProductAndDataList = () => {
      console.log(
        "main_product_name_selected.value",
        main_product_name_selected.value
      );
      //获取对应的二级游戏列表
      getData();
    };
    return {
      message,
      options,
      whichTab,
      tableDataAAAA,
      tableDataBBBB,
      tableDataCCCC,
      tableDataDDDD,
      tableDataEEEE,
      tableHeaderFirstTab,
      tableHeaderSecondTab,
      tableHeaderThirdTab,
      tableHeaderFourTab,
      tableHeaderFiveTab,
      main_product_name_selected,
      getProductAndDataList,
      deviceLoginShow,
      wechatBindShow,
      realNameShow,
      phoneBindShow,
      privacyShow,
      form,
      formRef,
      showDeviceLogin,
      showPhoneBind,
      showWechatBind,
      showRealName,
      showPrivacy,
    };
  },
  data() {
    return {};
  },
  methods: {
    addRule() {
      this.$router.push({
        name: "riskadd",
        params: { whichTab: whichTab.value },
      });
    },
    editRule() {
      this.$router.push({
        name: "riskedit",
        params: { whichTab: whichTab.value },
      });
    },
    handleTabClick(tab) {
      // formRef.value.resetFields();
      whichTab.value = tab.index;
      console.log("whichTab", whichTab.value);
      getData();
    },
    //设备登录修改
    handleDeviceLoginEdit(id, item) {
      const rowdata = {
        ...item,
        simulator_login_status: item.simulator_login_status == "允许" ? 1 : 0,
        more_open_login_status: item.more_open_login_status == "允许" ? 1 : 0,
        exception_login_status: item.exception_login_status == "允许" ? 1 : 0,
        simulator_watch_advertisement_status:
          item.simulator_watch_advertisement_status == "允许" ? 1 : 0,
        more_open_watch_advertisement_status:
          item.more_open_watch_advertisement_status == "允许" ? 1 : 0
      };
      this.$router.push({
        name: "riskedit",
        params: {
          whichTab: whichTab.value,
          id: id,
          data: JSON.stringify(rowdata),
        },
      });
    },
    // 设备登录删除操作
    handleDeviceLoginDelete(id) {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteDeviceLoginData(id);
        })
        .catch(() => {});
    },
    //微信绑定修改
    handleWechatBindEdit(id, row) {
      this.$router.push({
        name: "riskedit",
        params: { whichTab: whichTab.value, id: id, data: JSON.stringify(row) },
      });
    },
    // 微信绑定删除操作
    handleWechatBindDelete(id) {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteWechatBindData(id);
        })
        .catch(() => {});
    },
    //实名认证修改
    handleRealNameEdit(id, item) {
      const rowdata = {
        ...item,
        open_real_name_authentication_status:
            item.open_real_name_authentication_status == "不开启"
                ? 1
                : item.open_real_name_authentication_status == "开启(非强制)"
                ? 2
                : 3,
        // real_name_authentication_node:
        //       item.real_name_authentication_node == "登录前"
        //         ? 1
        //         : item.anti_addiction_open_condition == "登录成功XX后"
        //         ? 2
        //         : item.anti_addiction_open_condition == "提现X次后"
        //         ? 3
        //         : 4,
        anti_addiction_status:
          item.anti_addiction_status == "关闭"
            ? 1
            : item.anti_addiction_status == "部分开启"
            ? 2
            : 3,
        anti_addiction_open_condition:
          item.anti_addiction_open_condition == "所有用户"
            ? 1
            : item.anti_addiction_open_condition == "新用户"
            ? 2
            : 3,
        real_name_authentication_api:
          item.real_name_authentication_api == "阿里云" ? 1 : 2
      };
      console.log('rowdata', rowdata)
      this.$router.push({
        name: "riskedit",
        params: {
          whichTab: whichTab.value,
          id: id,
          data: JSON.stringify(rowdata),
        },
      });
    },
    // 实名认证删除操作
    handleRealNameDelete(id) {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteRealNameData(id);
        })
        .catch(() => {});
    },
    //手机绑定修改
    handlePhoneBindEdit(id, item) {
      const rowdata = {
        ...item,
        mobile_phone_bind_status:item.mobile_phone_bind_status == '开启' ? 1 : 2,
            mobile_phone_bind_condition:item.mobile_phone_bind_condition == '全部用户' ? 1 : item.mobile_phone_bind_condition == '新用户' ? 2 : 3
      };
      this.$router.push({
        name: "riskedit",
        params: { whichTab: whichTab.value, id: id, data: JSON.stringify(rowdata) },
      });
    },
    // 手机绑定删除操作
    handlePhoneBindDelete(id) {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deletePhoneBindData(id);
        })
        .catch(() => {});
    },
    //隐私协议修改
    handlePrivacyEdit(id, row) {
      console.log("handlePrivacyEdit row", row);
      this.$router.push({
        name: "riskedit",
        params: { whichTab: whichTab.value, id: id, data: JSON.stringify(row) },
      });
    },
    // 隐私协议删除操作
    handlePrivacyDelete(id) {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deletePrivacyData(id);
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.edit-icon {
  cursor: pointer;
}

.editable-row {
  display: flex;
  align-items: center;
}

.editable-row-span {
  display: inline-block;
  margin-right: 6px;
}

.menu-item {
  height: 32px;
  line-height: 32px;
  padding-left: 12px;
}

.menu-item:hover {
  color: #fff;
  background: #409eff;
  cursor: pointer;
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.message-title {
  cursor: pointer;
}

.handle-row {
  margin-top: 30px;
}
</style>
