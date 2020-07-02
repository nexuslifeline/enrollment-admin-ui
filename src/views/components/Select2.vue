<template>
  <select :multiple="multiple" v-model="value">
    <slot></slot>
  </select>
</template>

<script>
  import $ from 'jquery'
  require('select2')
  export default {
    props: { 
      value: null,
      placeholder: null, 
      allowClear: null, 
      multiple: { 
        type: Boolean, 
        default: false 
      }
    },
    mounted(){
      let vm = this
      $('.modal-content').removeAttr('tabindex')
      $(this.$el)
      .select2({ 
        theme: 'bootstrap4',
        placeholder: this.placeholder,
        allowClear: this.allowClear
      })
      .val(this.value)
      .trigger('change')
      .on('select2:select select2:unselect', function () {
        vm.$emit('input', $(vm.$el).val())
      })
    },
    watch: {
      value: function (value) {
        $(this.$el)
          .val(value)
          .trigger('change')
      },
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    }
  }
</script>
<style>
  .select2-container--bootstrap4 
  .select2-selection--multiple 
  .select2-selection__rendered {
    padding: 0.375rem!important;
  }
  .select2-container--bootstrap4 
  .select2-selection--multiple 
  .select2-selection__choice {
    margin: 0.1875rem!important;
    padding: 0.06rem 0.75rem!important
  }

  .select2-container--bootstrap4 
  .select2-selection--multiple 
  .select2-search--inline 
  .select2-search__field
  {
    color: #768192
  }

  .select2-container--bootstrap4 
  .select2-selection--single 
  .select2-selection__rendered {
    line-height: 0.75!important;
    height: 33px!important;
    padding-left: 5px!important;
  }
</style>