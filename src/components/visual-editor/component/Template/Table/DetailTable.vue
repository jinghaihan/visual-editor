<template>
  <div ref="Container"
       id="visual-template-detailTable"
       class="visual-template-detailTable">
    <ve-table v-bind="propsData" />
  </div>
</template>

<script>
export default {
  name: 'DetailTable',
  data () {
    return {
      propsData: {
        columns: [
          { field: 'name', key: 'a', title: 'Name' },
          { field: 'date', key: 'b', title: 'Date' },
          { field: 'hobby', key: 'c', title: 'Hobby' },
          { field: 'address', key: 'd', title: 'Address' }
        ],
        tableData: [
          {
            name: 'John',
            date: '1900-05-20',
            hobby: 'coding and coding repeat',
            address: 'No.1 Century Avenue, Shanghai'
          },
          {
            name: 'Dickerson',
            date: '1910-06-20',
            hobby: 'coding and coding repeat',
            address: 'No.1 Century Avenue, Beijing'
          },
          {
            name: 'Larsen',
            date: '2000-07-20',
            hobby: 'coding and coding repeat',
            address: 'No.1 Century Avenue, Chongqing'
          },
          {
            name: 'Geneva',
            date: '2010-08-20',
            hobby: 'coding and coding repeat',
            address: 'No.1 Century Avenue, Xiamen'
          },
          {
            name: 'Jami',
            date: '2020-09-20',
            hobby: 'coding and coding repeat',
            address: 'No.1 Century Avenue, Shenzhen'
          }
        ],
        borderAround: true,
        borderX: true,
        borderY: true,
        columnWidthResizeOption: {
          enable: true
        },
        cellStyleOption: {
          headerCellClass: ({ column, rowIndex }) => {
            return 'table-header-cell'
          },
          bodyCellClass: ({ row, column, rowIndex }) => {
            return 'table-body-cell'
          }
        }
      },
      styleData: {
        headerCellBgColor: '#fafafa',
        headerCellColor: '#000000d9',
        bodyCellBgColor: '#fff',
        bodyCellColor: '#000000d9'
      }
    }
  },
  methods: {
    initStyle () {
      const propertys = ['headerCellBgColor', 'headerCellColor', 'bodyCellBgColor', 'bodyCellColor']
      propertys.forEach(key => {
        this.$refs.Container.style.setProperty('--' + key, this.styleData[key])
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #visual-template-detailTable{
    --headerCellBgColor: #fafafa;
    --headerCellColor: #000000d9;
    --bodyCellBgColor: #fff;
    --bodyCellColor: #000000d9;
  }

  .visual-template-detailTable{
    height: 100%;
    width: 100%;
  }

  /deep/.table-header-cell {
    background: var(--headerCellBgColor) !important;
    color: var(--headerCellColor) !important;
  }

  /deep/.table-body-cell {
    background: var(--bodyCellBgColor) !important;
    color: var(--bodyCellColor) !important;
  }
</style>
