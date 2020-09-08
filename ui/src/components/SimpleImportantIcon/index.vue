<template>
  <div class="important">
    <span v-if="txt" class="important__txt">{{ txt }}</span>
  </div>
</template>

<script>
export default {
  name: 'SimpleImportantIcon',
  props: {
    txt: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
.important {
  width: 24px;
  height: 24px;
  margin-top: 2px;
  line-height: 24px;
  border-radius: 50%;
  border-top: 1px solid #eb6c18;
  color: #fff;
  text-align: center;
  position: relative;
  -webkit-animation: 2s loading1 ease-in-out infinite;
  animation: 2s loading1 ease-in-out infinite;
  color: #722ed1;

  &:before,
  &:after {
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: -1px;
    left: 0;
  }

  &:before {
    border-top: 1px solid #c3c659;
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg);
  }

  &:after {
    border-top: 1px solid #b93be6;
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg);
  }

  &__txt {
    display: block;
    width: 24px;
    height: 24px;
    position: absolute;
    top: -1px;
    left: 0;
    -webkit-animation: 2s loading2 linear infinite;
    animation: 2s loading2 linear infinite;
  }
}

@-webkit-keyframes loading1 {
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes loading1 {
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loading2 {
  50% {
    -webkit-transform: rotate(-180deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes loading2 {
  50% {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>
