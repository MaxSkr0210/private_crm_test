<template>
  <tr class="item">
    <td v-for="(value, key) in diet" :key="key" align="center">
      <span v-if="typeof value === 'number' || typeof value === 'string'">
        {{ value }}
      </span>
      <tr v-else v-for="(item, index) in value" :key="item" class="subitem">
        <span v-if="typeof item === 'string' || typeof item === 'number'">
          {{ item }}
        </span>
        <span v-else>{{ item.start_date }} - {{ item.end_date }}</span>
        <hr v-if="value.length - index !== 1" />
      </tr>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    diet: {},
  },
};
</script>

<style lang="scss">
.subitem {
  width: 100%;
}
</style>
