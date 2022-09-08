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
                <el-input v-model="addTeacherForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="addTeacherForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="addTeacherForm.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddTeacherForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="แก้ไขครูผู้สอน" :visible.sync="editFormVisible" center>
            <el-form :v-model="editTeacherForm">
              <el-form-item label="รหัสอาจารย์">
                <el-input v-model="editTeacherForm.user_id" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="editTeacherForm.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="editTeacherForm.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="editTeacherForm.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="editTeacherForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="editTeacherForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="editTeacherForm.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitEditTeacherForm">ตกลง</el-button>
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
      key: 1,
      renderComponent: true,
      componentKey: 0,
      dialogFormVisible: false,
      editFormVisible: false,
      addTeacherForm: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
      },
      editTeacherForm: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
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
      if (this.addTeacherForm.user_id === '' || this.addTeacherForm.firstname === '' || this.addTeacherForm.lastname === '' || this.addTeacherForm.username === '' || this.addTeacherForm.password === '') {
        console.log("not valid")
      } else {
        const { user_id, firstname, lastname, number, email, username, password } = this.addTeacherForm
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user_id,
            firstname: firstname,
            lastname: lastname,
            number: number,
            email: email,
            role: 'teacher',
            username: username,
            password: password,
          })
        };
        fetch('http://localhost:8000/user/', requestOptions)
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.error('There was an error!', error);
            }
            console.log('Success');
            this.dialogFormVisible = false
            this.methodThatForcesUpdate()
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditTeacherForm() {
      const { user_id, firstname, lastname, number, email, username, password } = this.editTeacherForm
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id,
          firstname: firstname,
          lastname: lastname,
          number: number,
          email: email,
          role: 'teacher',
          username: username,
          password: password,
        })
      };
      fetch('http://localhost:8000/user/', requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            console.error('There was an error!', error);
          }
          console.log('Success');
          this.editFormVisible = false
          this.methodThatForcesUpdate()
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
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
    handleEdit(index, row) {
      // console.log(index, row);
      axios
        .get("http://localhost:8000/user/?user_id=" + row.user_id)
        .then((response) => {
          const res = response.data[0]
          const { user_id, firstname, lastname, number, email, role, username, password } = res
          this.editTeacherForm.user_id = user_id
          this.editTeacherForm.firstname = firstname
          this.editTeacherForm.lastname = lastname
          this.editTeacherForm.number = number
          this.editTeacherForm.email = email
          this.editTeacherForm.username = username
          this.editTeacherForm.password = ''
          // this.tableHeader = "Total Customer";
        //   const teacher = response.data.filter(
        //     (user) => user.role === 'teacher'
        //     );
        //   this.tableData = teacher;
        //   this.numberOfCustomers = teacher.length;
        //   this.activeCustomersData = teacher.filter(
        //     (user) => user.disabled !== 1
        //   );
        //   this.activeCustomers = this.activeCustomersData.length;
        })
        // .catch((error) => {
        //   console.log(error);
        // });
      this.editFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ลบครูผู้สอน?')) {
        // console.log(row.user_id);
        axios
          .delete("http://localhost:8000/user/?user_id=" + row.user_id)
          .then((response) => {
            console.log(response.data);
            this.methodThatForcesUpdate()
          })
          .catch((error) => {
            console.log(error);
          });
        // await this.$store.dispatch('user/logout')
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    },
    methodThatForcesUpdate() {
      this.$router.go()
      // this.key++
      // console.log(this.key)
      // this.componentKey += 1;
      // this.$forceUpdate();
      // this.$router.push(`${this.$route.fullPath}`)
      // // Removing my-component from the DOM
      // this.renderComponent = false;
      // this.$nextTick(() => {
      //   // Adding the component back in
      //   this.renderComponent = true;
      // });
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