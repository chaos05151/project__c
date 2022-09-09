<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> 积分系统 </el-breadcrumb-item>
                <el-breadcrumb-item>短视频项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <div>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item v-show="this.$route.params.whichTab == 0">答题红包</el-breadcrumb-item>
                        <el-breadcrumb-item v-show="this.$route.params.whichTab == 1">每日任务红包</el-breadcrumb-item>
                        <el-breadcrumb-item v-show="this.$route.params.whichTab == 2">特殊规则</el-breadcrumb-item>
                        <el-breadcrumb-item>新增规则</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-divider />
                <el-form v-show="this.$route.params.whichTab == 0" ref="formRef" :rules="rules" :model="form"
                    label-width="80px">
                    <el-form-item label-width="133px" label="答对题数">
                        <el-radio-group size="small" v-model="answer_count_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="answer_count_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.answer_countfrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.answer_countto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="answer_count_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.answer_countconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="账户余额">
                        <el-radio-group size="small" v-model="balance_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="balance_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balancefrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balanceto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="balance_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balanceconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="概率60%">
                        <el-input style="width: 130px" class="w-50 m-2" size="small" v-model="form.sixty_rate">
                        </el-input>&nbsp;%
                    </el-form-item>
                    <el-form-item label-width="133px" label="概率30%">
                        <el-input style="width: 130px" class="w-50 m-2" size="small" v-model="form.thirty_rate">
                        </el-input>&nbsp;%
                    </el-form-item>
                    <el-form-item label-width="133px" label="概率10%">
                        <el-input style="width: 130px" class="w-50 m-2" size="small" v-model="form.ten_rate">
                        </el-input>&nbsp;%
                    </el-form-item>
                    <el-form-item label-width="133px" label="翻倍领取倍数">
                        <el-radio-group size="small" v-model="double_multiple_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="double_multiple_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.double_multiplefrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.double_multipleto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="double_multiple_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.double_multipleconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="答题红包倍数">
                        <el-radio-group size="small" v-model="answer_multiple_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="answer_multiple_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.answer_multiplefrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.answer_multipleto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="answer_multiple_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.answer_multipleconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="onReset">取消</el-button>
                    </el-form-item>
                </el-form>
                <el-form v-show="this.$route.params.whichTab == 1" ref="formRef" :rules="rules" :model="form"
                    label-width="80px">
                    <el-form-item label-width="100px" label="账户余额">
                        <el-input style="width: 160px" class="w-50 m-2" size="small" v-model="form.balancefrom">
                        </el-input>&emsp;至&emsp;
                        <el-input style="width: 160px" class="w-50 m-2" size="small" v-model="form.balanceto">
                        </el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="答对次数">
                        <el-input style="width: 160px" class="w-50 m-2" size="small"
                            v-model="form.answer_count">
                        </el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="下发金额">
                        <el-input style="width: 160px" class="w-50 m-2" size="small" v-model="form.distribute_money">
                        </el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="是否打折">
                        <el-radio-group size="small" v-model="discount_distribute_checked">
                            <el-radio-button v-for="(item, index) in isDiscount" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="discount_distribute_checked == '不打折'">
                        </span>
                        &emsp;
                        <span v-show="discount_distribute_checked == '打折'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.discount_distribute">&emsp;倍
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="onReset">取消</el-button>
                    </el-form-item>
                </el-form>
                <el-form v-show="this.$route.params.whichTab == 2" ref="formRef" :rules="rules" :model="form"
                    label-width="80px">
                    <el-form-item label-width="133px" label="当前余额">
                        <el-radio-group size="small" v-model="balance_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="balance_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balancefrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balanceto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="balance_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.balanceconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="第1-5题">
                        <el-radio-group size="small" v-model="one_to_five_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="one_to_five_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.one_to_fivefrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.one_to_fiveto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="one_to_five_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.one_to_fiveconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="第6-10题">
                        <el-radio-group size="small" v-model="six_to_ten_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="six_to_ten_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.six_to_tenfrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small" v-model="form.six_to_tento">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="six_to_ten_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.six_to_tenconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="第10-20题">
                        <el-radio-group size="small" v-model="eleven_to_twenty_checked">
                            <el-radio-button v-for="(item, index) in hylbOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="eleven_to_twenty_checked == '区间值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.eleven_to_twentyfrom">
                            </el-input>&emsp;至&emsp;
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.eleven_to_twentyto">
                            </el-input>
                        </span>
                        &emsp;
                        <span v-show="eleven_to_twenty_checked == '固定值'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.eleven_to_twentyconstant">
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="翻倍领取倍数">
                        <el-radio-group size="small" v-model="thirdtab_double_multiple_checked">
                            <el-radio-button v-for="(item, index) in noneOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="thirdtab_double_multiple_checked == '无'">
                        </span>
                        &emsp;
                        <span v-show="thirdtab_double_multiple_checked == '翻倍'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.thirdtab_double_multipleconstant">&emsp;倍
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item label-width="133px" label="答题领取倍数">
                        <el-radio-group size="small" v-model="thirdtab_answer_multiple_checked">
                            <el-radio-button v-for="(item, index) in noneOptions" :key="index" :label="item">
                            </el-radio-button>
                        </el-radio-group>
                        &emsp;
                        <span v-show="thirdtab_answer_multiple_checked == '无'">
                        </span>
                        &emsp;
                        <span v-show="thirdtab_answer_multiple_checked == '翻倍'">
                            <el-input style="width: 80px" class="w-50 m-2" size="small"
                                v-model="form.thirdtab_answer_multipleconstant">&emsp;倍
                            </el-input>
                        </span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="onReset">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
    addVideoFirstTableData,
    addVideoSecondTableData,
    addVideoThirdTableData,
} from "../api/video";
const formRef = ref(null);
const form = reactive({
});
const hylbOptions = reactive(["固定值", "区间值"]);
const noneOptions = reactive(["无", "翻倍"]);
const isDiscount = reactive(["打折", "不打折"]);
const discount_distribute_checked = ref("打折")
const answer_count_checked = ref("区间值");
const balance_checked = ref("区间值");
const double_multiple_checked = ref("区间值");
const answer_multiple_checked = ref("区间值");
const one_to_five_checked = ref("区间值");
const six_to_ten_checked = ref("区间值");
const eleven_to_twenty_checked = ref("区间值");
const thirdtab_double_multiple_checked = ref("翻倍");
const thirdtab_answer_multiple_checked = ref("翻倍");
const addFirstTabData = (data) => {
    addVideoFirstTableData(data).then((res) => {
        if (res.status == 200) {
            ElMessage.success("答题红包新增规则成功");
        }
    });
};
const addSecondTabData = (data) => {
    addVideoSecondTableData(data).then((res) => {
        if (res.status == 200) {
            ElMessage.success("每日任务红包新增规则成功");
        }
    });
};
const addThirdTabData = (data) => {
    addVideoThirdTableData(data).then((res) => {
        if (res.status == 200) {
            ElMessage.success("特殊规则新增规则成功");
        }
    });
};
export default {
    name: "videoaddidiom",
    setup() {
        const rules = {
            nonnegative: [
                {
                    required: true,
                    pattern: /^\d+(\.{0,1}\d+){0,1}$/,
                    message: "请输入非负数",
                    trigger: "blur"
                }
            ]
        };
        return {
            rules,
            formRef,
            form,
            hylbOptions,
            answer_count_checked,
            balance_checked,
            double_multiple_checked,
            answer_multiple_checked,
            noneOptions,
            isDiscount,
            one_to_five_checked,
            six_to_ten_checked,
            eleven_to_twenty_checked,
            thirdtab_answer_multiple_checked,
            thirdtab_double_multiple_checked,
            discount_distribute_checked,
        };
    },
    methods: {
        // 提交
        onSubmit() {
            // 表单校验
            formRef.value.validate((valid) => {
                if (valid) {
                    console.log(form);
                    // firstTab
                    const data = {
                        answer_count: answer_count_checked.value == "区间值"
                            ? form.answer_countfrom + "," + form.answer_countto
                            : form.answer_countconstant,
                        balance: balance_checked.value == "区间值"
                            ? form.balancefrom + "," + form.balanceto
                            : form.balanceconstant,
                        double_multiple: double_multiple_checked.value == "区间值"
                            ? form.double_multiplefrom + "," + form.double_multipleto
                            : form.double_multipleconstant,
                        answer_multiple: answer_multiple_checked.value == "区间值"
                            ? form.answer_multiplefrom + "," + form.answer_multipleto
                            : form.answer_multipleconstant,
                        sixty_rate: form.sixty_rate,
                        thirty_rate: form.thirty_rate,
                        ten_rate: form.ten_rate,
                    };
                    // secondTab
                    const datasecond = {
                        answer_count: form.answer_count,
                        balance: form.balancefrom + "," + form.balanceto,
                        distribute_money: form.distribute_money,
                        discount_distribute: discount_distribute_checked.value == "打折"
                            ? form.discount_distribute
                            : 0,
                    };
                    // third tab
                    const datathird = {
                        balance: balance_checked.value == "区间值"
                            ? form.balancefrom + "," + form.balanceto
                            : form.balanceconstant,
                        one_to_five:
                            one_to_five_checked.value == "区间值"
                                ? form.one_to_fivefrom + "," + form.one_to_fiveto
                                : form.one_to_fiveconstant,
                        six_to_ten: six_to_ten_checked.value == "区间值"
                            ? form.six_to_tenfrom + "," + form.six_to_tento
                            : form.six_to_tenconstant,
                        eleven_to_twenty:
                            eleven_to_twenty_checked.value == "区间值"
                                ? form.eleven_to_twentyfrom + "," + form.eleven_to_twentyto
                                : form.eleven_to_twentyconstant,
                        double_multiple: thirdtab_double_multiple_checked.value == "翻倍"
                            ? form.thirdtab_double_multipleconstant
                            : 0,
                        answer_multiple:
                            thirdtab_answer_multiple_checked.value == "翻倍"
                                ? form.thirdtab_answer_multipleconstant
                                : 0,
                    };
                    if (this.$route.params.whichTab == 0) {
                        addFirstTabData(data);
                    } else if (this.$route.params.whichTab == 1) {
                        addSecondTabData(datasecond);
                    } else {
                        addThirdTabData(datathird);
                    }
                    this.$router.push("/video");
                } else {
                    return false;
                }
            });
        },
        // 重置
        onReset() {
            formRef.value.resetFields();
            this.$router.push("/video");
        },
    },
};
</script>
