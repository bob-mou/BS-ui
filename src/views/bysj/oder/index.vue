<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户ID号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医生id号" prop="doctorId">
        <el-input
          v-model="queryParams.doctorId"
          placeholder="请输入医生id号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约日期" prop="yuyueTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.yuyueTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择预约日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上午下午" prop="isam">
        <el-select v-model="queryParams.isam" placeholder="请选择上午下午" clearable size="small">
          <el-option
            v-for="dict in isamOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payWay">
        <el-select v-model="queryParams.payWay" placeholder="请选择支付方式" clearable size="small">
          <el-option
            v-for="dict in payWayOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否到诊" prop="iscome">
        <el-select v-model="queryParams.iscome" placeholder="请选择是否到诊" clearable size="small">
          <el-option
            v-for="dict in iscomeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bysj:oder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bysj:oder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bysj:oder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:oder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="oderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID号" align="center" prop="userId" v-if="true"/>
      <el-table-column label="医生id号" align="center" prop="doctorId" v-if="true"/>
      <el-table-column label="上午下午" align="center" prop="isam" :formatter="isamFormat" />
      <el-table-column label="预约日期" align="center" prop="yuyueTime" v-if="true" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.yuyueTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否到诊" align="center" prop="iscome" :formatter="iscomeFormat" />
      <el-table-column label="创建时间" align="center" prop="creatDate" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creatDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付价格" align="center" prop="payMuch" />
      <el-table-column label="支付日期" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" prop="payWay" :formatter="payWayFormat" />
      <el-table-column label="评分分数" align="center" prop="star" />
      <el-table-column label="对医生评价" align="center" prop="messageHospital" width="180px"  />
      <el-table-column label="对系统评价" align="center" prop="messageSys" width="180px"  />
      <el-table-column label="订单状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:oder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:oder:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改订单信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="570px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户ID号" prop="userId">
          <el-input
            v-model="form.userId"
            placeholder="请输入用户ID号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="医生id号" prop="doctorId">
          <el-input
            v-model="form.doctorId"
            placeholder="请输入医生id号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预约日期" prop="yuyueTime">
          <el-date-picker clearable size="small"
                          v-model="form.yuyueTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择预约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上午下午">
          <el-radio-group v-model="form.isam">
            <el-radio
              v-for="dict in isamOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付价格" prop="payMuch">
          <el-input v-model="form.payMuch" placeholder="请输入支付价格" />
        </el-form-item>
        <el-form-item label="支付日期" prop="payTime">
          <el-date-picker clearable size="small"
            v-model="form.payTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择支付日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式" prop="payWay">
          <el-select v-model="form.payWay" placeholder="请选择支付方式">
            <el-option
              v-for="dict in payWayOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否到诊">
          <el-radio-group v-model="form.iscome">
            <el-radio
              v-for="dict in iscomeOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评分分数" prop="star">
          <el-input v-model="form.star" placeholder="请输入评分分数" />
        </el-form-item>
        <el-form-item label="对医生评价" prop="messageHospital">
          <el-input v-model="form.messageHospital" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="对系统评价" prop="messageSys">
          <el-input v-model="form.messageSys" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOder, getOder, delOder, addOder, updateOder, exportOder } from "@/api/bysj/oder";

export default {
  name: "Oder",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单信息表格数据
      oderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 上午下午字典
      isamOptions: [],
      // 支付方式字典
      payWayOptions: [],
      // 是否到诊字典
      iscomeOptions: [],
      // 订单状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        doctorId: undefined,
        yuyueTime: undefined,
        isam: undefined,
        payWay: undefined,
        iscome: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID号不能为空", trigger: "blur" }
        ],
        doctorId: [
          { required: true, message: "医生id号不能为空", trigger: "blur" }
        ],
        yuyueTime: [
          { required: true, message: "预约日期不能为空", trigger: "blur" }
        ],
        isam: [
          { required: true, message: "上午下午不能为空", trigger: "blur" }
        ],
        iscome: [
          { required: true, message: "是否到诊不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "订单状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("isam").then(response => {
      this.isamOptions = response.data;
    });
    this.getDicts("pay_way").then(response => {
      this.payWayOptions = response.data;
    });
    this.getDicts("iscome").then(response => {
      this.iscomeOptions = response.data;
    });
    this.getDicts("oder_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询订单信息列表 */
    getList() {
      this.loading = true;
      listOder(this.queryParams).then(response => {
        this.oderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上午下午字典翻译
    isamFormat(row, column) {
      return this.selectDictLabel(this.isamOptions, row.isam);
    },
    // 支付方式字典翻译
    payWayFormat(row, column) {
      return this.selectDictLabel(this.payWayOptions, row.payWay);
    },
    // 是否到诊字典翻译
    iscomeFormat(row, column) {
      return this.selectDictLabel(this.iscomeOptions, row.iscome);
    },
    // 订单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        doctorId: undefined,
        yuyueTime: undefined,
        isam: 0,
        payMuch: undefined,
        payTime: undefined,
        payWay: undefined,
        iscome: 0,
        star: undefined,
        messageHospital: undefined,
        messageSys: undefined,
        creatDate: undefined,
        status: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getOder(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateOder(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOder(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除订单信息编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOder(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOder(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
