<template>
  <div>
    <el-table :data="secData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="sec_id" label="กลุ่มที่" align='center' />
      <el-table-column prop="subject" label="รหัส - วิชา" align='center' />
      <el-table-column prop="teacher" label="ชื่ออาจารย์" align='center' />
      <el-table-column label="รายชื่อนักศึกษา" align='center'>
        <template #default="scope">
          <el-button @click="$router.push('/sec/edit/'+scope.row.sec_id)">รายละเอียด</el-button>
          <!-- <el-button size="small" @click="handleStudentDetail(scope.$index, scope.row)" >รายละเอียด</el-button > -->
        </template>
      </el-table-column>
      <el-table-column align='center'>
        <template #header>
          <el-button @click="$router.push('/sec/create')">เพิ่มกลุ่ม</el-button>

          <el-dialog title="เพิ่มกลุ่ม" :visible.sync="addSecFormVisible" center>
            <el-form :model="addSecFormData">
              <el-form-item label="รหัสกลุ่ม">
                <el-input v-model="addSecFormData.sec_id" autocomplete="off" style="width: 200px;" />
              </el-form-item>
              <el-form-item label="ชื่อวิชา">
                <el-select v-model="addSecFormData.subject_id" placeholder="เลือกวิชา">
                  <el-option v-for="subject in subjectData" :label="subject.title" :value="subject.subject_id" />
                </el-select>
              </el-form-item>
              <el-form-item label="อาจารย์ผู้สอน">
                <el-select v-model="addSecFormData.teacher_id" placeholder="เลือกอาจารย์">
                  <el-option v-for="teacher in teacherData" :label="teacher.firstname + ' ' + teacher.lastname"
                    :value="teacher.user_id" />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addSecFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddSecForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="แก้ไขข้อมูลกลุ่ม" :visible.sync="editSecFormVisible" center>
            <el-form :v-model="editSecFormData">
              <el-form-item label="รหัส - วิชา">
                <el-select v-model="editSecFormData.subject_id" placeholder="เลือกวิชา">
                  <el-option v-for="subject in subjectData" :label="subject.subject_id + ' - ' + subject.title"
                    :value="subject.subject_id" />
                </el-select>
              </el-form-item>
              <el-form-item label="อาจารย์ผู้สอน">
                <el-select v-model="editSecFormData.teacher_id" placeholder="เลือกอาจารย์">
                  <el-option v-for="teacher in teacherData" :label="teacher.firstname + ' ' + teacher.lastname"
                    :value="teacher.user_id" />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editSecFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitEditSecForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="รายชื่อนักศึกษา" :visible.sync="studentTableVisible" center>
            <el-table :data="studentInSecData" max-height="450">
              <el-table-column type="index" width="100" label="ลำดับที่" align='center'/>
              <el-table-column prop="id" label="รหัสนักศึกษา" align='center' />
              <el-table-column prop="name" label="ชื่อนักศึกษา" align='center' />
            </el-table>
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
                  <div>
                    <el-image style="width: 100px; height: 100px" :src="addStudentCsv" :preview-src-list="srcList" />
                    <h4>ตัวอย่างไฟล์นักศึกษา .csv</h4>
                  </div>
                </el-col>

              </el-row>
            </span>
          </el-dialog>
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">แก้ไข</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">ลบ</el-button>
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