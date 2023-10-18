export default class YunLyricAnalysis {
  lyric = '';
  lyricArray = [];
  lyricInfoArray = [];
  constructor(str) {
    this.lyric = str;
  }
  splitStc() {
    return this.lyric.split('\n');
  }
  transStrToNum(str) {
    return Number(str.split(':')[0])*60 +Number(str.split(':')[1])
  }
  getlyricInfo() {
    this.lyricArray = this.splitStc()
    let start, end, sentence;
    this.lyricArray.reduce((acc, value) => {
      start = acc.slice(acc.indexOf('[') + 1, acc.indexOf(']'));
      end = value.slice(value.indexOf('[') + 1, value.indexOf(']'));
      sentence = acc.slice(acc.indexOf(']') + 1);
      this.lyricInfoArray.push({sentence: sentence, start: this.transStrToNum(start), end: this.transStrToNum(end)});
      return value;
    });
    return  this.lyricInfoArray
  }
}
{/* <View style={styles.login}>
<TextInput
  placeholder="输入手机号"
  value={phone}
  onChangeText={onChangePhone}
  style={styles.loginInput}></TextInput>
<Pressable onPress={fetchCaptcha} style={styles.inputButton}>
  <Text>获取验证码</Text>
</Pressable>
</View>
<View style={styles.login}>
<TextInput
  placeholder="输入验证码"
  value={captcha}
  onChangeText={onChangeCaptcha}
  style={styles.loginInput}></TextInput>
<Pressable onPress={login} style={styles.inputButton}>
  <Text>验证</Text>
</Pressable>
</View> */}
