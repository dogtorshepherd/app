<template>
  <div>
    <el-table :data="secData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="sec_id" label="รหัสห้องเรียน" align='center' />
      <el-table-column prop="subject" label="ชื่อวิชา" align='center' />
      <el-table-column label="" align='center'>
        <template #default="scope">
          <el-button size="small" @click="handleStudentDetail(scope.$index, scope.row)"
            >รายละเอียดคะแนน</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="ผลการสอบ" :visible.sync="studentTableVisible" center>
      <el-table :data="studentInSecData" >
        <el-table-column fixed prop="id" label="รหัสนักเรียน" align='center' />
        <el-table-column prop="name" label="ชื่อนักเรียน" align='center' />
        <el-table-column prop="score" label="คะแนน" align='center' />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from "axios";

export default {
  data() {
    return {
      selectedSecId: "",
      fileList: [],
      addSecFormVisible: false,
      editSecFormVisible: false,
      studentTableVisible: false,
      addSecFormData: {
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
        const { subject_id, teacher_id } = this.addSecFormData
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
            this.forcesRerender()
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
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
      };
      axios
        .get("http://localhost:8000/auth/users/me/", config)
        .then((response) => {
          const teacherId = response.data.user_id
          // this.subjectData = response.data;
          axios
            .get("http://localhost:8080/api/sec/" + teacherId)
            .then((response) => {
              this.secData = response.data;
            })
            .catch((error) => {
              console.log(error);
            });
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
        .get("http://localhost:8080/api/student/score/?sec_id=" + sec_id)
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
      if (confirm('ยืนยันการลบห้องเรียนหรือไม่?')) {
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
      return this.$confirm(`Cancel the transfert of ${ file.name } ?`);
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