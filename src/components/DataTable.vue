<template>
  <div>
    <!-- <customer-overview
      :totalCustomers="numberOfCustomers"
      :activeCustomers="activeCustomers"
      @totalCustomersIsActive="setFilterTotalIsActive"
      @activeCustomerIsActive="setFilterActiveIsActive"
    ></customer-overview> -->
    <el-table :data="tableData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="user_id" label="รหัสอาจารย์" />
      <el-table-column prop="firstname" label="ชื่อ" />
      <el-table-column prop="lastname" label="นามสกุล" />
      <el-table-column prop="number" label="เบอร์โทรศัพท์" />
      <el-table-column prop="email" label="อีเมล" />
      <el-table-column align="right">
        <template #header>
          <el-button @click="dialogFormVisible = true">เพิ่มครูผู้สอน</el-button>

          <el-dialog title="เพิ่มครูผู้สอน" :visible.sync="dialogFormVisible" center>
            <el-form :model="addTeacherForm">
              <el-form-item label="รหัสอาจารย์">
                <el-input v-model="addTeacherForm.user_id" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="addTeacherForm.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="addTeacherForm.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="addTeacherForm.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="addTeacherForm.usemailer_id" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddTeacherForm">ตกลง</el-button>
            </span>
          </el-dialog>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import CustomerOverview from "@/components/CustomerOverview.vue";
import CreateCustomerForm from "@/components/CreateCustomerForm.vue";
import EditCustomerForm from "@/components/EditCustomerForm.vue";
import DeleteCustomerModal from "@/components/DeleteCustomerModal.vue";

export default {
  components: {
    CustomerOverview,
    CreateCustomerForm,
    EditCustomerForm,
    DeleteCustomerModal,
  },
  data() {
    return {
      dialogFormVisible: false,
      addTeacherForm: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
      },
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: "user_id",
          label: "รหัสอาจารย์",
          sortable: false,
        },
        {
          key: "firstname",
          label: "ชื่อ",
          sortable: false,
        },
        {
          key: "lastname",
          label: "นามสกุล",
          sortable: false,
        },
        {
          key: "number",
          label: "เบอร์โทรศัพท์",
          sortable: false,
        },
        {
          key: "email",
          label: "อีเมล",
          sortable: false,
        },
        "จัดการ",
      ],
      tableData: [],
      numberOfCustomers: 0,
      activeCustomers: 0,
      activeCustomersData: [],
      customerId: 0,
      companySearchTerm: "",
      tableHeader: "",
      showSuccessAlert: false,
      alertMessage: "",
    };
  },
  mounted() {
    this.getCustomerData();
  },
  methods: {
    submitAddTeacherForm() {
      this.dialogFormVisible = false
      console.log(this.addTeacherForm)
    },
    showCreateModal() {
      this.$refs["create-customer-modal"].show();
    },
    closeCreateModal() {
      this.$refs["create-customer-modal"].hide();
    },
    getCustomerData() {
      axios
        .get("http://localhost:8000/user/")
        .then((response) => {
          // this.tableHeader = "Total Customer";
          const teacher = response.data.filter(
            (user) => user.role === 'teacher'
            );
          this.tableData = teacher;
          this.numberOfCustomers = teacher.length;
          this.activeCustomersData = teacher.filter(
            (user) => user.disabled !== 1
          );
          this.activeCustomers = this.activeCustomersData.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRowData(id) {
      this.$refs["edit-customer-modal"].show();
      this.customerId = id;
    },
    closeEditModal() {
      this.$refs["edit-customer-modal"].hide();
    },
    setFilterTotalIsActive() {
      this.tableHeader = "Total Customers";
      this.getCustomerData();
    },
    setFilterActiveIsActive() {
      this.tableHeader = "Active Customers";
      this.tableData = this.activeCustomersData;
    },
    showAlertCreate() {
      this.showSuccessAlert = true;
      this.alertMessage = "Customer was created successfully!";
    },
    showAlertUpdate() {
      this.showSuccessAlert = true;
      this.alertMessage = "Customer was updated successfully";
    },
    showDeleteModal(id) {
      this.$refs["delete-customer-modal"].show();
      this.customerId = id;
    },
    closeDeleteModal() {
      this.$refs["delete-customer-modal"].hide();
    },
    showDeleteSuccessModal() {
      this.showSuccessAlert = true;
      this.alertMessage = "Customer was deleted successfully!";
    },
    handleClick() {
      console.log('click')
    }
  },
};
</script>

<style scoped>
.action-item:hover {
  cursor: pointer;
}
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>