<template>
  <transition name="slide-fade" appear>
    <div class="login__container">
      <div class="login__left-pane">
        <div class="login__form">
          <div class="login__intro">
            <h4 class="login__intro-title">Welcome to <strong>STC Admin App</strong></h4>
            <p class="login__intro-description">
              To keep track with the latest data please login with your personal information by email address and password.
            </p>
          </div>
          <b-form-group id="username">
            <b-form-input
              v-model="forms.auth.fields.username"
              placeholder="Username"
              :state="forms.auth.states.username"/>
            <b-form-invalid-feedback>
              {{forms.auth.errors.username}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <b-form-input
              v-model="forms.auth.fields.password"
              type="password"
              placeholder="Password"
              :state="forms.auth.states.password"/>
              <b-form-invalid-feedback>
                {{forms.auth.errors.password}}
              </b-form-invalid-feedback>
          </b-form-group>
          <b-button
            @click="authLogin()"
            variant="primary"
            class="login__btn"
            :disabled="forms.auth.isProcessing">
            <v-icon
              v-if="forms.auth.isProcessing"
              name="sync"
              class="mr-2"
              spin/>Login
          </b-button>
        </div>
        <span class="admin__version">Version: {{version}}</span>
      </div>
      <div class="login__right-pane">
        <div class="rigth-pane__intro-container">
          <h1 class="rigth-pane__title">STC Admin App</h1>
          <p class="rigth-pane__description">
            STC Admin App helps discover, organize and track academic records of student 
            and some accounting stuff, so nothing falls off the radar.
          </p>
        </div>
      </div>
    </div>
  </transition>
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
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";
  @import "../../assets/scss/animations.scss";

  .login__container {
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow: hidden;
  }

  .login__left-pane {
    flex: 1;
    background-color: $white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px;
    width: 50vw;
    position: relative;
  }

  .login__form {
    padding: 20px;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;

    @include for-size(phone-only) {
      padding: 10px;
    }
  }

  .login__right-pane {
    flex: 1;
    background-image: linear-gradient(-180deg,transparent 100%,#000 0),
      linear-gradient(50deg,#7ce3c8 40%,#0080FF 0),
      linear-gradient(-30deg,rgba(0,0,0,.2),#000 120%);
    //background-color: $brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50vw;

    @include for-size(tablet-landscape-down, 250px) {
      display: none;
    }
  }

  .login__btn {
    min-width: 150px;
    margin-left: auto;
  }

  .login__intro-description {
    color: $dark-gray-10;
  }

  .login__intro {
    margin-bottom: 10px;
  }

  .login__or-label {
    font-weight: 500;
  }

  .login__new-account-options {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    margin-top: 20px;

    @include for-size(phone-only) {
      padding: 10px;
    }
  }

  .login__no-account {
    color: $dark-gray-10;
  }

  .login__create-account {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .login__create-account-line {
    width: 100%;
    border-top: 1px solid black;
    height: 1px;
    position: absolute;
    top: 50%;
    z-index: 0;
  }

  .login__center-text {
    background-color: $white;
    z-index: 1;
    padding: 0 10px;
  }

  .login__register-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30px;

    button {
      width: calc(50% - 5px);
    }

     @include for-size(phone-only) {
      flex-direction: column;
      button {
        width: 100%;
        margin: 8px 0;
      }
    }
  }

  .rigth-pane__intro-container {
    width: 400px;
    padding: 20px;
  }

  .rigth-pane__title {
    color: $white;
    font-weight: 800;
    font-size: 42px;
    margin-bottom: 20px;
  }

  .rigth-pane__description {
    color: $white;
    font-size: 16px;
    margin-bottom: 50px;
  }

  .admin__version {
    position: absolute;
    bottom: 10px;
    left: 20px;
    font-size: 11px;
  }
</style>
