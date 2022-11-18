<template>
  <div class="createPost-container">
    <el-form :model="addSubjectFormData" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-form-item label="รหัสรายวิชา">
            <el-input v-model="addSubjectFormData.subject_id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="ชื่อวิชา">
            <el-input v-model="addSubjectFormData.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="คำอธิบายรายวิชา">
            <el-input v-model="addSubjectFormData.des" autocomplete="off"></el-input>
          </el-form-item>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitAddSubjectForm">ตกลง</el-button>
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
            // this.forcesRerender()
            this.$router.push('/subject/list')
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