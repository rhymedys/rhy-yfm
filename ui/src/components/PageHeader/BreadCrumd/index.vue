<template>
  <div class="bread">
    <Breadcrumb class="bread__wrapper">
      <BreadcrumbItem
        v-for="item of list"
        :key="`bread-crumb-${item.name}`"
        :to="item.to"
      >
        {{ showTitle(item) }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem } from 'view-design'
import { showTitle } from '~/utils'

export default {
  name: 'BreadCrumd',
  components: {
    Breadcrumb,
    BreadcrumbItem,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showTitle,
  },
}
</script>

<style lang="less" scoped>
.bread {
  display: inline-block;
  vertical-align: top;
  height: 100%;
  margin-left: 0px;
  position: relative;

  &__wrapper {
    line-height: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 500px;
    > span {
      &:first-child {
        display: none;
      }
    }
  }
}
</style>
