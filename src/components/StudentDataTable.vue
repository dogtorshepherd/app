<template>
  <div>
    <el-table :data="studentData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="user_id" label="รหัสนักศึกษา" />
      <el-table-column prop="firstname" label="ชื่อ" />
      <el-table-column prop="lastname" label="นามสกุล" />
      <el-table-column prop="number" label="เบอร์โทรศัพท์" />
      <el-table-column prop="email" label="อีเมล" />
      <el-table-column align="right">
        <template #header>
          <el-button @click="addStudentFormVisible = true">เพิ่มนักศึกษา</el-button>

          <el-dialog title="เพิ่มนักศึกษา" :visible.sync="addStudentFormVisible" center>
            <el-form :model="addStudentFormData">
              <el-form-item label="รหัสนักศึกษา">
                <el-input v-model="addStudentFormData.user_id" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="addStudentFormData.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="addStudentFormData.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="addStudentFormData.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="addStudentFormData.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="addStudentFormData.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="addStudentFormData.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addStudentFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddStudentForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="แก้ไขข้อมูลนักศึกษา" :visible.sync="editStudentFormVisible" center>
            <el-form :v-model="editStudentFormData">
              <el-form-item label="รหัสนักศึกษา">
                <el-input v-model="editStudentFormData.user_id" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="editStudentFormData.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="editStudentFormData.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="editStudentFormData.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="editStudentFormData.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="editStudentFormData.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="editStudentFormData.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editStudentFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitEditStudentForm">ตกลง</el-button>
            </span>
          </el-dialog>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >แก้ไข</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >ลบ</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      addStudentFormVisible: false,
      editStudentFormVisible: false,
      addStudentFormData: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
      },
      editStudentFormData: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
      },
      studentData: [],
    };
  },
  mounted() {
    this.getStudentData();
  },
  methods: {
    submitAddStudentForm() {
      if (this.addStudentFormData.user_id === '' || this.addStudentFormData.firstname === '' || this.addStudentFormData.lastname === '' || this.addStudentFormData.username === '' || this.addStudentFormData.password === '') {
        console.log("not valid")
      } else {
        const { user_id, firstname, lastname, number, email, username, password } = this.addStudentFormData
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user_id,
            firstname: firstname,
            lastname: lastname,
            number: number,
            email: email,
            role: 'student',
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
            this.addStudentFormVisible = false
            this.forcesRerender()
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditStudentForm() {
      const { user_id, firstname, lastname, number, email, username, password } = this.editStudentFormData
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id,
          firstname: firstname,
          lastname: lastname,
          number: number,
          email: email,
          role: 'student',
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
          this.editStudentFormVisible = false
          this.forcesRerender()
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
    },
    getStudentData() {
      axios
        .get("http://localhost:8000/user/")
        .then((response) => {
          const student = response.data.filter(
            (user) => user.role === 'student'
            );
          this.studentData = student;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleEdit(index, row) {
      axios
        .get("http://localhost:8000/user/?user_id=" + row.user_id)
        .then((response) => {
          const res = response.data[0]
          const { user_id, firstname, lastname, number, email, role, username, password } = res
          this.editStudentFormData.user_id = user_id
          this.editStudentFormData.firstname = firstname
          this.editStudentFormData.lastname = lastname
          this.editStudentFormData.number = number
          this.editStudentFormData.email = email
          this.editStudentFormData.username = username
          this.editStudentFormData.password = ''
        })
      this.editStudentFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ยืนยันการลบนักศึกษาหรือไม่?')) {
        axios
          .delete("http://localhost:8000/user/?user_id=" + row.user_id)
          .then((response) => {
            console.log(response.data);
            this.forcesRerender()
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    forcesRerender() {
      this.$router.go()
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