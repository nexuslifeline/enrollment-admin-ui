<template>
  <div class="dropdown__row-item">
    <AvatarMaker
      :avatarId="data.id"
      :size="30"
      :text="nameAcronym"
      :src="photoUrl"
    />
    <div class="dropdown__name">{{ data.name }}</div>
    <div class="dropdown__identifier-text">{{ data.studentNo || data.email || data.user.username}}</div>
  </div>
</template>

<script>
  import { getPropValue } from '../../../helpers/utils';
  import AvatarMaker from '../AvatarMaker';

  export default {
    getPropValue,
    components: {
      AvatarMaker
    },
    props: {
      data: {
        type: [Object]
      }
    },
    computed: {
      nameAcronym() {
        const { firstName, lastName } = this.data;
        return `${firstName?.charAt(0)}${lastName?.charAt(0)}`
      },
      photoUrl() {
        const { photo } = this.data;
        return this.getPhoto(photo?.hashName || '');
      }
    },
    methods: {
      getPhoto(option) {
        const photo = option?.photo?.hashName || '';
        return  !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .dropdown__row-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2px 0;

    &:hover {
      .dropdown__identifier-text, .dropdown__name {
        color: $white;
      }
    }
  }

  .dropdown__identifier-text {
    color: $dark-gray-200;
    margin-left: auto;
  }

  .dropdown__name {
    color: $dark-gray-500;
    margin-left: 8px;
    font-size: 14px;
  }
</style>