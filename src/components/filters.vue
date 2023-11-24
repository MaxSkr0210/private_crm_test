<template>
  <div class="filters">
    <div class="tariffs">
      <h3>Тариф</h3>
      <div class="item" v-for="t in tariffs" :key="t">
        <label
          ><input
            type="checkbox"
            name="tariff"
            :value="t"
            v-model="filter.tariff"
            @change="ch" />
          {{ t }}</label
        >
      </div>
    </div>
    <div class="pay_status">
      <h3>Статус оплаты</h3>
      <div class="item" v-for="pay in pay_statuses" :key="pay">
        <label
          ><input
            type="checkbox"
            name="tariff"
            :value="pay"
            v-model="filter.pay_info"
            @change="ch" />
          {{ pay }}</label
        >
      </div>
    </div>
    <div class="status">
      <h3>Статус</h3>
      <div class="item" v-for="status in statuses" :key="status">
        <label
          ><input
            type="checkbox"
            name="status"
            :value="status"
            v-model="filter.status"
            @change="ch" />
          {{ status }}</label
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "filters",
  props: {
    diets: {},
  },
  data() {
    return {
      filter: {
        tariff: [],
        status: [],
        pay_info: [],
      },
      allDiets: [],
      payes: [],
      pay_statuses: ["Оплачен", "Неоплачен"],
      tariffs: [
        "Базовый",
        "Пробный",
        "Подписка",
        "ТЕСТ ДРАЙВ",
        "ДЕНЬ РОЖДЕНИЯ",
      ],
      statuses: [
        "Начинается через",
        "Заканчивается сегодня",
        "Заканчивается завтра",
        "Заканчивается через",
        "Закончилось",
      ],
    };
  },
  methods: {
    filtered() {
      let res = [];

      for (let key in this.filter) {
        if (res.length === 0) {
          for (let value of this.filter[key]) {
            res.push(
              ...this.allDiets.filter((item) => item[key].includes(value))
            );
          }
        } else {
          for (let value of this.filter[key]) {
            res = res.filter((item) => item[key].includes(value));
          }
        }
      }

      return [...new Set(res)];
    },
    ch() {
      for (let key in this.filter) {
        if (this.filter[key].length > 0) {
          const res = this.filtered();
          this.$emit("filtered", res);
          break;
        } else {
          this.$emit("filtered", this.diets);
        }
      }
    },
  },
  mounted() {
    this.allDiets = this.diets;
  },
};
</script>

<style lang="scss">
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
