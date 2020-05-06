import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // this.$store 
// Vue.use(axios); // this.$axios 

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

// 빈칸은 -1 지뢰 -7 칸을 열면 0 ....

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0, // 0 이상이면 다 opened
};

const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = []; // 랜덤하게 지뢰 심기. 
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL); // CODE 각각의 칸의 상태를 의미. 
        }
    }

    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }

    console.log(data);
    return data;
};

export default new Vuex.Store({
    state: {
        tableData: [],
        data: {
            row: 0,
            cell: 0,
            mine: 0,
        },
        timer: 0,
        halted: true, // 처음 시작될 떄는 게임이 중단된 상태였다가 시작하면 진행되기 때문에 시작되면 halted가 false가 됨. 그 떄 타이머 작동.
        result: "",
        openedCount: 0,
    }, // Vue 의 data 와 유사
    getters: {

    }, // Vue 의 computed 와 유사 state에 추가적인 작업할 때
    mutations: {
        [START_GAME](state, { row, cell, mine }) {
            state.data = {
                row,
                cell,
                mine,
            };
            state.tableData = plantMine(row, cell, mine);
            state.timer = 0;
            state.halted = false;
            state.openedCount = 0;
            state.result = '';
        },
        [OPEN_CELL](state, { row, cell }) {
            let openedCount = 0;
            const checked = [];
            function checkAround(row, cell) { // 주변 8칸 지뢰인지 검색
                const checkRowOrCellIsUndefined = row < 0 || row >= state.tableData.length || cell < 0 || cell >= state.tableData[0].length;
                if (checkRowOrCellIsUndefined) {
                    return;
                }
                if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(state.tableData[row][cell])) {
                    return;
                }
                if (checked.includes(row + '/' + cell)) {
                    return; // 한 번 연 칸이면 종료
                } else {
                    checked.push(row + '/' + cell); // 열지 않은 칸이면 checcked 에 푸슁해서 열지 않게. 
                }
                let around = [];
                if (state.tableData[row - 1]) {
                    around = around.concat([
                        state.tableData[row - 1][cell - 1], state.tableData[row - 1][cell], state.tableData[row - 1][cell + 1]
                    ]);
                }
                around = around.concat([
                    state.tableData[row][cell - 1], state.tableData[row][cell + 1]
                ]);
                if (state.tableData[row + 1]) {
                    around = around.concat([
                        state.tableData[row + 1][cell - 1], state.tableData[row + 1][cell], state.tableData[row + 1][cell + 1]
                    ]);
                }
                const counted = around.filter(function (v) {
                    return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
                });
                if (counted.length === 0 && row > -1) { // 주변칸에 지뢰가 하나도 없으면
                    const near = [];
                    if (row - 1 > -1) {
                        near.push([row - 1, cell - 1]);
                        near.push([row - 1, cell]);
                        near.push([row - 1, cell + 1]);
                    }
                    near.push([row, cell - 1]);
                    near.push([row, cell + 1]);
                    if (row + 1 < state.tableData.length) {
                        near.push([row + 1, cell - 1]);
                        near.push([row + 1, cell]);
                        near.push([row + 1, cell + 1]);
                    }
                    near.forEach((n) => {
                        if (state.tableData[n[0]][n[1]] !== CODE.OPENED) {
                            checkAround(n[0], n[1]); // 재귀. 반복문 같은 역할 할 수 있다. 주위 칸들 열고, 또 그 칸들의 주위 칸들을 열고...
                        }
                    });
                }
                if (state.tableData[row][cell] === CODE.NORMAL) {
                    openedCount += 1;
                }
                Vue.set(state.tableData[row], cell, counted.length); // 주변 칸들의 개수
            }
            checkAround(row, cell); 
            let halted = false;
            let result = '';
            if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 지금까지 연 칸의 개수가 방금 연칸의 개수의 합이 같으면 승리.
                halted = true;
                result = `GREAT! Your Record: ${state.timer}s`;
            }
            state.openedCount += openedCount;
            state.halted = halted;
            state.result = result;
        },
        [CLICK_MINE](state, { row, cell }) {
            state.halted = true;
            Vue.set(state.tableData[row], cell, CODE.CLICKED_MINE);
        },
        [FLAG_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.MINE) {
                Vue.set(state.tableData[row], cell, CODE.FLAG_MINE);
            } else {
                Vue.set(state.tableData[row], cell, CODE.FLAG);
            }
        },
        [QUESTION_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.FLAG_MINE) {
              Vue.set(state.tableData[row], cell, CODE.QUESTION_MINE);
            } else {
              Vue.set(state.tableData[row], cell, CODE.QUESTION);
            }
          },
        [NORMALIZE_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.QUESTION_MINE) {
              Vue.set(state.tableData[row], cell, CODE.MINE);
            } else {
              Vue.set(state.tableData[row], cell, CODE.NORMAL);
            }
          },
        [INCREMENT_TIMER](state) {
            state.timer += 1;
        },

    }, // state 를 수정할 때 사용. 동기적으로. 
    //mutatiotion 의 함수는 대문자로 짓는게 Vue 커뮤니티의 규칙

})