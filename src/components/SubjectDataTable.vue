<template>
  <div>
    <el-table :data="subjectData" style="width: 90%;margin: 50px">
      <el-table-column fixed prop="subject_id" label="รหัสรายวิชา" align='center' />
      <el-table-column prop="title" label="ชื่อวิชา" align='center' />
      <el-table-column prop="des" label="คำอธิบายรายวิชา" align='center' />
      <el-table-column align='center'>
        <template #header>
          <el-button @click="addSubjectFormVisible = true">เพิ่มรายวิชา</el-button>

          <el-dialog title="เพิ่มรายวิชา" :visible.sync="addSubjectFormVisible" center>
            <el-form :model="addSubjectFormData">
              <el-form-item label="รหัสรายวิชา">
                <el-input v-model="addSubjectFormData.subject_id" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อวิชา">
                <el-input v-model="addSubjectFormData.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="คำอธิบายรายวิชา">
                <el-input v-model="addSubjectFormData.des" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addSubjectFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitAddSubjectForm">ตกลง</el-button>
            </span>
          </el-dialog>

          <el-dialog title="แก้ไขข้อมูลรายวิชา" :visible.sync="editSubjectFormVisible" center>
            <el-form :v-model="editSubjectFormData">
              <el-form-item label="รหัสรายวิชา">
                <el-input v-model="editSubjectFormData.subject_id" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="ชื่อวิชา">
                <el-input v-model="editSubjectFormData.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="คำอธิบายรายวิชา">
                <el-input v-model="editSubjectFormData.des" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editSubjectFormVisible = false">ยกเลิก</el-button>
              <el-button type="primary" @click="submitEditSubjectForm">ตกลง</el-button>
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
      addSubjectFormVisible: false,
      editSubjectFormVisible: false,
      addSubjectFormData: {
        subject_id: '',
        title: '',
        des: '',
      },
      editSubjectFormData: {
        subject_id: '',
        title: '',
        des: '',
      },
      subjectData: [],
    };
  },
  mounted() {
    this.getSubjectData();
  },
  methods: {
    submitAddSubjectForm() {
      if (this.addSubjectFormData.subject_id === '' || this.addSubjectFormData.title === '') {
        console.log("not valid")
      } else {
        const { subject_id, title, des } = this.addSubjectFormData
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject_id: subject_id,
            title: title,
            des: des,
          })
        };
        fetch('http://localhost:8000/subject/', requestOptions)
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.error('There was an error!', error);
            }
            console.log('Success');
            this.addSubjectFormVisible = false
            this.forcesRerender()
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      }
    },
    submitEditSubjectForm() {
      const { subject_id, title, des } = this.editSubjectFormData
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: subject_id,
          title: title,
          des: des,
        })
      };
      fetch('http://localhost:8000/subject/', requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            console.error('There was an error!', error);
          }
          console.log('Success');
          this.editSubjectFormVisible = false
          this.forcesRerender()
        })
        .catch(error => {
          this.errorMessage = error;
          console.error('There was an error!', error);
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
    handleEdit(index, row) {
      axios
        .get("http://localhost:8000/subject/?subject_id=" + row.subject_id)
        .then((response) => {
          const res = response.data[0]
          const { subject_id, title, des } = res
          this.editSubjectFormData.subject_id = subject_id
          this.editSubjectFormData.title = title
          this.editSubjectFormData.des = des
        })
      this.editSubjectFormVisible = true
    },
    async handleDelete(index, row) {
      if (confirm('ยืนยันการลบรายวิชาหรือไม่?')) {
        axios
          .delete("http://localhost:8000/subject/?subject_id=" + row.subject_id)
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