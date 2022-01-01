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
      const color="#262626";
      // const color="#7d7d7d";
      if (Math.floor(i / 9) === 0) cell.style.borderTop = color+" solid 4px";
      if (Math.floor(i / 9) % 3 === 2) cell.style.borderBottom = color + " solid 4px";
      if (i % 9 === 0) cell.style.borderLeft = color + " solid 4px";
      if (i % 9 % 3 === 2) cell.style.borderRight = color + " solid 4px";

      //cell.style.borderWidth="3px";
    }
  }

  function display(ans) {
    for (let i = 0; i < N; i++) {
      const input = document.getElementById("room" + i);
      input.tabIndex="0";
      input.addEventListener("focus", () => {
        input.style.backgroundColor = "#ABE1FA";
      });
      input.addEventListener("blur", () => {
        input.style.backgroundColor = "transparent";
      });
      input.addEventListener("keydown", (e) => {
        if (e.code === "ArrowDown") {
          let j = i + 9;
          if (j < 81) {
            document.getElementById("room" + j).focus();
          }
        }
        else if (e.code === "ArrowUp") {
          let j = i - 9;
          if (j >= 0) {
            document.getElementById("room" + j).focus();
          }
        }
        else if (e.code === "ArrowRight") {
          let j = i % 9 + 1;
          if (j < 9) {
            document.getElementById("room" + (Math.floor(i / 9) * 9 + j)).focus();
          }
        }
        else if (e.code === "ArrowLeft") {
          let j = i % 9 - 1;
          if (j >= 0) {
            document.getElementById("room" + (Math.floor(i / 9) * 9 + j)).focus();
          }
        }
        else if (e.code === "Tab"||e.code==="Enter"){
          e.preventDefault();
          if(e.shiftKey===false){
            let j = i+1;
            if (j < 81) {
              document.getElementById("room" + j).focus();
            }
          }
          else{
            let j = i - 1;
            if (j >= 0) {
              document.getElementById("room" + j).focus();
            }
          }
        }
      })

      if (ans[i] !== "0") {
        input.classList.add("fixed");
        input.innerHTML = ans[i];
      }
      else {
        input.classList.remove("fixed");
        input.addEventListener("keydown",(e)=>{
          if (e.key === "1") input.innerHTML="1";
          else if (e.key === "2") input.innerHTML = "2";
          else if (e.key === "3") input.innerHTML = "3";
          else if (e.key === "4") input.innerHTML = "4";
          else if (e.key === "5") input.innerHTML = "5";
          else if (e.key === "6") input.innerHTML = "6";
          else if (e.key === "7") input.innerHTML = "7";
          else if (e.key === "8") input.innerHTML = "8";
          else if (e.key === "9") input.innerHTML = "9";
          else if (e.key === "0"||e.key === "Backspace"||e.key === "Delete") {
            input.innerHTML = "";
          }
        });
      }
    }
  }

  function compress(str){
    let res="";
    let z_cnt=0;
    for(let i=0;i<str.length;i++){
      if(str[i]==="0")z_cnt++;
      else{
        while(z_cnt>0){
          if(z_cnt>=26){
            res+="z";
            z_cnt-=26;
          }
          else{
            res+=String.fromCodePoint(z_cnt+'a'.charCodeAt()-1);
            z_cnt=0;
          }
        }
        res+=str[i];
      }
    }
    while (z_cnt > 0) {
      if (z_cnt >= 26) {
        res += "z";
        z_cnt -= 26;
      }
      else {
        res += String.fromCodePoint(z_cnt + 'a'.charCodeAt() - 1);
        z_cnt = 0;
      }
    }
    return res;
  }

  function deploy(str) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
      if (/^[a-z]+$/.test(str[i])) {
        for (let j = 0; j < str[i].charCodeAt() - 'a'.charCodeAt() + 1; j++) {
          res += "0";
        }
      }
      else if (/^[0-9]+$/.test(str[i])) {
        res += str[i];
      }
    }
    return res;
  }

  function seedCheck(str){
    str = str.trim();
    if(!/^[0-9a-zA-Z]+$/.test(str))return false;
    str=deploy(str);
    if(str.length!==N)return false;
    display(str);
    return true;
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
    const startTime = performance.now();
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
        return 1;
      }
      
      display(ans);
      const endTime = performance.now();
      console.log(Math.floor(endTime - startTime) + " ms");
      return 3;
    }
    else{
      console.log("複数の解が存在します");
      return 2;
    }
  }

  function getSeed(){
    const seed = document.getElementById("seed").value;
    if (!seedCheck(seed)) console.log("No");
  }

  //decolate();

  //judge("060040000408200950200830000000009507107000030340000200006050004000000090005006000");
  //judge("800000000003600000070090200050007000000045700000100030001000068008500010090000400");
  //display("060040000408200950200830000000009507107000030340000200006050004000000090005006000");

  const button=document.getElementById("submit");
  button.addEventListener("click",getSeed);

  seedCheck("a6b4d4a82b95a2b83i95a71a7d3a34d2d6a5c4g9c5b6c");

  console.log(compress("060040000408200950200830000000009507107000030340000200006050004000000090005006000"));

  //seedCheck("12345abA ");
}
