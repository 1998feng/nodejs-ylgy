const axios = require('axios');

let ok = 0;
let err = 0;

const headers = {
  'content-type': 'application/json',
  "Host": "cat-match.easygame2021.com",
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.27(0x18001b36) NetType/WIFI Language/zh_CN",
  "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/17/page-frame.html",
  "Accept-Encoding": "gzip,compress,br,deflate",
  "Connection": "close"
}

// 用户登录接口
let user_login_api = "https://cat-match.easygame2021.com/sheep/v1/user/login_oppo";
// 临时token
let temp_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQ1MzQxMzcsIm5iZiI6MTY2MzQzMTkzNywiaWF0IjoxNjYzNDMwMTM3LCJqdGkiOiJDTTpjYXRfbWF0Y2g6bHQxMjM0NTYiLCJvcGVuX2lkIjoiIiwidWlkIjoxMzU5Njk1MiwiZGVidWciOiIiLCJsYW5nIjoiIn0.rxNp69Cy_UmYZt1uzsGkIKFBOZehW3vXzo3kltJtybY"

main();

async function main() {
  const uid = process.argv[2];
  const count = process.argv[3];
  console.time("任务完成用时")
  console.log(`uid:${uid},通关次数:${count}`)
  if (!uid) {
    console.error("请使用 npm run start xxxxx(uid)")
    return;
  }
  const token = await uid2token(uid)

  if (!token) {
    console.log('获取token失败');
    return;
  }

  const interval = setInterval(() => {
    if (ok == count) {
      clearInterval(interval)
      ok = 0;
      err = 0;
      console.timeEnd("任务完成用时")
      return;
    }
    sheep_win(token)
  }, 500)
}

/** 根据uid获取token */
async function uid2token(uid) {
  const {
    wx_open_id,
    avatar,
  } = await getOpenId(uid);
  const res = await axios.post(user_login_api, {
    headers,
    "uid": wx_open_id,
    "nick_name": "1",
    "avatar": avatar,
    "sex": 1
  })
  return res.data.data.token
}

async function getOpenId(uid) {
  const res = await axios.get(`https://cat-match.easygame2021.com/sheep/v1/game/user_info?uid=${uid}&t=${temp_token}`, {
    headers
  });
  return res.data.data;
}

function sheep_win(token) {
  const rank_time = Math.floor(Math.random() * 10000);
  axios.get(`https://cat-match.easygame2021.com/sheep/v1/game/game_over?rank_score=1&rank_state=1&rank_time=${rank_time}&rank_role=1&skin=1&t=${token}`, {
    headers
  }).then(res => {
    ok++;
  }).catch(error => {
    err++;
  }).finally(() => {
    console.log(`====================羊了个羊勇敢通关${ok}次====================`);
    err > 0 && console.log(`====================羊了个羊闯关失败${err}次====================`);
  })
}
