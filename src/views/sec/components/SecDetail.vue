<template>
  <div class="createPost-container">
    <el-form :model="addSecFormData" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-table :data="studentInSecData" max-height="600">
            <el-table-column type="index" width="100" label="ลำดับที่" align='center' />
            <el-table-column prop="id" label="รหัสนักศึกษา" align='center' />
            <el-table-column prop="name" label="ชื่อนักศึกษา" align='center' />
          </el-table>
          <br />
          <span slot="footer" class="dialog-footer">
            <el-row>
              <el-col :span="6">
                <div class="grid-content"></div>
              </el-col>
              <el-col :span="6">
                <div>
                  <!-- <h4>ตัวอย่างไฟล์นักศึกษา</h4> -->
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-upload :action="selectedSecId" :on-change="handleChange" :on-preview="handlePreview"
                    :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3"
                    :on-exceed="handleExceed" :file-list="fileList">
                    <el-button size="small" type="primary">เพิ่มไฟล์นักศึกษา</el-button>
                  </el-upload>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="action">
                  <el-image style="width: 100px; height: 100px" :src="addStudentCsv" :preview-src-list="srcList" />
                  <br/>
                  <h4 style="margin: 30px;">ตัวอย่างไฟล์นักศึกษา .csv</h4>
                </div>
              </el-col>
            </el-row>
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addStudentCsv: require('@/assets/sec.png'),
      srcList: [
        require('@/assets/sec.png'),
      ],
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
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.handleStudentDetail(id)
    }
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
      axios
        .get("http://localhost:8080/api/sec")
        .then((response) => {
          this.secData = response.data;
          console.log(this.secData)
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
    handleStudentDetail(id) {
      this.studentTableVisible = true
      this.selectedSecId = "http://localhost:8080/upload/?sec_id=" + id
      this.getStudentInSecData(id);
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
      console.log("handleChange");
      this.fileList = fileList.slice(-1);
      this.forcesRerender()
    },
    handleRemove(file, fileList) {
      console.log("handleRemove");
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log("handlePreview");
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log("handleExceed");
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      console.log("beforeRemove");
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

.action {
  position: relative;
  display:flex;
  justify-content: center;
  align-items: center;
}
</style>