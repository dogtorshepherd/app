<template>
  <div class="createPost-container">
    <el-form :model="addTeacherFormData" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <!-- <el-form-item label="รหัสอาจารย์">
            <el-input v-model="addTeacherFormData.user_id" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="ชื่อ">
            <el-input v-model="addTeacherFormData.firstname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="นามสกุล">
            <el-input v-model="addTeacherFormData.lastname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Username">
            <el-input v-model="addTeacherFormData.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="addTeacherFormData.password" autocomplete="off"></el-input>
          </el-form-item>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitAddTeacherForm">ตกลง</el-button>
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      lastTeacherId: '',
      search: '',
      addTeacherFormVisible: false,
      editTeacherFormVisible: false,
      addTeacherFormData: {
        // user_id: '',
        firstname: '',
        lastname: '',
        // number: '',
        // email: '',
        username: '',
        password: '',
      },
      editTeacherFormData: {
        user_id: '',
        firstname: '',
        lastname: '',
        // number: '',
        // email: '',
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
    async submitAddTeacherForm() {
      if (this.addTeacherFormData.firstname === '' || this.addTeacherFormData.lastname === '' || this.addTeacherFormData.username === '' || this.addTeacherFormData.password === '') {
        console.log("not valid")
      } else {
        await this.getTeacherId();
        const { firstname, lastname, username, password } = this.addTeacherFormData
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: this.lastTeacherId,
            firstname: firstname,
            lastname: lastname,
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
            // this.forcesRerender()
            this.$router.push('/teacher/list')
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
    async getTeacherId() {
      await axios
        .get("http://localhost:8000/user/")
        .then((response) => {
          const teacher = response.data.filter(
            (user) => user.role === 'teacher'
          );
          this.lastTeacherId = "teacher" + (parseInt(teacher[teacher.length - 1].user_id.replace("teacher", "")) + 1);
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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

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