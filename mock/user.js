
const tokens = {
  admin: {
    token: 'admin-token'
  },
  teacher: {
    token: 'teacher-token'
  },
  teacher2: {
    token: 'teacher-token2'
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
    name: 'Super Admin',
    password: 'admin'
  },
  'teacher-token': {
    roles: ['teacher'],
    introduction: 'I am an teacher',
    avatar: 'https://media.giphy.com/media/XpLdhYseuf3mtwJ5Zy/giphy.gif',
    name: 'Normal Teacher',
    password: 'teacher'
  },
  'teacher-token2': {
    roles: ['teacher'],
    introduction: 'I am an teacher2',
    avatar: 'https://c.tenor.com/ugw8PESrI7sAAAAM/shiba-dog-jump.gif',
    name: 'Normal Teacher2',
    password: 'teacher2'
  },
  'student-token': {
    roles: ['student'],
    introduction: 'I am an student',
    avatar: 'https://media.giphy.com/media/H9M7lvORlmeFmvGoqY/giphy.gif',
    name: 'Normal Student',
    password: 'student'
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
