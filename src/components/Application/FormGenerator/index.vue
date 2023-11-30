<template>
  <div class="form-generator-container" @change="(e) => eventInterceptor(e)">
    <a-form :model="formData" :rules="formRules">
      <a-radio-group v-if="radioButtonFormConfig.length" v-model:value="radioButtonValue">
        <a-radio-button v-for="conf in radioButtonFormConfig" :key="conf.key" :value="conf.key">
          <Action :title="conf.label">
            <Icon :type="conf.props.icon" />
          </Action>
        </a-radio-button>
      </a-radio-group>

      <a-row :gutter="[8, 8]">
        <a-col
          v-for="conf in config"
          :key="conf.key"
          :span="conf.layout ? conf.layout.col : 24"
          v-show="isFormVisible(conf)"
        >
          <template v-if="!conf.children || !conf.children.length">
            <a-form-item
              has-feedback
              v-bind="{
                ...validateInfos[conf.key],
                labelCol: conf.layout ? conf.layout.labelCol : { span: 24 },
                wrapperCol: conf.layout ? conf.layout.wrapperCol : { span: 24 },
              }"
            >
              <template #label>
                <LabelMeta :config="conf" :getEventParameters="getEventParameters" />
              </template>

              <component
                :is="getComponentType(conf)"
                v-bind="{
                  ...conf.props,
                  config: conf,
                  value: formData[conf.key],
                  setValue: (value) => {
                    formData[conf.key] = value
                  },
                  assetsManager,
                  placeholder: conf.label,
                  getEventParameters,
                }"
                v-model:value="formData[conf.key]"
                v-model:checked="formData[conf.key]"
                autocomplete="off"
                @change="onChange"
              />
            </a-form-item>
          </template>

          <template v-else>
            <!-- collapse form -->
            <a-collapse v-if="conf.type === FormType.COLLAPSE" ghost>
              <a-collapse-panel :key="conf.key" :header="conf.label" forceRender>
                <FormGenerator
                  :config="conf.children"
                  :defaultValue="formData[conf.key]"
                  :assetsManager="assetsManager"
                  :eventParameters="eventParameters"
                  @change="(value) => onSubChange(conf.key, value)"
                />
              </a-collapse-panel>
            </a-collapse>

            <!-- normal form -->
            <FormGenerator
              v-else
              :config="conf.children"
              :defaultValue="formData[conf.key]"
              :assetsManager="assetsManager"
              :eventParameters="eventParameters"
              @change="(value) => onSubChange(conf.key, value)"
            />
          </template>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
  import { cloneDeep } from 'lodash-es'
  import { ref, toRaw, defineComponent } from 'vue'
  import { Form } from 'ant-design-vue'
  import { FormGeneratorConfig, FormType } from './model'

  import LabelMeta from './LabelMeta.vue'
  import UploadDragger from './components/UploadDragger.vue'
  import ColorPicker from './components/ColorPicker.vue'
  import Toolbar from './components/Toolbar.vue'

  export default defineComponent({
    name: 'FormGenerator',
    components: {
      LabelMeta,
      UploadDragger,
      ColorPicker,
      Toolbar,
    },
    props: {
      config: {
        type: Array as () => FormGeneratorConfig[],
        required: true,
      },
      defaultValue: {
        type: Object,
        required: false,
        default: () => {},
      },
      assetsManager: {
        type: Object,
        required: false,
      },
      eventParameters: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    emit: ['change'],
    setup(props, { emit: emits }) {
      const formData = ref(props.defaultValue || {})
      const formRules = ref({})

      const useForm = Form.useForm
      const { validateInfos } = useForm(formData, formRules)

      function getComponentType(config) {
        if (config.type.includes('?')) {
          return config.type.split('?')[0]
        }

        return `a-${config.type}`
      }

      function onChange() {
        emits('change', cloneDeep(toRaw(formData.value)))
      }

      function onSubChange(key, value) {
        formData.value[key] = value
        onChange()
      }

      function getEventParameters(formItemConfig) {
        return {
          ...props.eventParameters,
          config: props.config,
          formData,
          formItemConfig: cloneDeep(toRaw(formItemConfig)),
          onChange,
        }
      }

      function eventInterceptor(e) {
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation()
        }
      }

      /**
       * radio button form
       */
      const radioButtonValue = ref('')
      const radioButtonFormConfig = ref([] as FormGeneratorConfig[])
      function initRadioButtonForm() {
        radioButtonFormConfig.value = props.config.filter(
          (conf) => conf.type === FormType.RADIOBUTTON,
        )
        if (radioButtonFormConfig.value.length) {
          radioButtonValue.value = radioButtonFormConfig.value[0].key
        }
      }
      initRadioButtonForm()

      function isFormVisible(config) {
        if (!radioButtonFormConfig.value.find((conf) => conf.type === FormType.RADIOBUTTON)) {
          return true
        }
        return radioButtonValue.value === config.key
      }

      return {
        FormType,
        formData,
        formRules,
        validateInfos,

        getComponentType,
        onChange,
        onSubChange,
        getEventParameters,
        eventInterceptor,

        radioButtonValue,
        radioButtonFormConfig,
        isFormVisible,
      }
    },
  })
</script>

<style lang="less" scoped>
  .form-generator-container {
    :deep(.@{ant-prefix}-collapse) {
      &-header {
        padding: 12px 0 !important;
      }
      &-content-box {
        padding: 0 !important;
      }
    }

    :deep(.@{ant-prefix}-radio-group) {
      margin-bottom: 1rem;

      .@{ant-prefix}-radio-button-wrapper {
        height: 32px;
        width: 32px;

        > span {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
