<template>
  <div class="createPost-container">
    <el-form :model="addSecFormData" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-form-item label="กลุ่มที่">
            <el-select v-model="addSecFormData.sec_id" placeholder="เลือกกลุ่ม">
              <el-option v-for="item in groups" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="รหัส - วิชา">
            <el-select v-model="addSecFormData.subject_id" placeholder="เลือกวิชา">
              <el-option v-for="subject in subjectData" :label="subject.subject_id + ' - ' + subject.title"
                :value="subject.subject_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="อาจารย์ผู้สอน">
            <el-select v-model="addSecFormData.teacher_id" placeholder="เลือกอาจารย์">
              <el-option v-for="teacher in teacherData" :label="teacher.firstname + ' ' + teacher.lastname"
                :value="teacher.user_id" />
            </el-select>
          </el-form-item>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitAddSecForm">ตกลง</el-button>
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
      groups: [{
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }, {
        value: '5',
        label: '5'
      }],
      selectedSecId: "",
      fileList: [],
      addSecFormVisible: false,
      editSecFormVisible: false,
      studentTableVisible: false,
      addSecFormData: {
        sec_id: '',
        subject_id: '',
        teacher_id: '',
      },
      editSecFormData: {
        sec_id: '',
        subject_id: '',
        teacher_id: '',
      },
      secData: [],
      subjectData: [],
      teacherData: [],
      studentData: [],
      studentInSecData: [],
    };
  },
  mounted() {
    this.getSecData();
    this.getSubjectData();
    this.getUserData();
  },
  methods: {
    submitAddSecForm() {
      if (this.addSecFormData.subject_id === '' || this.addSecFormData.teacher_id === '') {
        console.log("not valid")
      } else {
        const { sec_id, subject_id, teacher_id } = this.addSecFormData
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sec_id: sec_id,
            subject_id: subject_id,
            teacher_id: teacher_id,
          })
        };
        fetch('http://localhost:8000/sec/', requestOptions)
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.error('There was an error!', error);
            }
            console.log('Success');
            this.addSecFormVisible = false
            // this.forcesRerender()
            this.$router.push('/sec/list')
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditSecForm() {
      const { sec_id, subject_id, teacher_id } = this.editSecFormData
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sec_id: sec_id,
          subject_id: subject_id,
          teacher_id: teacher_id,
        })
      };
      fetch('http://localhost:8000/sec/', requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            console.error('There was an error!', error);
          }
          console.log('Success');
          this.editSecFormVisible = false
          this.forcesRerender()
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
        });
    },
    getSecData() {
      axios
        .get("http://localhost:8080/api/sec")
        .then((response) => {
          this.secData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubjectData() {
      axios
        .get("http://localhost:8000/subject/")
        .then((response) => {
          this.subjectData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUserData() {
      axios
        .get("http://localhost:8000/user/")
        .then((response) => {
          const users = response.data
          const teacher = users.filter(
            (user) => user.role === 'teacher'
          );
          this.teacherData = teacher;
          const student = users.filter(
            (user) => user.role === 'student'
          );
          this.studentData = student;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getStudentInSecData(sec_id) {
      axios
        .get("http://localhost:8080/api/student/?sec_id=" + sec_id)
        .then((response) => {
          const res = response.data
          this.studentInSecData = res
        })
    },
    handleStudentDetail(index, row) {
      this.studentTableVisible = true
      this.selectedSecId = "http://localhost:8080/upload/?sec_id=" + row.sec_id
      this.getStudentInSecData(row.sec_id);
    },
    handleEdit(index, row) {
      axios
        .get("http://localhost:8000/sec/?sec_id=" + row.sec_id)
        .then((response) => {
          const res = response.data[0]
          const { sec_id, subject_id, teacher_id } = res
          this.editSecFormData.sec_id = sec_id
          this.editSecFormData.subject_id = subject_id
          this.editSecFormData.teacher_id = teacher_id
        })
      this.editSecFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ยืนยันการลบกลุ่มหรือไม่?')) {
        axios
          .delete("http://localhost:8080/api/student/?sec_id=" + row.sec_id)
        axios
          .delete("http://localhost:8000/sec/?sec_id=" + row.sec_id)
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
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
      this.forcesRerender()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
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