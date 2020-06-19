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
                    v-model="forms.auth.fields.username"
                    :state="forms.auth.states.username" />
                  <b-form-invalid-feedback>
                    {{forms.auth.errors.username}}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <label>Password</label>
                  <b-form-input
                    v-model="forms.auth.fields.password"
                    :state="forms.auth.states.password"
                    type="password" />
                    <b-form-invalid-feedback>
                      {{forms.auth.errors.password}}
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-row align-h="end">
                   <b-col md=4>
                    <b-button 
                      :disabled="forms.auth.isProcessing"
                      @click="authLogin()" 
                      variant="outline-primary" 
                      block>
                      <v-icon
                        v-if="forms.auth.isProcessing"
                        name="sync"
                        class="mr-2"
                        spin />
                      Login
                    </b-button>
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
const fields = {
  username: null,
  password: null
}

import { AuthApi } from '../../mixins/api'
import { validate, reset } from '../../helpers/forms'
export default {
  name: 'Login',
  mixins: [AuthApi],
  data() {
    return {
      username: null,
      password: null,
      version: process.env.VUE_APP_VERSION,
      forms: {
        auth: {
          isProcessing: false,
          fields: {...fields},
          states: {...fields},
          errors: {...fields}
        }
      },
      version: process.env.VUE_APP_API_VERSION
    }
  },
  methods: {
    authLogin(){
      const { auth, auth: { fields: { username, password } } } = this.forms;
      auth.isProcessing = true;
      reset(auth)
      this.login({ username, password })
        .then(({ data }) => {
          this.$store.commit('loginUser')
          localStorage.setItem('adminAccessToken', data.accessToken)
          this.getAuthenticatedUser()
            .then(({ data }) => {
              auth.isProcessing = false;
              localStorage.setItem('userGroupId', data.userGroupId)
              this.$router.push({ name: 'Dashboard'})
            })
        }).catch((error) => {
          console.log(error)
          auth.isProcessing = false;
          const { errors } = error.response.data;
          validate(auth, errors);
        })
    },
  }
}
</script>
