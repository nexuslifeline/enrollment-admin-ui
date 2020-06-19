<style scoped>
  .background-blue{
    background: #228cf7!important;
  }
  .box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    padding: 40px;
    box-sizing: border-box;
    border-radius: 20px;
  }

  .version {
    position: absolute;
    left: 50%;
    bottom: -7%;
    font-size: 11px;
    right: 0;
    transform: translate(-50%,0);
    text-align: center;
    color: #fff;
  }
</style>
<template>
  <b-container class="background-blue d-flex justify-content-center min-vh-100 min-vw-100">
    <b-row>
      <b-col>
        <b-card-group>
          <b-card class="box p-4">
              <b-form>
                <h3>Admin Login</h3>
                <small>Welcome to Admistrator Portal</small><br><br>
                <b-form-group>
                  <label>Email</label>
                  <b-form-input
                    v-model="username"
                    placeholder="Email"/>
                </b-form-group>
                <b-form-group>
                  <label>Password</label>
                  <b-form-input
                    v-model="password"
                    type="password"
                    placeholder="Password" />
                </b-form-group>
                <b-row align-h="end">
                   <b-col md=4>
                    <b-button @click="authLogin()" variant="outline-primary" block>Login</b-button>
                  </b-col>
                </b-row>
              </b-form>
              <b-col md=4 class="version">Version: {{version}}</b-col>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { AuthApi } from '../../mixins/api'
export default {
  name: 'Login',
  mixins: [AuthApi],
  data() {
    return {
      username: null,
      password: null,
      version: process.env.VUE_APP_VERSION
    }
  },
  methods: {
    authLogin(){
      this.login({ username: this.username, password: this.password })
        .then(({ data }) => {
          this.$store.commit('loginUser')
          localStorage.setItem('adminAccessToken', data.accessToken)
          this.getAuthenticatedUser()
            .then(({ data }) => {
              localStorage.setItem('userGroupId', data.userGroupId)
              this.$router.push({ name: 'Dashboard'})
            })
        })
        .catch(response => {
          console.log(response)
        })
    },
  }
}
</script>