<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
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
          v-hasPermi="['bysj:ticket:add']"
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
          v-hasPermi="['bysj:ticket:edit']"
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
          v-hasPermi="['bysj:ticket:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bysj:ticket:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ticketList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="医生id号" align="center" prop="doctorId" v-if="false"/>
      <el-table-column label="医生姓名" align="center"  prop="doctorName" v-if="true"/>
      <el-table-column label="预约日期" align="center" prop="yuyueTime" v-if="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.yuyueTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上午下午" align="center" prop="isam" v-if="true" :formatter="isamFormat"/>
      <el-table-column label="放号数量" align="center" prop="numberAll" />
      <el-table-column label="剩余数量" align="center" prop="numberLast" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bysj:ticket:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bysj:ticket:remove']"
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

    <!-- 添加或修改放号管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="放号数量" prop="numberAll">
          <el-input v-model="form.numberAll" placeholder="请输入放号数量" />
        </el-form-item>
        <el-form-item label="剩余数量" prop="numberLast">
          <el-input v-model="form.numberLast" placeholder="请输入剩余数量" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listTicket, getTicket, delTicket, addTicket, updateTicket, exportTicket } from "@/api/bysj/ticket";

export default {
  name: "Ticket",
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
      // 放号管理表格数据
      ticketList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 上午下午字典
      isamOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        doctorId: undefined,
        yuyueTime: undefined,
        isam: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        doctorId: [
          { required: true, message: "医生id号不能为空", trigger: "blur" }
        ],
        yuyueTime: [
          { required: true, message: "预约日期不能为空", trigger: "blur" }
        ],
        isam: [
          { required: true, message: "上午下午不能为空", trigger: "blur" }
        ],
        numberAll: [
          { required: true, message: "放号数量不能为空", trigger: "blur" }
        ],
        numberLast: [
          { required: true, message: "剩余数量不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("isam").then(response => {
      this.isamOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询放号管理列表 */
    getList() {
      this.loading = true;
      listTicket(this.queryParams).then(response => {
        this.ticketList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上午下午字典翻译
    isamFormat(row, column) {
      return this.selectDictLabel(this.isamOptions, row.isam);
    },
    // 状态字典翻译
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
        doctorId: undefined,
        yuyueTime: undefined,
        isam: 0,
        numberAll: undefined,
        numberLast: undefined,
        createTime: undefined,
        status: 0,
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
      this.ids = selection.map(item => item.doctorId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加放号管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const doctorId = row.doctorId || this.ids
      getTicket(doctorId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改放号管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.doctorId != null) {
            updateTicket(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTicket(this.form).then(response => {
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
      const doctorIds = row.doctorId || this.ids;
      this.$confirm('是否确认删除放号管理编号为"' + doctorIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTicket(doctorIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有放号管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTicket(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
