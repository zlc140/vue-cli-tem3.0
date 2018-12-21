export default {
  //登录
  'login': {
    type: 'get',
    url: '/login{user}Test/test/{age}',
    dataType: 'text',
    data: {
      user: 'test'
    },
    header: {
      token: 'token'
    }
  },
  // 七牛云存储token
  'qiniu':{
    type:'get',
    url:'user/users/qiniu/token'
  },
}

