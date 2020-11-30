<template>
  <transition name="slide-fade" appear>
    <div class="login__container">
      <SelectPaginated v-model="selectedStudent" :fetchData="getStudentList">
        <template slot="option" slot-scope="data">
          <b-avatar variant="info" :src="getPhoto(data)"></b-avatar>
           {{ data.name }}
        </template>
        <template slot="loader">
          <b-spinner label="Loading..." class="loader"></b-spinner>
        </template>
      </SelectPaginated>
      <div>
        v-model: {{ JSON.stringify(selectedStudent) }}
      </div >
      <!-- <v-select
        :options="options"
        :filterable="false"
        label="name"
        @open="onOpen"
        @close="onClose"
        @search="debounceSearch"
      >
        <template slot="option" slot-scope="option">
          <b-avatar variant="info" :src="getPhoto(option)"></b-avatar>
          {{ option.name }}
      </template>
        <template #list-footer>
          <li ref="load" class="loader" v-show="hasNextPage">
            Loading more options...
          </li>
        </template>
      </v-select> -->
      <AttachmentList
        :data="attachments"
        @onAttachmentItemDownload="onAttachmentItemDownload"
        @onAttachmentItemView="onAttachmentItemView"
      />
      <Toggle v-model="isEnable" />
      <p>Checked: {{isEnable}}</p>
      <h1 class="text-center">Schedule Viewer Sample Usage</h1>
      <center><button @click="addSubject">Add Subjet</button></center>
      <div class="schedule-view">
        <ScheduleViewer
          :selectedItems="selectedSchedules"
          @onCellItemClick="onCellItemClick"
          @onCellItemDblClick="onCellItemDblClick"
          @onMultipleCellSelect="onMultipleCellSelect"
          :showExtendedTime="false"
          :options="[{
            label: 'Edit Schedule',
            callback: onEditSeletedItem
          },
          {
            label: 'Delete Schedule',
            callback: onDeleteSeletedItem
          }]"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import Toggle from '../components/Form/Toggle'
import ScheduleViewer from '../components/ScheduleViewer'
import AttachmentList from '../components/Attachment/AttachmentList'
import StudentApi from '../../mixins/api/Student';
import { debounce } from 'lodash';
import SelectPaginated from '../components/SelectPaginated'

