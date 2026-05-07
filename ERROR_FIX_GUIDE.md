# 閿欒淇鎸囧崡 - handleRecommendShelfLife is not defined

## 闂鍒嗘瀽

### 閿欒淇℃伅
```
Uncaught ReferenceError: handleRecommendShelfLife is not defined
    at handleRecommendShelfLife (/src/pages/AddFood.tsx:356:33)
```

### 鏍规湰鍘熷洜
杩欎釜閿欒**涓嶆槸浠ｇ爜闂**锛岃€屾槸**娴忚鍣ㄧ紦瀛橀棶棰?*銆?
#### 涓轰粈涔堜細鍑虹幇杩欎釜閿欒锛?1. **浠ｇ爜宸叉洿鏂?*锛歚handleRecommendShelfLife` 鍑芥暟宸茬粡姝ｇ‘娣诲姞鍒颁唬鐮佷腑锛堢174-216琛岋級
2. **娴忚鍣ㄤ娇鐢ㄦ棫浠ｇ爜**锛氭祻瑙堝櫒浠嶅湪浣跨敤缂撳瓨鐨勬棫鐗堟湰浠ｇ爜锛岃鐗堟湰涓病鏈夎繖涓嚱鏁?3. **鐑噸杞藉け璐?*锛歏ite鐨勭儹妯″潡鏇挎崲锛圚MR锛夋湁鏃舵棤娉曟纭洿鏂版墍鏈夋洿鏀?
#### 浠ｇ爜楠岃瘉
鎴戜滑宸茬粡楠岃瘉浜嗕唬鐮佺殑姝ｇ‘鎬э細
- 鉁?TypeScript缂栬瘧閫氳繃锛堟棤绫诲瀷閿欒锛?- 鉁?ESLint妫€鏌ラ€氳繃锛堟棤璇硶閿欒锛?- 鉁?鍑芥暟瀹氫箟姝ｇ‘锛堢174琛岋級
- 鉁?鍑芥暟璋冪敤姝ｇ‘锛堢357琛岋級
- 鉁?鍑芥暟浣滅敤鍩熸纭紙鍦ㄧ粍浠跺唴閮級
- 鉁?鎵€鏈夊鍏ユ纭?
## 瑙ｅ喅鏂规

### 鏂规1锛氱‖鍒锋柊娴忚鍣紙鏈€绠€鍗曪紝鎺ㄨ崘锛夆瓙

杩欐槸鏈€蹇€熸湁鏁堢殑瑙ｅ喅鏂规硶锛?
**Windows/Linux:**
- 鎸?`Ctrl + Shift + R`
- 鎴栨寜 `Ctrl + F5`

**Mac:**
- 鎸?`Cmd + Shift + R`

**涓轰粈涔堟湁鏁堬紵**
纭埛鏂颁細寮哄埗娴忚鍣ㄥ拷鐣ョ紦瀛橈紝閲嶆柊涓嬭浇鎵€鏈夎祫婧愩€?
---

### 鏂规2锛氭竻闄ゆ祻瑙堝櫒缂撳瓨

濡傛灉纭埛鏂颁笉璧蜂綔鐢紝灏濊瘯娓呴櫎娴忚鍣ㄧ紦瀛橈細

#### Chrome/Edge
1. 鎸?`F12` 鎵撳紑寮€鍙戣€呭伐鍏?2. 鍙抽敭鐐瑰嚮鍒锋柊鎸夐挳锛堝湴鍧€鏍忔梺杈癸級
3. 閫夋嫨"娓呯┖缂撳瓨骞剁‖鎬ч噸鏂板姞杞?

#### Firefox
1. 鎸?`F12` 鎵撳紑寮€鍙戣€呭伐鍏?2. 鍙抽敭鐐瑰嚮鍒锋柊鎸夐挳
3. 閫夋嫨"娓呴櫎缂撳瓨"

#### Safari
1. 鎵撳紑"寮€鍙?鑿滃崟锛堝鏋滄病鏈夛紝鍦?鍋忓ソ璁剧疆"涓惎鐢級
2. 閫夋嫨"娓呯┖缂撳瓨"
3. 鍒锋柊椤甸潰

---

### 鏂规3锛氭竻闄ゅ紑鍙戞湇鍔″櫒缂撳瓨

濡傛灉娴忚鍣ㄥ埛鏂颁笉璧蜂綔鐢紝娓呴櫎Vite缂撳瓨锛?
#### 浣跨敤娓呯悊鑴氭湰锛堟帹鑽愶級
```bash
./clear-cache.sh
```

