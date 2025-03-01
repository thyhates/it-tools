<script setup>
import { useCopy } from '@/composable/copy.ts';
import { hashSync } from 'bcryptjs';

const checkForm = reactive({
  type: 'hex',
  text: '',
  hexResult: '',
  decResult: '',
  octResult: '',
  binResult: '',
});
const copyText = reactive({
  value: '2',
});
const lastCopy = computed(() => {
  return copyText.value;
});

function clickCopy(result) {
  copyText.value = result;
  copy();
}

const { copy } = useCopy({ source: lastCopy, text: 'Hashed string copied to the clipboard' });

function formatHex(s) {
  if (s.indexOf(' ') < 0 && s.length % 2 == 1) {
    s = '0' + s;
  }
  s = s.replace(/(\w{2})(?=[^ ])/gim, '$1 ');
  s = s.replace(/^(\w) /gim, '0$1 ');
  s = s.replace(/ (\w)$/gim, ' 0$1');
  s = s.replace(/ (\w) /gim, ' 0$1 ');
  s = s.replace(/ (\w) /gim, ' 0$1 ');
  s = s.replace(/\s{2,}/gim, ' ');
  return s;
}

function hexToAscii(hex) {
  if (hex == '') {
    return '';
  }
  var ascii = '';
  var hexs = hex.trim().split(' ');
  for (var i = 0; i < hexs.length; i++) {
    var c = String.fromCharCode('0x' + hexs[i]);
    ascii += c;
  }
  return ascii;
}

function asciiToHex(ascii) {
  if (ascii == '') {
    return '';
  }
  var hex = '';
  for (var i = 0; i < ascii.length; i++) {
    var c = ascii.charCodeAt(i);
    hex += c.toString(16).padLeft('0', 2);
    hex += ' ';
  }
  return hex;
}

String.prototype.padLeft = function (padChar, width) {
  var ret = this;
  while (ret.length < width) {
    if (ret.length + padChar.length < width) {
      ret = padChar + ret;
    } else {
      ret = padChar.substring(0, width - ret.length) + ret;
    }
  }
  return ret;
};

String.prototype.padRight = function (padChar, width) {
  var ret = this;
  while (ret.length < width) {
    if (ret.length + padChar.length < width) {
      ret += padChar;
    } else {
      ret += padChar.substring(0, width - ret.length);
    }
  }
  return ret;
};

String.prototype.startWith = function (str) {
  var reg = new RegExp('^' + str);
  return reg.test(this);
};

String.prototype.endWith = function (str) {
  var reg = new RegExp(str + '$');
  return reg.test(this);
};

function calculate() {
  let hex = checkForm.text;
  if (checkForm.type === 'hex') {
    hex = formatHex(hex);
    checkForm.text = hex;
  } else {
    hex = asciiToHex(hex);
  }
  if (hex === '') {
    alert('请输入要校验的数据');
    return;
  }
  var reg = /^([0-9a-fA-F]{1,2}\s)*([0-9a-fA-F]{1,2})?$/g;
  var b = reg.test(hex);
  if (!b) {
    checkForm.hexResult = '';
    checkForm.decResult = '';
    checkForm.octResult = '';
    checkForm.binResult = '';
    alert('数据格式不正确');
    return;
  }

  var count = 0;
  var sum = 0;
  var ss = hex.split(' ');
  for (var i = 0; i < ss.length; i++) {
    if (ss[i] === '') {
      continue;
    }
    sum = sum ^ parseInt(ss[i], 16);
    count++;
  }

  var dec = sum;
  var oct = dec.toString(8);

  var hexResult = dec.toString(16);
  hexResult = hexResult.toUpperCase();
  hexResult = hexResult.padLeft('0', 2);

  var bin = dec.toString(2);
  bin = bin.padLeft('0', 8);
  bin = bin.substr(0, 4) + ' ' + bin.substr(4, 4);
  checkForm.hexResult = hexResult;
  checkForm.decResult = dec;
  checkForm.octResult = oct;
  checkForm.binResult = bin;
}

function typeChange(value) {
  let nextValue = value.target.value;
  if (nextValue === 'ascii') {
    let middleValue = formatHex(checkForm.text);
    checkForm.text = hexToAscii(middleValue);
  } else {
    checkForm.text = asciiToHex(checkForm.text);
  }
}

function resetForm() {
  checkForm.text = '';
  checkForm.hexResult = '';
  checkForm.decResult = '';
  checkForm.octResult = '';
  checkForm.binResult = '';
}
</script>

<template>
  <c-card title="BCC校验">
    <n-form label-width="120">
      <n-form-item label="输入类型:" label-placement="left">
        <input @change="typeChange" id="hex" v-model="checkForm.type" type="radio" value="hex" />
        <label for="hex" style="margin-right: 16px">Hex</label>
        <input @change="typeChange" id="ascii" v-model="checkForm.type" type="radio" value="ascii" />
        <label for="ascii">Ascii</label>
      </n-form-item>
      <div>
        <n-form-item
          :feedback="
            checkForm.type === 'hex' ? '输入的数据为16进制，例如：31 32 33 34' : '输入的数据为ascii字符串，例如：1234'
          "
          label="需要校验的数据:"
          label-placement="left"
        >
          <c-input-text v-model:value="checkForm.text" placeholder=" " raw-text multiline rows="4" />
        </n-form-item>
      </div>
      <n-form-item style="margin-top: 8px" label=" " label-placement="left" :show-feedback="false">
        <c-button style="margin-right: 16px" @click="calculate()"> 计算</c-button>
        <c-button type="error" @click="resetForm()"> 清空</c-button>
      </n-form-item>
      <n-form-item style="margin-top: 16px" label="校验结果(hex):" label-placement="left">
        <c-input-text v-model:value="checkForm.hexResult" style="min-height: 18px" placeholder="" readonly />
        <c-button @click="clickCopy(checkForm.hexResult)" style="margin-left: 8px"> 复制</c-button>
      </n-form-item>
      <n-form-item label="校验结果(dec):" label-placement="left">
        <c-input-text v-model:value="checkForm.decResult" placeholder="" readonly />
        <c-button @click="clickCopy(checkForm.decResult)" style="margin-left: 8px"> 复制</c-button>
      </n-form-item>
      <n-form-item label="校验结果(oct):" label-placement="left">
        <c-input-text v-model:value="checkForm.octResult" placeholder="" readonly />
        <c-button @click="clickCopy(checkForm.octResult)" style="margin-left: 8px"> 复制</c-button>
      </n-form-item>
      <n-form-item label="校验结果(bin):" label-placement="left">
        <c-input-text v-model:value="checkForm.binResult" placeholder="" readonly />
        <c-button @click="clickCopy(checkForm.binResult)" style="margin-left: 8px"> 复制</c-button>
      </n-form-item>
    </n-form>
  </c-card>
  <c-card title="BCC校验小知识">
    <p style="text-indent: 2em">
      BCC(Block Check
      Character/信息组校验码)，因校验码是将所有数据异或得出，故俗称异或校验。具体算法是：将每一个字节的数据（一般是两个16进制的字符）进行异或后即得到校验码。
    </p>
    <p>例如16进制数据：01 A0 7C FF 02</p>
    <p>计算：01 xor A0 xor 7C xor FF xor 02 = 20</p>
    <p>校验码是：20</p>
  </c-card>
</template>
