<template>
  <div>
    <el-table :data="teacherData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="user_id" label="รหัสอาจารย์" />
      <el-table-column prop="firstname" label="ชื่อ" />
      <el-table-column prop="lastname" label="นามสกุล" />
      <el-table-column prop="number" label="เบอร์โทรศัพท์" />
      <el-table-column prop="email" label="อีเมล" />
      <el-table-column align="right">
        <template #header>
          <el-button @click="addTeacherFormVisible = true">เพิ่มอาจารย์</el-button>

          <el-dialog title="เพิ่มอาจารย์" :visible.sync="addTeacherFormVisible" center>
            <el-form :model="addTeacherFormData">
              <el-form-item label="รหัสอาจารย์">
                <el-input v-model="addTeacherFormData.user_id" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="addTeacherFormData.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="addTeacherFormData.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="addTeacherFormData.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="addTeacherFormData.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="addTeacherFormData.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="addTeacherFormData.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addTeacherFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddTeacherForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="แก้ไขข้อมูลอาจารย์" :visible.sync="editTeacherFormVisible" center>
            <el-form :v-model="editTeacherFormData">
              <el-form-item label="รหัสอาจารย์">
                <el-input v-model="editTeacherFormData.user_id" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อ">
                <el-input v-model="editTeacherFormData.firstname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="นามสกุล">
                <el-input v-model="editTeacherFormData.lastname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="เบอร์โทรศัพท์">
                <el-input v-model="editTeacherFormData.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="อีเมล">
                <el-input v-model="editTeacherFormData.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input v-model="editTeacherFormData.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="editTeacherFormData.password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editTeacherFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitEditTeacherForm">ตกลง</el-button>
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
      addTeacherFormVisible: false,
      editTeacherFormVisible: false,
      addTeacherFormData: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
      },
      editTeacherFormData: {
        user_id: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        username: '',
        password: '',
      },
      teacherData: [],
    };
  },
  mounted() {
    this.getTeacherData();
  },
  methods: {
    submitAddTeacherForm() {
      if (this.addTeacherFormData.user_id === '' || this.addTeacherFormData.firstname === '' || this.addTeacherFormData.lastname === '' || this.addTeacherFormData.username === '' || this.addTeacherFormData.password === '') {
        console.log("not valid")
      } else {
        const { user_id, firstname, lastname, number, email, username, password } = this.addTeacherFormData
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
            this.addTeacherFormVisible = false
            this.forcesRerender()
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditTeacherForm() {
      const { user_id, firstname, lastname, number, email, username, password } = this.editTeacherFormData
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
          this.editTeacherFormVisible = false
          this.forcesRerender()
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
    },
    getTeacherData() {
      axios
        .get("http://localhost:8000/user/")
        .then((response) => {
          const teacher = response.data.filter(
            (user) => user.role === 'teacher'
            );
          this.teacherData = teacher;
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
          this.editTeacherFormData.user_id = user_id
          this.editTeacherFormData.firstname = firstname
          this.editTeacherFormData.lastname = lastname
          this.editTeacherFormData.number = number
          this.editTeacherFormData.email = email
          this.editTeacherFormData.username = username
          this.editTeacherFormData.password = ''
        })
      this.editTeacherFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ยืนยันการลบอาจารย์หรือไม่?')) {
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