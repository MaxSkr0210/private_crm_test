<template>
  <div class="main">
    <filters :diets="allDiets" @filtered="filter"></filters>
    <table border="1">
      <tr>
        <th>Номер</th>
        <th>Имя</th>
        <th>Диеты</th>
        <th>Тариф</th>
        <th>Адрес</th>
        <th>Телефон</th>
        <th>Дата начала - конца диеты</th>
        <th>Скидка</th>
        <th>Оплата</th>
        <th>Курьеру</th>
        <th>Примечание</th>
        <th @click="sort('status')">Статус</th>
      </tr>
      <table_row
        v-for="(diet, index) in diets"
        :key="index"
        :diet="diet"></table_row>
    </table>
  </div>
</template>

<script>
import data from "../data.json";
import table_row from "@/components/table_row.vue";
import filters from "@/components/filters.vue";

export default {
  name: "App",
  data() {
    return {
      allDiets: [], // немного изменные начальные данные для фильтрации
      diets: [], // немного изменные начальные данные
      fullDiets: [], // разделенные данные по времени, те у одного объекта по одному тарифу, времени, плану
      sorted: false, // флаг для сортировки
    };
  },
  components: {
    table_row,
    filters,
  },
  methods: {
    filter(data) {
      this.diets = data;
    },
    // фильтр массивов
    filterArray(arr, key, value) {
      return arr.filter((item) => {
        console.log(item[key]);
        return item[key].includes(value);
      });
    },
    // функция для метода sort, сортировка по убыванию
    compareFnDesc(a, b) {
      const _a = parseInt(a.status.match(/\d+/));
      const _b = parseInt(b.status.match(/\d+/));
      if (_a < _b) return 1;
      if (_a > _b) return -1;
      return 0;
    },
    // функция для метода sort, сортировка по возрастанию
    compareFnDAbs(a, b) {
      const _a = parseInt(a.status.match(/\d+/));
      const _b = parseInt(b.status.match(/\d+/));
      if (_a > _b) return 1;
      if (_a < _b) return -1;
      return 0;
    },
    //сортировка диет
    sort(key) {
      if (this.sorted) {
        this.diets = this.diets.reverse();
        return;
      }
      if (Array.isArray(this.diets[0][key])) {
        this.diets = this.fullDiets;
      }

      //Идет разделение массива на несколько категорий, каждая из которых в процессе сортируется и потом, полученные массивы объединяются.
      const begins = this.filterArray(this.diets, key, "Начинается через").sort(
        this.compareFnDesc
      );
      const endsToday = this.filterArray(
        this.diets,
        key,
        "Заканчивается сегодня"
      );
      const endsTomorrow = this.filterArray(
        this.diets,
        key,
        "Заканчивается завтра"
      );
      const endsSoon = this.filterArray(
        this.diets,
        key,
        "Заканчивается через"
      ).sort(this.compareFnDAbs);
      const alreadyEnds = this.filterArray(this.diets, key, "Закончилось").sort(
        this.compareFnDAbs
      );
      this.diets = [
        ...begins,
        ...endsToday,
        ...endsTomorrow,
        ...endsSoon,
        ...alreadyEnds,
      ];

      this.sorted = true;
    },

    countDays(d1, d2) {
      const timeDiff = d1 - d2;
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },

    // Формирование столбца Статус
    entry_time(start_date, end_date) {
      const today = new Date().getTime();
      const sd = new Date(start_date).getTime();
      const ed = new Date(end_date).getTime();
      let res = "";

      if (today < sd) {
        const diffDays = this.countDays(sd, today);
        res = `Начинается через ${diffDays} дней`;
      } else if (today >= sd && ed > today) {
        const diffDays = this.countDays(ed, today);
        if (diffDays === 0) res = "Заканчивается сегодня";
        if (diffDays === 1) res = "Заканчивается завтра";
        else res = `Заканчивается через ${diffDays} дней`;
      } else if (ed < today) {
        const diffDays = this.countDays(today, ed);
        res = `Закончилось ${diffDays} дней назад`;
      }

      return res;
    },
  },
  created() {
    //изменение изначальных данных и запись в переменную diets
    for (let i = 0; i < data.length; i++) {
      //добавление столбца pay_info, который объединяет order_sum, order_payed и pay_status
      data[i].pay_info = `${data[i].order_sum}, ${data[i].pay_status}, долг=${
        data[i].order_sum - Number(data[i].order_payed)
      }`;

      const courier_comment = data[i].courier_comment;
      const inner_comment = data[i].inner_comment;

      delete data[i].courier_comment;
      delete data[i].inner_comment;
      delete data[i].order_sum;
      delete data[i].order_payed;
      delete data[i].pay_status;

      data[i].courier_comment = courier_comment;
      data[i].inner_comment = inner_comment;
    }

    this.diets = data;

    // добавление столбца status для понимания, когда начнется или закончится та или иная диета
    for (let i = 0; i < this.diets.length; i++) {
      this.diets[i].status = [];
      for (let j = 0; j < this.diets[i].dates.length; j++) {
        const entry_time = this.entry_time(
          this.diets[i].dates[j].start_date,
          this.diets[i].dates[j].end_date
        );

        this.diets[i].status.push(entry_time);

        const forFullDiets = structuredClone(this.diets[i]);

        forFullDiets.diets = [this.diets[i].diets[j]];
        forFullDiets.tariff = [this.diets[i].tariff[j]];
        forFullDiets.dates = [this.diets[i].dates[j]];
        forFullDiets.status = this.diets[i].status[j];

        this.fullDiets.push(forFullDiets);
      }
    }

    this.allDiets = Object.assign([], this.fullDiets);
  },
  mounted() {
    // исправление размеров ячеек таблицы (временно)
    const trs = document.querySelectorAll(".tr");

    for (let i = 0; i < trs.length; i++) {
      const childrens = trs[i].children;
      childrens[0].width = "60px;";
      childrens[1].width = "150px;";
      childrens[2].width = "60px;";
      childrens[3].width = "60px";
      childrens[4].width = "180px;";
      childrens[5].width = "120px;";
      childrens[6].width = "120px;";
    }
  },
};
</script>

<style lang="scss">
table {
  width: 100%;
}

td,
th {
  word-wrap: break-word;
}
</style>
