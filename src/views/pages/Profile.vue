<template>
  <div>
    <UserEducation />
    <UserEmployments />
  </div>
</template>

<script>
import UserEmployments from '../components/UserEmployments/List';
import UserEducation from '../components/UserEducation/List';

export default {
  components: {
    UserEmployments,
    UserEducation
  },
  data() {
    return {

    };
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';


</style>
