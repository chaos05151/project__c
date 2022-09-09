<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>风控系统</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>反馈详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form :model="userDetail" :inline="true">
        <el-form-item label="用户id">
          {{ userDetail.id }}
        </el-form-item>
        <el-form-item label="用户名">
          {{ userDetail.nickname }}
        </el-form-item>
        <el-form-item label="手机号码">
          {{ userDetail.tel }}
        </el-form-item>
        <el-form-item label="设备关联号">
          {{ userDetail.bind_account_count }}
        </el-form-item>
      </el-form>
      <el-form :model="userDetail" :inline="true">
        <el-form-item label="累积积分">
          {{ userDetail.reward }}
        </el-form-item>
        <el-form-item label="累积提现">
          {{ userDetail.withdraw_reward }}
        </el-form-item>
        <el-form-item label="已提现次数">
          {{ userDetail.withdraw_times }}
        </el-form-item>
        <el-form-item label="是否实名制">
          {{ userDetail.real_name_authenticated }}
        </el-form-item>
      </el-form>
      <el-form :model="userDetail" :inline="true">
        <el-form-item label="IP">
          {{ userDetail.ip }}
        </el-form-item>
        <el-form-item label="IP地址">
          {{ userDetail.ip_address }}
        </el-form-item>
        <el-form-item label="设备ID">
          {{ userDetail.oaid }}
        </el-form-item>
      </el-form>
      <el-form :model="userDetail">
        <el-form-item label="封禁状态">
          <el-radio-group v-model="userDetail.blacked_days">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="3">封禁3天</el-radio>
            <el-radio :label="7">封禁7天</el-radio>
            <el-radio :label="-1">永久封禁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="允许提现">
          <el-radio-group v-model="userDetail.withdrawable">
            <el-radio :label="true">允许</el-radio>
            <el-radio :label="false">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
                <el-form-item label="反馈内容">
           <el-input style="width: 480px"
    v-model="feedbackDetail.feedback_content"
    :rows="5"
    type="textarea"
  />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import userjson from "../config/user.json";
import {
  fetchFeedBackDetail,
  fetchUserDetailData,
} from "../api/user";
const userDetail = reactive({});
const feedbackDetail = reactive({});
const wechat_user_id = ref("");

//获取用户详情记录
const getUserDetailData = (data) => {
  fetchUserDetailData(data)
    .then((res) => {
      console.log("getUserDetailData", res.data);
      userDetail.value = res.data;
      console.log("userDetail", userDetail.value);
      console.log("userDetail.blacked_days", userDetail.value.blacked_days);
      userDetail.id = userDetail.value.id;
      userDetail.oaid = userDetail.value.oaid;
      userDetail.blacked_days = userDetail.value.blacked_days;
      userDetail.withdrawable = userDetail.value.withdrawable;
      userDetail.nickname = userDetail.value.nickname;
      userDetail.tel = userDetail.value.tel;
      userDetail.bind_account_count = userDetail.value.bind_account_count;
      userDetail.real_name_authenticated = userDetail.value
        .real_name_authenticated
        ? "是"
        : "否";
      userDetail.withdraw_reward = userDetail.value.withdraw_reward;
      userDetail.withdraw_times = userDetail.value.withdraw_times;
      userDetail.reward = userDetail.value.reward;
      userDetail.ip = userDetail.value.ip;
      userDetail.ip_address = userDetail.value.ip_address;
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};

//获取用户详情记录
const getFeedBackDetailData = (data) => {
  fetchFeedBackDetail(data)
    .then((res) => {
      console.log("getUserDetailData", res.data);
      feedbackDetail.value = res.data;
      console.log("userDetail", userDetail.value);
      console.log("userDetail.blacked_days", userDetail.value.blacked_days);
      feedbackDetail.feedback_content = userDetail.value.feedback_content;
    })
    .catch(() => {
      // ElMessage.error("服务器异常！");
    });
};

export default {
  name: "DynamicModifyTable",
  setup() {
    const route = useRoute();
    wechat_user_id.value = route.params.wechat_user_id;
    console.log("wechat_user_id", wechat_user_id.value);
    getUserDetailData(wechat_user_id.value);
    getFeedBackDetailData(wechat_user_id.value)
    return {
      wechat_user_id,
      userDetail,
      feedbackDetail,
    };
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
