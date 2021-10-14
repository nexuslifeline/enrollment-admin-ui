<template>
  <div class="grade-list__container">
    <template v-for="(item, idx) in Array.from({ length: 20 })">
       <div :key="idx" class="grade-list__row">
        <div class="grade-list__cell grade-list__cell-name">
          <AvatarMaker
            :avatarId="2"
            :size="25"
            :text="'PR'"
            :borderSize="3"
            class="mr-2"
          />
          <span>
            Gelyn Joy Manalang-Rueda
          </span>
          <button @click.stop="onDropdownSelect(idx)" class="grade-list__dropdown">
            <BIconThreeDotsVertical  />
            <ul v-if="visibleDropdown.includes(idx)" class="grade-list__menu">
              <li @click="onMarkDropped(item)" class="grade-list__menu-item">Mark as Dropped</li>
              <li @click="onEditGrade(item)" class="grade-list__menu-item">Edit Grade</li>
            </ul>
          </button>
        </div>
        <div class="grade-list__cell grade-list__cell-grade">
          87
        </div>
        <template v-if="busyRow.includes(idx)">
          <di class="grade-list__row-overlay">
            <b-spinner type="border" small />
          </di>
        </template>
      </div>
    </template>
    <button @click="onShowMore" class="grade-list__more">
      Show more
    </button>
  </div>
</template>
<script>
export default {
  props: {
    sectionId: {
      type: [String, Number]
    },
    subjectId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      visibleDropdown: [],
      busyRow: [0]
    }
  },
  created() {
    // GET sections/${sectionId}/subjects/${subjectId}/academic-records
  },
  mounted() {
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  },
  methods: {
    onMarkDropped() {
      // PUT/PATCH academic-records/:id/subjects/:subjectId
    },
    onEditGrade() {
      // no ui yet, just skip for the meantime
    },
    onDropdownSelect(idx) {
      if (this.visibleDropdown.includes(idx)) {
        this.visibleDropdown = [];
      } else {
        this.visibleDropdown = [idx];
      }
    },
    hideDropdown() {
      this.visibleDropdown = [];
    },
    onShowMore() {
      // GET sections/${sectionId}/subjects/${subjectId}/academic-records
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .grade-list__container {
    width: 100%;
    border: 1px solid $light-gray-10;
    border-radius: 3px;

    .grade-list__row:last-child {
      border-bottom: 0;
    }
  }

  .grade-list__row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid $light-gray-10;
    position: relative;
  }

  .grade-list__cell {
    padding: 7px 10px;
  }

  .grade-list__cell-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  .grade-list__cell-grade {
    width: 60px;
    text-align: center;
    border-left: 1px solid $light-gray-10;
  }

  .grade-list__more {
    border: 0;
    background: none;
    outline: none;
    padding: 7px 10px;
    text-align: center;
    color: $blue;
    width: 100%;

    &:hover {
      background-color: $light-blue-10;
    }
  }

  .grade-list__dropdown {
    margin: 0;
    margin-left: auto;
    padding: 0;
    background: none;
    outline: none;
    border: 0;
    position: relative;
  }

  .grade-list__menu {
    position: absolute;
    min-width: 140px;
    border-radius: 4px;
    border: 1px solid $light-gray-10;
    background-color: $white;
    top: 8px;
    right: 12px;
    list-style: none;
    padding: 3px 0;
  }

  .grade-list__menu-item {
    margin-left: 0;
    text-align: left;
    padding: 5px 10px;
    border-bottom: 1px solid $light-gray-100;

    &:hover {
      background-color: $light-gray-100;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .grade-list__row-overlay {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    background-color: $white;
    opacity: .8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>