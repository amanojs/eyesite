import './style.css';
import { GoogleLoader } from './modules/GoogleLoader';
import { Maps } from './hospitalClass/Maps';
import axios from 'axios';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello EyeSite!</h1>
`;

/**  div id = mapをhtmlから取得 */
const divMap = document.querySelector<HTMLDivElement>('#map');

/** 病院検索で受け取ったオブジェクトを格納するための変数 */
let hos_data: google.maps.places.PlaceResult[] | null;

// 住所の格納場所の親要素取得
const hospital_box = document.querySelector<HTMLDivElement>('#hospital_box');

/** Mapsクラスを実体化 */
const maps = new Maps(divMap);

GoogleLoader.load().then(async () => {
  /** 位置情報をもとに座標を取得 */
  const result = await maps.getLatLng();
  console.log(result);
  /** 地図表示＆病院検索 */
  maps.initMap(result);
  /** 検索 */
  hos_data = await maps.getHosdata(result);
  console.log(hos_data);

  // html表示
  if (hos_data) {
    // 取得した病院データの数だけ繰り返す
    for (let i = 0; i < hos_data?.length; i++) {
      const elem = document.createElement('div');
      // 生成されたHTML要素がクリックされた時の処理
      elem.onclick = () => {
        if (hos_data) {
          moveMap(hos_data[i].formatted_address || 'undefind');
        }
      };
      // id
      elem.id = 'hos_address' + i;
      // テキスト内容
      const hospital_address = hos_data[i].formatted_address;
      if (hospital_address) {
        elem.innerHTML = hospital_address;
        hospital_box?.appendChild(elem);
      }
    }
  }
});

/** 地図移動 */
function moveMap(address: string) {
  console.log('address:', address);
  GoogleLoader.load().then(() => {
    maps.move(address);
  });
}

/** 新規アカウント登録 */
const account_data = document.querySelector('input[type="submit"]');
account_data?.addEventListener(
  'click',
  function () {
    const mail = document.querySelector<HTMLInputElement>('#account_mail')?.value;
    const account_name = document.querySelector<HTMLInputElement>('#account_name')?.value;
    const question_type = document.querySelector<HTMLFormElement>('#question_box');
    const question_value = question_type?.elements[0];
    console.log(question_value);
  },
  false
);

// APIアクセス処理
const btn = document.querySelector<HTMLButtonElement>('#btn');

// html側のid(btn)がクリックされた時の処理
btn?.addEventListener(
  'click',
  async () => {
    const user_id = document.querySelector<HTMLInputElement>('#user_id')?.value;
    console.log(user_id);
    const res = await axios.get(`http://localhost:4000/selectEyeresult?id=${user_id}`);
    console.log(res);
  },
  false
);