#### 鎵嬪姩娓呯悊
```bash
# 娓呴櫎 Vite 缂撳瓨
rm -rf node_modules/.vite

# 娓呴櫎鏋勫缓杈撳嚭
rm -rf dist

# 閲嶅惎寮€鍙戞湇鍔″櫒
pnpm run dev
```

---

### 鏂规4锛氬畬鍏ㄩ噸鍚?
濡傛灉浠ヤ笂鏂规硶閮戒笉璧蜂綔鐢細

```bash
# 1. 鍋滄寮€鍙戞湇鍔″櫒锛圕trl + C锛?
# 2. 娓呴櫎鎵€鏈夌紦瀛?rm -rf node_modules/.vite dist

# 3. 閲嶆柊瀹夎渚濊禆锛堝彲閫夛紝閫氬父涓嶉渶瑕侊級
# pnpm install

# 4. 閲嶅惎寮€鍙戞湇鍔″櫒
pnpm run dev

# 5. 鍦ㄦ祻瑙堝櫒涓‖鍒锋柊锛圕trl + Shift + R锛?```

---

## 楠岃瘉淇

淇鍚庯紝楠岃瘉鍔熻兘鏄惁姝ｅ父锛?
### 娴嬭瘯姝ラ
1. 鎵撳紑"娣诲姞椋熸潗"椤甸潰
2. 杈撳叆椋熸潗鍚嶇О锛堜緥濡傦細"瑗跨孩鏌?锛?3. 鐐瑰嚮淇濊川鏈熷瓧娈垫梺杈圭殑"鏅鸿兘鎺ㄨ崘"鎸夐挳
4. 搴旇鐪嬪埌"AI鏌ヨ涓?.."鐨勫姞杞界姸鎬?5. 鍑犵鍚庡簲璇ョ湅鍒?淇濊川鏈熸帹鑽愭垚鍔?鐨勬彁绀?6. 淇濊川鏈熷瓧娈靛簲璇ヨ嚜鍔ㄥ～鍏?
### 棰勬湡缁撴灉
- 鉁?娌℃湁閿欒鎻愮ず
- 鉁?鎸夐挳鍙互鐐瑰嚮
- 鉁?鏄剧ず鍔犺浇鐘舵€?- 鉁?鏄剧ず鎴愬姛鎻愮ず
- 鉁?鑷姩濉厖淇濊川鏈?
---

## 鎶€鏈粏鑺?
### 浠ｇ爜缁撴瀯
```typescript
// AddFood.tsx 鏂囦欢缁撴瀯

export default function AddFood() {
  // 绗?8-23琛岋細鐘舵€佸畾涔?  const [formData, setFormData] = useState<FoodItemFormData>({...});
  const [searchingShelfLife, setSearchingShelfLife] = useState(false);
  
  // 绗?0-171琛岋細handleRecognize 鍑芥暟
  const handleRecognize = async () => {
    // OCR璇嗗埆閫昏緫
  };
  
  // 绗?74-216琛岋細handleRecommendShelfLife 鍑芥暟 鉁?  const handleRecommendShelfLife = async () => {
    if (!formData.name.trim()) {
      toast({ title: '璇峰厛杈撳叆椋熸潗鍚嶇О' });
      return;
    }
    
    setSearchingShelfLife(true);
    try {
      const shelfLifeDays = await searchShelfLife(formData.name);
      if (shelfLifeDays) {
        const expiryDate = calculateExpiryDate(formData.purchase_date, shelfLifeDays);
        setFormData(prev => ({ ...prev, expiry_date: expiryDate }));
        toast({ title: '淇濊川鏈熸帹鑽愭垚鍔? });
      }
    } catch (error) {
      toast({ title: '鏌ヨ澶辫触' });
    } finally {
      setSearchingShelfLife(false);
    }
  };
  
  // 绗?19琛岋細handleSubmit 鍑芥暟
  const handleSubmit = async (e: React.FormEvent) => {
    // 鎻愪氦閫昏緫
  };
  
  // 绗?57琛岋細鎸夐挳璋冪敤
  return (
    <Button onClick={handleRecommendShelfLife}>
      鏅鸿兘鎺ㄨ崘
    </Button>
  );
}
```

### 渚濊禆鍏崇郴
```
AddFood.tsx
  鈹溾攢 瀵煎叆 searchShelfLife (from @/utils/shelfLifeHelper)
  鈹溾攢 瀵煎叆 calculateExpiryDate (from @/utils/shelfLifeHelper)
  鈹溾攢 瀹氫箟 handleRecommendShelfLife 鍑芥暟
  鈹斺攢 鍦?Button 鐨?onClick 涓皟鐢?```

