
const tokens = {
  admin: {
    token: 'admin-token'
  },
  teacher: {
    token: 'teacher-token'
  },
  student: {
    token: 'student-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://media.giphy.com/media/HifsMXFLaRsmQlx8jo/giphy.gif',
    name: 'Super Admin'
  },
  'teacher-token': {
    roles: ['teacher'],
    introduction: 'I am an teacher',
    avatar: 'https://media.giphy.com/media/XpLdhYseuf3mtwJ5Zy/giphy.gif',
    name: 'Normal Teacher'
  },
  'student-token': {
    roles: ['student'],
    introduction: 'I am an student',
    avatar: 'https://media.giphy.com/media/H9M7lvORlmeFmvGoqY/giphy.gif',
    name: 'Normal Student'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
