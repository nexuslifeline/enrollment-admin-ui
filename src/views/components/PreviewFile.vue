<template>
  <div>
    <b-modal 
      v-model="showModal"
      size="xl"
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      @hidden="$emit('close')"
      :noCloseOnBackdrop="true">
      <div slot="modal-title">
        Preview
      </div>
      <b-row class="justify-content-md-center">
        <b-overlay :show="file.isLoading">
          <div style="height: 250px;"></div>
        </b-overlay>
        <b-col md=12 v-if="!file.isLoading">
          <div v-if="file.src">
            <center>
              <b-img
                fluid 
                v-if="file.type.substr(0, file.type.indexOf('/')) == 'image'" 
                :src="file.src" />
              <b-embed
                v-else
                type="iframe"
                aspect="16by9"
                allowfullscreen
                :src="file.src"
              ></b-embed>
            </center>
          </div>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button 
          class="float-right"
          variant="outline-danger"
          @click="$emit('close')">
          Close
        </b-button>
      </div>
    </b-modal>
    <div v-if="showModal" class="preview__modal-description">
      <div class="mx-auto">
        Filename : {{ file.name }}<br>
        Notes : {{ file.notes }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showModalPreview: Boolean,
    file: Object
  },
  computed: {
    showModal: {
      get: function () {
        return this.showModalPreview;
      },
      set: function (newValue) {
        return newValue;
      }
      
    }
  }
}
</script>
<style scoped>
  .preview__modal-description {
    z-index: 5000;
    position: fixed;
    height: 50px;
    background-color: white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 30px;
  }
</style>