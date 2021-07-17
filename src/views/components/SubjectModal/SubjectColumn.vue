<template>
  <div>
    <span class="subject-code">
      {{ [data.code || '', data.description || data.name].filter(v => !!v).join(' - ') }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: [Object],
    }
  }
}
</script>

<style>

</style>