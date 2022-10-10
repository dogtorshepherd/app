<template>
  <div>
    <el-table :data="questData" style="width: 90%;margin: 50px">
      <el-table-column type="index" label="ข้อที่" width="50" />
      <el-table-column prop="question" label="โจทย์" />
      <el-table-column align='right' width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">ตอบ</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from "axios";
import raw from 'body-parser/lib/types/raw';

export default {
  data() {
    return {

      ruleForm: {
        score: '',
        type: [],
        level: [],
      },
      rules: {
        score: [
          { required: true, message: 'โปรดระบุคะแนน', trigger: 'blur' },
          { type: 'number', message: 'โปรดระบุคะแนนเป็นตัวเลข' }
        ],
        amount: [
          { required: true, message: 'โปรดระบุจำนวนข้อ', trigger: 'blur' },
          { type: 'number', message: 'โปรดระบุจำนวนข้อเป็นตัวเลข' }
        ],
        type: [
          { type: 'array', required: true, message: 'โปรดเลือกประเภทของคำถามอย่างน้อย 1 ประเภท', trigger: 'change' }
        ],
        level: [
          { type: 'array', required: true, message: 'โปรดเลือกระดับของคำถามอย่างน้อย 1 ระดับ', trigger: 'change' }
        ]
      },

      uploadExamUrl: "",
      selectedSecId: "",
      fileList: [],
      addManualVisible: false,
      addAutoVisible: false,
      addSecFormVisible: false,
      editSecFormVisible: false,
      examTableVisible: false,
      editFormVisible: false,
      addSecFormData: {
        subject_id: '',
        teacher_id: '',
      },
      editSecFormData: {
        sec_id: '',
        subject_id: '',
        teacher_id: '',
      },
      addManualFormData: {
        question: '',
        answer: '',
        score: '',
      },
      editFormData: {
        exam_id: '',
        sec_id: '',
        question: '',
        answer: '',
        score: '',
      },
      secData: [],
      questData: [],
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
    this.getQuestData(8);
  },
  methods: {
    submitAddManualForm(index, row) {
      if (this.addManualFormData.question === '' || this.addManualFormData.answer === '' || this.addManualFormData.score === '') {
        console.log("not valid")
      } else {
        const { question, answer, score } = this.addManualFormData
        // console.log("question : " + question)
        // console.log("answer : " + answer)
        // console.log("score : " + score)
        // console.log("sec_id : " + this.selectedSecId)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question,
            answer: answer,
            score: score,
            sec_id: this.selectedSecId,
          })
        };
        fetch('http://localhost:8080/api/quest/single', requestOptions)
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.error('There was an error!', error);
            }
            console.log('Success');
            this.addManualVisible = false
            // this.forcesRerender()
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditForm() {
      const { exam_id, sec_id, question, answer, score } = this.editFormData
      // console.log("exam_id : " + exam_id)
      // console.log("question : " + question)
      // console.log("answer : " + answer)
      // console.log("score : " + score)
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam_id,
          sec_id: sec_id,
          question: question,
          answer: answer,
          score: score,
        })
      };
      fetch('http://localhost:8000/exam/', requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            console.log('Fail');
            const error = (data && data.message) || response.status;
            console.error('There was an error!', error);
          } else {
            console.log('Success');
          }
          this.editFormVisible = false
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
          const studentId = response.data.user_id
          axios
            .get("http://localhost:8080/api/sec/student?studentId=" + studentId)
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
    getQuestData(secId) {
      // console.log(secId)
      axios
        .get("http://localhost:8080/api/quest?secId=" + secId)
        .then((response) => {
          console.log(response.data)
          this.questData = response.data;
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
    handleManualAddBtnClick(index, row) {
      this.addManualVisible = true
      // this.uploadExamUrl = "http://localhost:8080/uploadExam/?sec_id=" + row.sec_id
      this.selectedSecId = row.sec_id
    },
    handleAutoAddBtnClick(index, row) {
      this.addAutoVisible = true
      // this.uploadExamUrl = "http://localhost:8080/uploadExam/?sec_id=" + row.sec_id
      this.selectedSecId = row.sec_id
    },
    handleExamDetailBtnClick(index, row) {
      this.examTableVisible = true
      // this.uploadExamUrl = "http://localhost:8080/uploadExam/?sec_id=" + row.sec_id
      this.getQuestData(row.sec_id);
    },
    handleEdit(index, row) {
      axios
        .get("http://localhost:8000/exam/?exam_id=" + row.exam_id)
        .then((response) => {
          const { exam_id, sec_id, answer, question, score } = response.data
          // console.log("exam_id : " + exam_id)
          // console.log("sec_id : " + sec_id)
          // console.log("answer : " + answer)
          // console.log("question : " + question)
          // console.log("score : " + score)
          this.editFormData.exam_id = exam_id
          this.editFormData.sec_id = sec_id
          this.editFormData.answer = answer
          this.editFormData.question = question
          this.editFormData.score = score
          console.log(this.editFormData)
        })
      this.editFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ยืนยันการลบข้อสอบหรือไม่?')) {
        axios
          .delete("http://localhost:8000/exam/?exam_id=" + row.exam_id)
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
    handleSuccess(response, file, fileLis) {
      alert(response.message)
      if (response.message === 'Upload Success') {
        const quests = []
        axios
          .get("http://localhost:8080/api/quest/")
          .then((response) => {
            this.quests = response.data
            this.createQuest(this.quests)
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    createQuest(quests) {
      for (const quest of quests) {
        const { num, detail, answer } = quest
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secId: this.selectedSecId,
            num: num,
            detail: detail,
            answer: answer,
          })
        };
        fetch('http://localhost:8080/api/quest/', requestOptions)
          .then(async response => {
            console.log("fetch")
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.error('There was an error!', error);
            }
            console.log('Success');
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
      axios
        .get("http://localhost:8080/api/quest/")
        .then((response) => {
          this.questData = response.data;
          this.forcesRerender()
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleRemove(file, fileList) {
      console.log("handleRemove")
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log("handlePreview")
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log("handleExceed")
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      console.log("beforeRemove")
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secId: this.selectedSecId,
              ruleForm: this.ruleForm,
            })
          };
          fetch('http://localhost:8080/api/quest/', requestOptions)
            .then(async response => {
              console.log("fetch")
              const data = await response.json();
              if (!response.ok) {
                const error = (data && data.message) || response.status;
                console.error('There was an error!', error);
              }
              console.log('Success');
              this.forcesRerender()
            })
            .catch(error => {
              this.errorMessage = error;
              console.error('There was an error!', error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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