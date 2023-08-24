<template>
  <div class="visual-editor-componentSetSelect">
    <a-collapse :bordered="false">
      <a-collapse-panel key="component"
                        header="组件配置"
                        :forceRender="true">
        <a-form-model
          ref="form"
          :model="form"
        >
          <a-form-model-item
            v-for="item in form.components"
            :key="item.key"
            label=""
          >
            <div class="form-item-container">
              <a-row :gutter="8">
                <a-col :span="10" v-if="cell.type === 'tab-container'">
                  <a-input v-model="item.name"
                          placeholder="标签页"
                          @change="onChange">
                  </a-input>
                </a-col>
                <a-col :span="cell.type === 'tab-container' ? 10 : 20">
                  <a-select v-model="item.value"
                            placeholder="组件"
                            :show-search="true"
                            :filter-option="filterOptions"
                            v-bind="config.props"
                            @change="onChange">
                  </a-select>
                </a-col>
                <a-col :span="4">
                  <a-button type="link"
                            icon="minus-circle-o"
                            v-if="form.components.length > 1"
                            @click="onRemove(item)">
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </a-form-model-item>

          <a-form-model-item >
            <div class="button-container">
              <a-button type="dashed"
                        icon="plus"
                        style="width: 60%"
                        @click="onAdd">
                添加
              </a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import { generateUUID } from '../../../../utils'

export default {
  props: {
    editor: {
      type: Object,
      required: true
    },
    cell: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        components: []
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let defaultFormData = this.config.defaultFormData 
      if (defaultFormData && defaultFormData['vm-propsData-components']) {
        this.form.components = defaultFormData['vm-propsData-components']
      }

      if (!this.form.components.length) {
        this.onAdd()
      }
    },
    onAdd () {
      this.form.components.push({
        key: generateUUID()
      })
      this.onChange()
    },
    onRemove (component) {
      this.form.components = this.form.components.filter(i => i.key !== component.key)
      this.onChange()
    },
    onChange () {
      this.$emit('change')
    },
    getFormData () {
      return {
        'vm-propsData-components': this.form.components
      }
    },
    filterOptions (input, option) {
      return (
        option.componentOptions.children[0].text.includes(input)
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .button-container{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