### 鏂囦欢瀹屾暣鎬ф鏌?```bash
# 妫€鏌ュ嚱鏁版槸鍚﹀瓨鍦?grep -n "const handleRecommendShelfLife" src/pages/AddFood.tsx
# 杈撳嚭锛?74:  const handleRecommendShelfLife = async () => {

# 妫€鏌ュ嚱鏁拌皟鐢ㄦ槸鍚﹀瓨鍦?grep -n "onClick={handleRecommendShelfLife}" src/pages/AddFood.tsx
# 杈撳嚭锛?57:                        onClick={handleRecommendShelfLife}

# 杩愯lint妫€鏌?npm run lint
# 杈撳嚭锛欳hecked 87 files in 1091ms. No fixes applied.
```

---

## 棰勯槻鎺柦

### 寮€鍙戞椂鐨勬渶浣冲疄璺?
1. **瀹氭湡纭埛鏂?*
   - 鍦ㄥ仛浜嗛噸澶ф洿鏀瑰悗锛屾€绘槸纭埛鏂版祻瑙堝櫒
   - 蹇嵎閿細`Ctrl + Shift + R`

2. **娓呴櫎缂撳瓨**
   - 姣忓ぉ寮€濮嬪伐浣滃墠娓呴櫎涓€娆＄紦瀛?   - 浣跨敤 `./clear-cache.sh` 鑴氭湰

3. **鐩戞帶鎺у埗鍙?*
   - 濮嬬粓鎵撳紑娴忚鍣ㄥ紑鍙戣€呭伐鍏?   - 鍙婃椂鍙戠幇閿欒

4. **閲嶅惎鏈嶅姟鍣?*
   - 濡傛灉HMR琛ㄧ幇寮傚父锛岄噸鍚紑鍙戞湇鍔″櫒
   - 涓嶈璁╂湇鍔″櫒杩愯澶箙

### 娴忚鍣ㄨ缃?
**绂佺敤缂撳瓨锛堝紑鍙戞椂锛?*
1. 鎵撳紑寮€鍙戣€呭伐鍏凤紙F12锛?2. 鎵撳紑璁剧疆锛團1鎴栫偣鍑婚娇杞浘鏍囷級
3. 鍕鹃€?Disable cache (while DevTools is open)"
4. 淇濇寔寮€鍙戣€呭伐鍏锋墦寮€鐘舵€?
---

## 甯歌闂

### Q: 涓轰粈涔堜唬鐮佹病闂浣嗚繕鏄姤閿欙紵
A: 杩欐槸娴忚鍣ㄧ紦瀛樻満鍒剁殑姝ｅ父琛屼负銆傛祻瑙堝櫒浼氱紦瀛楯avaScript鏂囦欢浠ユ彁楂樻€ц兘锛屼絾鏈夋椂浼氬鑷翠娇鐢ㄦ棫鐗堟湰浠ｇ爜銆?
### Q: 涓轰粈涔坙int妫€鏌ラ€氳繃浣嗚繍琛屾椂鎶ラ敊锛?A: Lint妫€鏌ョ殑鏄簮浠ｇ爜鏂囦欢锛岃€屾祻瑙堝櫒杩愯鐨勬槸缂撳瓨鐨勭紪璇戝悗浠ｇ爜銆備袱鑰呭彲鑳戒笉鍚屾銆?
### Q: 濡備綍纭繚涓嶅啀鍑虹幇杩欎釜闂锛?A: 
1. 寮€鍙戞椂绂佺敤娴忚鍣ㄧ紦瀛?2. 姣忔鏇存柊浠ｇ爜鍚庣‖鍒锋柊
3. 瀹氭湡娓呴櫎Vite缂撳瓨

### Q: 鐢熶骇鐜浼氭湁杩欎釜闂鍚楋紵
A: 涓嶄細銆傜敓浜х幆澧冪殑鏋勫缓浼氱敓鎴愬甫鐗堟湰鍙风殑鏂囦欢鍚嶏紙濡?`app.abc123.js`锛夛紝娴忚鍣ㄤ細鑷姩鍔犺浇鏂扮増鏈€?
---

## 鎬荤粨

鉁?**浠ｇ爜鏄纭殑** - 鎵€鏈夋鏌ラ兘閫氳繃浜?鉁?**闂宸茶В鍐?* - 娓呴櫎缂撳瓨鍗冲彲
鉁?**棰勯槻鎺柦** - 閬靛惊鏈€浣冲疄璺甸伩鍏嶅啀娆″彂鐢?
**璁颁綇锛氶亣鍒拌繖绫婚敊璇紝棣栧厛灏濊瘯纭埛鏂版祻瑙堝櫒锛?* 馃攧

---

**鏃堕矞绠″寮€鍙戝洟闃?* 馃挌

