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
  let order = [0,1,2,3,4,5,6,7,8,];
  let perm = Array(N);
  for(let i=0;i<N;i++)perm[i]=i;
  let ans = "";
  let init = "";
  let select = -1;
  let left = N;
  let timerStop=performance.now();
  let timerStart = performance.now()+1;
  let cursor = "";
  let trueColor="#235BC8";
  let wrongColor="#ED1A3D";
  let trueBack = "#ABE1FA";
  let wrongBack = "#F5C9C6";

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      let j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
  }

  function roomFocus(e){
    cursor = e.target;
    e.target.style.backgroundColor = trueBack;
    if(e.target.innerHTML!==""){
      for(let i=0;i<N;i++){
        const room = document.getElementById("room" + i);
        if(room.innerHTML===e.target.innerHTML){
          room.style.backgroundColor=trueBack;
        }
      }
    }
  }

  function roomBlur(e){
    if (e.target.classList.contains("fixed")) {
      if (e.target.style.color == wrongColor) {
        e.target.style.backgroundColor = wrongBack;
      }
      else if (e.target.style.color == trueColor) {
        e.target.style.backgroundColor = trueBack;
      }
      else {
        e.target.style.backgroundColor = "white";
      }
    }
    else {
      e.target.style.backgroundColor = "white";
    }
    if (e.target.innerHTML !== "") {
      for (let i = 0; i < N; i++) {
        const room = document.getElementById("room" + i);
        if (room.innerHTML === e.target.innerHTML) {
          if (room.classList.contains("fixed")) {
            if (room.style.color == wrongColor) {
              room.style.backgroundColor = wrongBack;
            }
            else if (room.style.color == trueColor) {
              room.style.backgroundColor = trueBack;
            }
            else {
              room.style.backgroundColor = "white";
            }
          }
          else {
            room.style.backgroundColor = "white";
          }
        }
      }
    }
  }

  function setup(){
    for (let i = 0; i < N; i++) {
      const input = document.getElementById("room" + i);
      input.innerHTML="";
      input.tabIndex = "0";
      input.addEventListener("focus",roomFocus);
      input.addEventListener("blur", roomBlur);
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
        else if (e.code === "Tab" || e.code === "Enter") {
          e.preventDefault();
          if (e.shiftKey === false) {
            let j = i + 1;
            if (j < 81) {
              document.getElementById("room" + j).focus();
            }
          }
          else {
            let j = i - 1;
            if (j >= 0) {
              document.getElementById("room" + j).focus();
            }
          }
        }
      });
    }
  }

  function lock(){
    for (let i = 0; i < N; i++) {
      const input = document.getElementById("room" + i);
      input.innerHTML = "";
      input.style.backgroundColor="white";
      input.style.color="black";
      input.removeEventListener("keydown", keyInput);
      input.removeEventListener("click", tapInput);
      if(!input.classList.contains("fixed")){
        input.classList.add("fixed");
      }
    }
  }

  function unlock(){
    for (let i = 0; i < N; i++) {
      const input = document.getElementById("room" + i);
      input.innerHTML = "";
      if (input.classList.contains("fixed")) {
        input.classList.remove("fixed");
      }
    }
  }

  function keyInput(e){
    let empty = (e.target.innerHTML=== "");
    if (e.key === "1") {
      e.target.innerHTML="1";
      if(empty)left--;
    }
    else if (e.key === "2") {
      e.target.innerHTML = "2";
      if (empty) left--;
    }
    else if (e.key === "3"){
      e.target.innerHTML = "3";
      if (empty) left--;
    } 
    else if (e.key === "4") {
      e.target.innerHTML = "4";
      if (empty) left--;
    }
    else if (e.key === "5") {
      e.target.innerHTML = "5";
      if (empty) left--;
    }
    else if (e.key === "6"){
      e.target.innerHTML = "6";
      if(empty)left--;
    }
    else if (e.key === "7") {
      e.target.innerHTML = "7";
      if (empty) left--;
    }
    else if (e.key === "8") {
      e.target.innerHTML = "8";
      if (empty) left--;
    }
    else if (e.key === "9") {
      e.target.innerHTML = "9";
      if (empty) left--;
    }
    else if (e.key === "0"||e.key === "Backspace"||e.key === "Delete") {
      e.target.innerHTML = "";
      if(!empty)left++;
    }
    else if(e.key === "Enter"&&select!==-1){
      if (select === 0) {
        e.target.innerHTML = "";
        if (!empty) left++;
      }
      else {
        e.target.innerHTML = select;
        if(empty)left--;
      }
    }
    if(left===0)displayAns();
  }

  function tapInput(e){
    let empty=(e.target.innerHTML==="");
    if (select !== -1) {
      if (select === 0) {
        e.target.innerHTML = "";
        if(!empty)left++;
      }
      else {
        e.target.innerHTML = select;
        if(empty)left--;
      }
    }
    if(left===0)displayAns();
  }

  function beginTimer() {
    timerStart = performance.now();
    timerStop = performance.now();
  }

  function endTimer() {
    timerStop = performance.now();
    timerStart = performance.now()+1;
  }

  function getTimer() {
    if (timerStop < timerStart) return false;
    const timer = document.getElementById("timer");
    let sec = Math.floor(performance.now() - timerStart);
    sec = Math.floor(sec / 1000);
    let min = Math.floor(sec / 60);
    sec = sec % 60;
    let str="00"+sec;
    timer.innerHTML = min + ":" + str.slice(-2);
  }

  function display(place) {
    left=N;
    for (let i = 0; i < N; i++) {
      const input = document.getElementById("room" + i);
      input.style.backgroundColor="white";
      if (place[i] !== "0") {
        left--;
        input.classList.add("fixed");
        input.style.color="black";
        input.innerHTML = place[i];
      }
      else {
        input.innerHTML="";
        input.style.color=trueColor;
        input.classList.remove("fixed");
        input.addEventListener("keydown",keyInput);
        input.addEventListener("click",tapInput);
      }
    }
  }

  function displayAns(){
    getTimer();
    endTimer();
    for(let i=0;i<N;i++){
      const room = document.getElementById("room" + i);
      if(init[i]!=="0"||room.classList.contains("fixed"))continue;
      room.classList.add("fixed");
      room.removeEventListener("keydown",keyInput);
      room.removeEventListener("click",tapInput);
      if(ans[i]===room.innerHTML){
        room.style.color=trueColor;
        room.style.backgroundColor = trueBack;
      }
      else{
        room.style.color=wrongColor;
        room.innerHTML=ans[i];
        room.style.backgroundColor=wrongBack;
      }
    }
  }

  function displayRestart(){
    left=N;
    beginTimer();
    for (let i = 0; i < N; i++) {
      const room = document.getElementById("room" + i);
      if (init[i] !== "0") {
        left--;
        continue;
      }
      room.classList.remove("fixed");
      room.addEventListener("keydown", keyInput);
      room.addEventListener("click", tapInput);
      room.style.color=trueColor;
      room.style.backgroundColor="white"
      room.innerHTML="";
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

  function setError(e_num){
    const error=document.getElementById("error");
    const tools = document.getElementById("tools");
    tools.style.display="none";
    if(e_num===0){
      error.innerHTML="";
      error.style.display="none";
    }
    else {
      if (e_num === 1) error.innerHTML = "正しいシリアルコードを入力してください。";
      else if (e_num === 2) error.innerHTML = "不適切な初期配置です";
      else if (e_num === 3) error.innerHTML = "解が存在しません";
      else if (e_num === 4) error.innerHTML = "複数の解が存在します";
      else if(e_num===5)error.innerHTML = "すでに完成しています";
      error.style.display="inline";
    }
  }

  function setTools(){
    const tools=document.getElementById("tools");
    tools.style.display="flex";
  }

  function seedCheck(str){
    str = str.trim();
    const error = document.getElementById("error");
    if(str.length===0){
      setError(0);
      return false;
    }
    if(!/^[0-9a-zA-Z]+$/.test(str)){
      setError(1);
      return false;
    }
    str=deploy(str);
    if(str.length!==N){
      setError(1);
      return false;
    }
    error.innerHTML="";
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
    let hole=0;
    cnt=0;
    init=input;
    grid.fill(0);
    columns.fill(0);
    rows.fill(0);
    blocks.fill(0);
    let flag=true;
    for(let i=0;i<N;i++){
      let r = Math.floor(i / 9);
      let c = i % 9;
      let b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      let v = Number(input[i]);
      grid[i]=v;
      if(v===0)continue;
      hole++;
      if (columns[c] & Flag[v - 1]) flag = false;
      else columns[c] |= Flag[v - 1];
      if (rows[r] & Flag[v - 1]) flag = false;
      else rows[r] |= Flag[v - 1];
      if (blocks[b] & Flag[v - 1]) flag = false;
      else blocks[b] |= Flag[v - 1];
    }

    if(!flag)return 2;
    if(dfs(0)){
      if (cnt === 0)return 3;
      if(hole===5)return 5;
      //display(ans);
      const endTime = performance.now();
      // console.log(Math.floor(endTime - startTime) + " ms");
      return 0;
    }
    else return 4;
  }

  function dfs_r(num) {
    if (num === N) {
      cnt++;
      ans = "";
      for (let i = 0; i < N; i++) {
        ans += grid[i];
      }
      return true;
    }
    let r = Math.floor(num / 9);
    let c = num % 9;
    let b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    let check = 0;
    shuffle(order);
    check |= columns[c];
    check |= rows[r];
    check |= blocks[b];
    if (check === Full) return false;
    for (let j = 0; j < 9; j++) {
      let i=order[j];
      if (check & Flag[i]) continue;
      grid[num] = i + 1;
      columns[c] |= Flag[i];
      rows[r] |= Flag[i];
      blocks[b] |= Flag[i];
      if (dfs_r(num + 1)) return true;
      grid[num] = 0;
      columns[c] &= ~Flag[i];
      rows[r] &= ~Flag[i];
      blocks[b] &= ~Flag[i];
    }
    return false;
  }

  function genRand(){
    grid.fill(0);
    columns.fill(0);
    rows.fill(0);
    blocks.fill(0);
    
    if (dfs_r(0)) {
      return Array.from(ans);
    }
    else return "";
  }

  function makePazzle(d=1){
    let hole=0;
    let str=genRand();

    let s;
    let r=Math.floor(Math.random()*5);
    let target=[42,50,56,]

    shuffle(perm);
    if(d===2){
      shuffle(order);
      let x=String(order[0]+1);
      let y=String(order[1]+1);
      console.log(x);
      for(let i=0;i<N;i++){
        if(str[i]===x)str[i]="0";
      }
    }
    for(let j=0;j<N;j++){
      let i=perm[j];
      s=str[i];
      str[i]="0";
      if(judge(str)!==0)str[i]=s;
      else hole++;
      if(hole===target[d]+r)break;
    }
    document.getElementById("seed").value=compress(str);
    getSeed();
  }

  function getGame(){
    newgame.classList.toggle("selected");
    const balloon = document.getElementsByClassName("balloon")[0];
    balloon.classList.toggle("show");
  }

  function getEasy(){
    makePazzle(0);
    getGame()
  }

  function getNormal(){
    makePazzle(1);
    getGame();
  }

  function getHard(){
    makePazzle(2);
    getGame();
  }

  function getSeed(){
    let seed = document.getElementById("seed").value;
    if (!seedCheck(seed)){
      lock();
      return;
    }
    seed=deploy(seed);
    let res=judge(seed);
    setError(res);
    if(res!==0){
      lock();
      return;
    }
    setTools();
    unlock();
    display(seed);
    beginTimer();
  }

  

  setup();
  lock();

  const newgame = document.getElementById("newgame");
  newgame.addEventListener("click",getGame);

  const watch = document.getElementById("watch");
  watch.addEventListener("click", () => {
    watch.classList.toggle("selected");
    const tools = document.getElementById("tools");
    tools.classList.toggle("hide");
  });

  const restart = document.getElementById("restart");
  restart.addEventListener('click', displayRestart);

  const answer=document.getElementById("answer");
  answer.addEventListener('click',displayAns);

  const easy=document.getElementById("easy");
  easy.addEventListener('click',getEasy);

  const normal=document.getElementById("normal");
  normal.addEventListener('click',getNormal);

  const hard=document.getElementById("hard");
  hard.addEventListener('click',getHard);

  for(let i=0;i<10;i++){
    const button=document.getElementById("switch"+i);
    button.addEventListener('click',(e)=>{
      if(select==-1){
        button.classList.add("selected");
        select=i;
      }
      else if(select===i){
        button.classList.remove("selected");
        select = -1;
      }
      else{
        const erase=document.getElementById("switch"+select);
        erase.classList.remove("selected");
        button.classList.add("selected");
        select=i;
      }
      if(cursor!="" && !cursor.classList.contains("fixed") && cursor.innerHTML==="" && select>0){
        cursor.innerHTML=select;
        left--;
      }
      button.focus();
    });
  }

  const button=document.getElementById("submit");
  button.addEventListener("click",getSeed);

  setInterval(getTimer,250);

  // makePazzle();

}
