/**
 * 获取生命密码
 */
class lifeCode {
    constructor() {
      this.code = {};
      this.unicode = ["ijm","kln","mno","jmw","imx","xws","noq","mop","qpr","knv","lnu","vut"];
    }
    // 数字相加
    merge(...reset) {
      let num = 0;
      for (let item of [...reset]) {
        num += parseInt(item);
      }
      if ((num + "").length == 2) {
        return this.merge(...(num + ""));
      } else {
        return parseInt(num);
      }
    }
    // 联合码组合
    union() {
      let data = {};
      for (let item of this.unicode) {
        data[item] =
          "" + this.code[item[0]] + this.code[item[1]] + this.code[item[2]];
      }
      return data;
    }
  
    // 主码对应的五行-金木水火土
    fiveElement(masterCode) {
      switch (masterCode) {
        case 1:
          return "金";
        case 2:
          return "水";
        case 3:
          return "火";
        case 4:
          return "木";
        case 5:
          return "土";
        case 6:
          return "金";
        case 7:
          return "水";
        case 8:
          return "火";
        default:
          return "木";
      }
    }
    // 設置成number類型
    transNumber(obj) {
      Object.keys(obj).forEach((key, i) => {
        obj[key] = parseInt(obj[key]);
      });
      return obj;
    }
    // 生成生命密码
    createCode(birth) {
      let [e, f, g, h, c, d, a, b] = [...birth];
      this.code = { a, b, c, d, e, f, g, h };
      this.code = this.transNumber(this.code);
      this.code.i = this.merge(a, b);
      this.code.j = this.merge(c, d);
      this.code.k = this.merge(e, f);
      this.code.l = this.merge(g, h);
  
      this.code.m = this.merge(this.code.i, this.code.j);
      this.code.n = this.merge(this.code.k, this.code.l);
      this.code.o = this.merge(this.code.m, this.code.n);
  
      this.code.p = this.merge(this.code.m, this.code.o);
      this.code.q = this.merge(this.code.n, this.code.o);
      this.code.r = this.merge(this.code.q, this.code.p);
  
      this.code.x = this.merge(this.code.m, this.code.i);
      this.code.w = this.merge(this.code.m, this.code.j);
      this.code.s = this.merge(this.code.x, this.code.w);
  
      this.code.v = this.merge(this.code.n, this.code.k);
      this.code.u = this.merge(this.code.n, this.code.l);
      this.code.t = this.merge(this.code.v, this.code.u);
  
      this.code = Object.assign({}, this.code, this.union());
  
      this.code.inward = this.merge(this.code.n, this.code.m, this.code.o);
      this.code.outward = this.merge(this.code.s, this.code.r, this.code.t);
      this.code.subconscious = this.merge(this.code.i, this.code.l, this.code.o);
      this.code.family_code = this.code.j + this.code.k;
      this.code.five_elements = this.fiveElement(this.code.o)
      this.code.birthday = birth
  
      return this.code
    }

    // 生成主码
    createMasterCode(birth){
      let [e, f, g, h, c, d, a, b] = [...birth];
      let m = this.merge(this.merge(a, b), this.merge(c, d));
      let n = this.merge(this.merge(e, f), this.merge(g, h));
      let o = this.merge(m, n);

      return o
    }
    // 主码描述
    masterCodeDesc(masterCode){
      switch (parseInt(masterCode)) {
        case 1:
          return "勇往直前1号人";
        case 2:
          return "细腻敏感2号人";
        case 3:
          return "热情活力3号人";
        case 4:
          return "精于规划4号人";
        case 5:
          return "自由冒险5号人";
        case 6:
          return "追求完美6号人";
        case 7:
          return "人见人爱7号人";
        case 8:
          return "一诺千金8号人";
        default:
          return "丰盈乐享9号人";
      }
    }
  }
  
  module.exports = new lifeCode()
  
//   export default lifeCode;
  