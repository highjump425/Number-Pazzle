'use strict';
{
  const Flag =[1<<0,1<<1,1<<2,1<<3,1<<4,1<<5,1<<6,1<<7,1<<8];
  const Full = (1<<9)-1;
  const N = 81;
  let cnt = 0;
  let grid = Array(N);
  grid.fill(0);
  let columns = Array(9);
  columns.fill(0);
  let rows = Array(9);
  rows.fill(0);
  let blocks = Array(9);
  blocks.fill(0);
  let ans = "";

  function decolate() {
    for (let i = 0; i < N; i++) {
      const cell = document.getElementById("cell" + i);
      if (Math.floor(i / 9) === 0) cell.style.borderTopWidth = "3px";
      if (Math.floor(i / 9) % 3 === 2) cell.style.borderBottomWidth = "3px";
      if (i % 9 === 0) cell.style.borderLeftWidth = "3px";
      if (i % 9 % 3 === 2) cell.style.borderRightWidth = "3px";

      //cell.style.borderWidth="3px";
    }
  }

  function display(ans) {
    decolate();
    let line = "";
    for (let i = 0; i < N; i++) {
      const cell = document.getElementById("cell" + i);
      cell.innerHTML = ans[i];
      if (i % 27 === 0) {
        console.log(" _________________ ");
        line = "";
      }
      if (i % 9 === 0) line += "|";
      line += ans[i];
      line += (i % 3 != 2 ? " " : "|");
      if (i % 9 === 8) {
        console.log(line);
        line = "";
      }
    }
    console.log(" _________________ ");
  }

  function dfs(num){
    if(num===N){
      cnt++;
      ans="";
      for(let i=0;i<N;i++){
        ans+=grid[i];
      }
      return (cnt<=1);
    }
    if(grid[num]!==0){
      return dfs(num+1);
    }

    let r = Math.floor(num / 9);
    let c = num % 9;
    let b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    let check = 0;
    check |= columns[c];
    check |= rows[r];
    check |= blocks[b];
    if(check===Full)return true;
    for(let i=0;i<9;i++){
      if(check&Flag[i])continue;
      grid[num]=i+1;
      columns[c] |= Flag[i];
      rows[r] |= Flag[i];
      blocks[b] |= Flag[i];
      if (!dfs(num + 1)) return false;
      grid[num] = 0;
      columns[c] &= ~Flag[i];
      rows[r] &= ~Flag[i];
      blocks[b] &= ~Flag[i];
    }
    return true;
  }

  function judge(input) {
    cnt=0;
    let flag=true;
    for(let i=0;i<N;i++){
      let r = Math.floor(i / 9);
      let c = i % 9;
      let b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      let v = Number(input[i]);
      grid[i]=v;
      if(v===0)continue;
      if (columns[c] & Flag[v - 1]) flag = false;
      else columns[c] |= Flag[v - 1];
      if (rows[r] & Flag[v - 1]) flag = false;
      else rows[r] |= Flag[v - 1];
      if (blocks[b] & Flag[v - 1]) flag = false;
      else blocks[b] |= Flag[v - 1];
    }

    if(!flag){
      console.log("不適切な初期配置です");
      return 0;
    }
    if(dfs(0)){
      if (cnt === 0) {
        console.log("解が存在しません");
        return 0;
      }
      
      display(ans);
    }
    else{
      console.log("複数の解が存在します");
      return 0;
    }
  }

  

  const startTime = performance.now();
  judge("060040000408200950200830000000009507107000030340000200006050004000000090005006000");
  //judge("800000000003600000070090200050007000000045700000100030001000068008500010090000400");
  const endTime = performance.now();
  console.log(Math.floor(endTime - startTime)+ " ms");
  //display("060040000408200950200830000000009507107000030340000200006050004000000090005006000");
}
