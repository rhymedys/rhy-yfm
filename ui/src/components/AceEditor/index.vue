<template>
  <div
    ref="editorElement"
    :class="className"
    :style="$options.defaultStyle"
  ></div>
</template>

<script>
import mockEditor from './mockEditor'

const ModeMap = {
  javascript: 'ace/mode/javascript',
  json: 'ace/mode/json',
  text: 'ace/mode/text',
  xml: 'ace/mode/xml',
  html: 'ace/mode/html',
}

const defaultStyle = { width: '100%', height: '200px' }

function getMode(mode) {
  return ModeMap[mode] || ModeMap.text
}

export default {
  name: 'AceEditor',
  defaultStyle,
  props: {
    data: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function,
      default: () => {},
    },
    insertCode: {
      type: Function,
      default: () => {},
    },
    callback: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    data(newData) {
      if (this.editor && this.editor.getValue() !== newData) {
        this.editor.setValue(newData)
        const mode = this.mode || 'javascript'
        this.editor.editor.getSession().setMode(getMode(mode))
        this.editor.editor.clearSelection()
      }
    },
  },
  mounted() {
    this.editor = mockEditor({
      container: this.$refs.editorElement,
      data: this.data,
      onChange: this.onChange,
      readOnly: this.readOnly,
      fullScreen: this.fullScreen,
    })
    const mode = this.mode || 'javascript'
    this.editor.editor.getSession().setMode(getMode(mode))
    if (typeof this.callback === 'function') {
      this.callback(this.editor.editor)
    }
  },
}
</script>
<style lang="less" scoped>
.ace_editor.fullScreen {
  height: auto;
  width: auto;
  border: 0;
  margin: 0;
  position: fixed !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000008;
}

.ace_editor .ace_print-margin {
  visibility: hidden !important;
}

.fullScreen {
  overflow: hidden;
}

.ace_editor.ace-xcode {
  background-color: #f5f5f5;
  color: #000000;
}
</style>
