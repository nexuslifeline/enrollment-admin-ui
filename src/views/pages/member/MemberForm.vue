<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink :previousRoute="{ name: 'Member List' }" />
      <Personal :data="data" />
    </template>
  </CenterContainer>
</template>

<script>
import Personal from '../../components/Member/Personal';
import { PersonnelApi } from '../../../mixins/api';

export default {
  components: {
    Personal,
  },
  mixins: [PersonnelApi],
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      const { personnelId } = this.$route.params;
      this.getPersonnel(personnelId).then(({ data }) => {
        this.data = data;
      });
    }
  }
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";
</style>
