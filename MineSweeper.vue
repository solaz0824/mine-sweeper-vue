<template>
  <div class="allStyle">
    <mine-form />
    <div class="textStyle">Timer: {{timer}}</div>
    <table-component />
    <div class=textStyle>{{result}}</div>
  </div>
</template>



<script>
import { mapState } from "vuex";

import store, { INCREMENT_TIMER } from "./store";
import TableComponent from "./TableComponent";
import MineForm from "./MineForm";

let interval;
export default {
  store,
  components: {
    TableComponent,
    MineForm
  },
  computed: {
    ...mapState(["timer", "result", "halted"])
  },
  methods: {},
  watch: {
    halted(value, oldValue) {
      if (value === false) {
        // false 일 때 게임 시작.
        interval = setInterval(() => {
          this.$store.commit(INCREMENT_TIMER);
        }, 1000); // javascript 의 timer 는 정확하지 않을 수 있기 떄문에 정확한 시간을 원하면 new Date() 를 통해서 해야 할 수도 있다. 
      } else {
        clearInterval(interval);
      }
    },
  }
};
</script>

<style>
.allStyle {
  text-align: center;
  margin: 1%;
  font-family: monospace;
  font-size: x-large;
}

.textStyle {
    margin: 1% 0;
} 
table {
  border-collapse: collapse;
  display: flex;
  flex-direction: column;
  align-items: center;
}
td {
  border: 1px solid #49599a;
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: large;
}
  
</style>