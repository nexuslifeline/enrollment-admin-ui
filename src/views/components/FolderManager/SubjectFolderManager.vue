<template>
  <ul class="folder__list-container">
    <CardLoader v-if="isLoading"/>
    <template v-else>
      <template v-for="(subject, idx) in subjects">
        <li class="folder__item" :key="idx">
          <div
            class="folder__item-headline"
            @click.stop="() => onSubjectSelect(idx)"
            v-b-tooltip.hover
            :title="subject.description">
            <template v-if="expanded.includes(idx)">
              <BIconFolderMinus scale="1.4" class="folder__item-icon" />
            </template>
            <template v-else>
              <BIconFolderPlus scale="1.4" class="folder__item-icon" />
            </template>
            <span>
              {{ subject.code }}
              -
              {{ subject.name }}
            </span>
            <BIconChevronUp v-if="expanded.includes(idx)" class="ml-auto" />
            <BIconChevronDown v-else class="ml-auto" />
          </div>
          <ul v-if="expanded.includes(idx)" class="sub-folder__list-container">
            <template v-for="(section, sIdx) in subject.sections">
              <li
                :class="{ active: activeSectionId === section.id && activeSubjectId === subject.id }"
                class="sub-folder__item"
                :key="sIdx" @click.stop="$emit('onSectionSelect', { sectionId: section.id, subjectId: subject.id, section: section })">
                {{ section.name }}
                <!-- <BIconChevronRight scale=".85" class="sub-folder__item-icon" /> -->
              </li>
            </template>
          </ul>
        </li>
      </template>
    </template>
  </ul>
</template>

<script>
import { PersonnelApi } from '../../../mixins/api'
import CardLoader from '../Card/CardLoader'
export default {
  mixins: [PersonnelApi],
  components: { CardLoader },
  props: {
    personnelId: {
      type: [String, Number]
    },
    activeSectionId: {
      type: [Number]
    },
    activeSubjectId: {
      type: [Number]
    }
  },
  data() {
    return {
      expanded: [],
      isLoading: true,
      subjects: [ ]
    }
  },
  created() {
    // load personnel subjects GET  /personnels/:id/subjects
    const params = { paginate: false }
    this.isLoading = true
    this.getPersonnelSubjects(params, this.personnelId).then(({ data }) => {
      this.subjects = data
      this.isLoading = false
    })
  },
  methods: {
    onSubjectSelect(idx) {
      if (this.expanded.includes(idx)) {
        this.expanded = this.expanded.filter(v => v !== idx)
        return;
      }

      this.expanded.push(idx);
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .folder__list-container {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .folder__item {
    list-style: none;
    padding: 0;
    margin: 0;
    // border-bottom: 1px solid $light-gray-100;
    cursor: pointer;
    font-weight: 500;
    // border-bottom: 1px solid $light-gray-100;
  }

  .folder__item-icon {
    margin-right: 12px;
  }

  .folder__item-headline {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 3px;
    padding: 7px 10px;

    // &:hover {
    //   background-color: $light-gray-100;
    // }
  }

  .sub-folder__item {
    display: flex;
    list-style: none;
    margin: 4px 0;
    padding: 3px 4px 3px 10px;
    font-weight: normal;
    width: 100%;
    align-items: center;
    border-radius: 4px;
    font-size: 14px;

    &:hover {
      background-color: $light-gray-100;
    }

    &.active {
      background-color: $light-gray-100;
      font-weight: 500;
    }

  }

  .sub-folder__list-container {
    margin: 5px 0 5px 16px;
    padding: 0;
    padding-left: 7px;
    border-left: 1px solid $light-gray-10;
  }

  .sub-folder__item-icon {
    margin-left: auto;
  }
</style>