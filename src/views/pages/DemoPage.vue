<template>
  <transition name="slide-fade" appear>
    <div class="login__container">
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
export default {
  name: 'Login',
  components: {
    Toggle,
    ScheduleViewer
  },
  data() {
    return {
      isEnable: true,
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
          start: "9:00", // 24 hrs time format
          end: "11:00", // 24 hrs time format
          data: {
            id: 21, // can be subject id
            title: "Data Structure", // can subject title
            description: "Denis Gutierrez | Section B" // can be instructor name, section, etc
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
  methods: {
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
      });
      this.selectedSchedules.push({
        dayIndex: 5,
        start: "13:00", // 24 hrs time format
        end: "15:00", // 24 hrs time format
        data: {
          id: 6, // can be subject id
          title: "Intro to Networking", // can subject title
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

</style>
