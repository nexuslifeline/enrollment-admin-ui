import { copyValue } from './extractor'

export default {
  methods: {
    recordDetails(pagination) {
      const to = (pagination.page) * pagination.perPage
      pagination.from = pagination.totalRows === 0 ? 0 : ((pagination.page - 1) * pagination.perPage) + 1
      pagination.to = pagination.totalRows === 0 ? 0 : to > pagination.totalRows ? pagination.totalRows : to
    },
    addRow(table, pagination, data){
      table.items.unshift(data)
      pagination.totalRows++
      this.recordDetails(pagination)
    },
    updateRow(table, data){
      const index = table.items.findIndex(i => i.id === data.id)
      copyValue(data, table.items[index])
    },
    deleteRow(table, pagination, id){
      const index = table.items.findIndex(i => i.id === id)
      this.$delete(table.items, index)
      pagination.totalRows--
      this.recordDetails(pagination)
    },
    onFiltered(items, pagination){
      pagination.totalRows = items.length
      pagination.page = 1
      this.recordDetails(pagination)
    }
  }
}