<template>
  <div>
    <input type="number" placeholder="row" :value="row" @change="onChangeRow" />
    <input type="number" placeholder="cell" :value="cell" @change="onChangeCell" />
    <input type="number" placeholder="mine" :value="mine" @change="onChangeMine" />
    <button @click="onClickBtn">START</button>
  </div>
</template>


<script>
import { START_GAME } from './store';
export default {
    data() {
        return {
           row: 10,
           cell: 10,
           mine: 20, 
        };
    },
    methods: {
        onChangeRow(e) {
            this.row = e.target.value;
        },
        onChangeCell(e) {
            this.cell = e.target.value;
        },
        onChangeMine(e) {
            this.mine = e.target.value;
        },
        onClickBtn() {
            this.$store.commit(START_GAME, { row: this.row, cell: this.cell, mine: this.mine })
        }
    },
}
</script>

<style>
input {
    height: 30px;
    font-size: 15px;
    width: 100px;
    text-align: center;
    font-family: Georgia, 'Times New Roman', Times, serif
}
button {
    height: 40px;
    width: 100px;
    font-size: medium;
    background-color: #c2185b;
    font-family:Impact,'Arial Narrow Bold', sans-serif
}

</style>