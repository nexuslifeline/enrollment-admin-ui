<template>
  <b-media>
    <template v-slot:aside>
      <AvatarMaker
        :avatarId="data.student.id"
        :size="33"
        :text="
          `${data.student.firstName.charAt(0)}${data.student.lastName.charAt(
            0
          )}`
        "
        :src="
          $options.getFilePath(
            (data.student.photo && data.student.photo.hashName) || ''
          )
        "
      />
    </template>
    <div>
      <b-link @click="callback.loadDetails">
        {{ data.student && data.student.name }}
      </b-link>
    </div>
    <div class="text-muted">
      {{ data.student.email }}
    </div>
    <!-- <div class="text-muted">
      {{
        data.student.currentAddress || data.student.address
          ? data.student.currentAddress
          : ''
      }}
    </div> -->
  </b-media>
</template>

<script>
import AvatarMaker from '../AvatarMaker';
import { getFilePath } from '../../../helpers/utils';
export default {
  getFilePath,
  props: {
    data: {
      type: [Object],
    },
    callback: {
      type: [Object],
    },
  },
  components: {
    AvatarMaker,
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
