<template>
  <transition name="slide-fade" appear>
    <div class="login__container">
      <Toggle v-model="isEnable" />
      <p>Checked: {{isEnable}}</p>
    </div>
  </transition>
</template>
<script>
import Toggle from '../components/Form/Toggle'
export default {
  name: 'Login',
  components: {
    Toggle
  },
  data() {
    return {
      isEnable: true
    }
  },
  methods: {

  }
}
</script>