export default {
  name: 'Login',
  components: {
    Toggle,
    ScheduleViewer,
    AttachmentList,
    SelectPaginated
  },
  mixins: [StudentApi],
  data() {
    return {
      selectedStudent: {},
      //hasNextPage: true,
      //options: [],
      currentPage: 0,
      lastPage: 1,
      searchQuery: null,
      isEnable: true,
      attachments: [{
        id: 1,
        title: "Statement of Account.pdf",
        description: "414 KB"
      },
      {
        id: 2,
        title: "Bill 012.pdf",
        description: "415 KB"
      }],
      selectedSchedules: [
        {
          dayIndex: 0,
          start: "7:00", // 24 hrs time format
          end: "8:00", // 24 hrs time format
          data: {
            id: 1, // can be subject id
            title: "Basic Programming", // can subject title
            description: "Paul Christian Rueda | Section A" // can be instructor name, section, etc
          }
        },
        {
          dayIndex: 0,
          start: "8:00", // 24 hrs time format
          end: "11:00", // 24 hrs time format
          data: {
            id: 21, // can be subject id
            title: "Data Structure", // can subject title
            description: "Denis Gutierrez | Section B" // can be instructor name, section, etc
          }
        },
        {
          dayIndex: 0,
          start: "11:00", // 24 hrs time format
          end: "12:00", // 24 hrs time format
          data: {
            id: 92, // can be subject id
            title: "English", // can subject title
            description: "Gelyn Joy Manalang | Section B" // can be instructor name, section, etc
          }
        },
        {
          dayIndex: 0,
          start: "12:30", // 24 hrs time format
          end: "14:00", // 24 hrs time format
          data: {
            id: 90, // can be subject id
            title: "Mathematics", // can subject title
            description: "Gelyn Joy Manalang | Section B" // can be instructor name, section, etc
          }
        },
        {
          dayIndex: 2,
          start: "13:30", // 24 hrs time format
          end: "15:30", // 24 hrs time format
          data: {
            id: 1, // can be subject id
            title: "Basic Programming", // can subject title
            description: "Paul Christian Rueda | Section A" // can be instructor name, section, etc
          }
        },
        {
          dayIndex: 4,
          start: "9:00", // 24 hrs time format
          end: "11:00", // 24 hrs time format
          data: {
            id: 10, // can be subject id
            title: "Java Programming", // can subject title
            description: "John Doe | Section B" // can be instructor name, section, etc
          }
        }
      ]
    }
  },
  mounted() {
    //this.observer = new IntersectionObserver(this.infiniteScroll);
  },
  methods: {
    // async loadMore(params, clearResults = false) {
    //   const { data } = await this.getStudentList(params);
    //   this.currentPage = data?.meta?.currentPage;
    //   this.hasNextPage = data?.meta?.currentPage < data?.meta?.lastPage;
    //   this.options = clearResults ? data?.data || [] : [...this.options, ...(data?.data || [])];
    // },
    // debounceSearch: debounce(function(v) {
    //   this.searchOption(v);
    // }, 500),
    // searchOption(q) {
    //   this.searchQuery = q;
    //   this.loadMore({ page: 1, search: q }, true);
    // },
    getPhoto(option) {
      const photo = option && option.photo && option.photo.hashName || '';
      return  !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
    // async onOpen () {
    //   if (this.hasNextPage) {
    //     await this.$nextTick();
    //     this.observer.observe(this.$refs.load)
    //   }
    // },
    // onClose () {
    //   this.observer.disconnect();
    // },
    // async infiniteScroll ([{isIntersecting, target}]) {
    //   if (isIntersecting) {
    //     const ul = target.offsetParent;
    //     const scrollTop = target.offsetParent.scrollTop;
    //     const params = { page: this.currentPage + 1, ...(this.searchQuery && { search: this.searchQuery }) };
    //     await this.loadMore(params);
    //     //this.limit += 10;
    //     await this.$nextTick();
    //     ul.scrollTop = scrollTop;
    //   }
    // },
    onAttachmentItemDownload(data) {
      console.log(data)
    },
    onAttachmentItemView(data) {
      console.log(data)
    },
    onCellItemClick(item) {
      console.log('onCellItemClick', item)
    },
    onCellItemDblClick(item) {
      console.log('onCellItemDblClick', item)
    },
    onEditSeletedItem(item) {
      console.log('item selected', item)
    },
    onDeleteSeletedItem(item) {
      console.log('delete selected', item)
    },
    onMultipleCellSelect(item) {
      console.log('multiple cell selection item: ', item)
    },
    addSubject() {
      this.selectedSchedules.push({
        dayIndex: 5,
        start: "11:00", // 24 hrs time format
        end: "12:00", // 24 hrs time format
        data: {
          id: 6, // can be subject id
          title: "Intro to Networking", // can subject title
          description: "Juan Dela Cruz | Section B" // can be instructor name, section, etc
        }
      },
      {
        dayIndex: 5,
        start: "13:00", // 24 hrs time format
        end: "15:00", // 24 hrs time format
        data: {
          id: 6, // can be subject id
          title: "Intro to Networking", // can subject title
          description: "Juan Dela Cruz | Section B" // can be instructor name, section, etc
        }
      },
      {
        dayIndex: 3,
        start: "8:00", // 24 hrs time format
        end: "12:30", // 24 hrs time format
        data: {
          id: 8, // can be subject id
          title: "Multimedia", // can subject title
          description: "Juan Dela Cruz | Section B" // can be instructor name, section, etc
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .schedule-view {
    height: auto;
    width: 85%;
    max-width: 1350px;
    margin: 30px auto;
  }

  .c-test {
    height: 300px;
    width: 200px;
    border: 1px solid red;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
  }

  .loader {
    height: 25px;
    width: 25px;
  }

</style>
