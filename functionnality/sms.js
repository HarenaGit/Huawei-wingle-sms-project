const { HuaweiWingle4G } = require('huawei-wingle-4g');
const { username, password } = require('../wingle_config')

const huaweiWingle4G = new HuaweiWingle4G(username, password);

module.exports.getSMSInBox = async (success, error) => {
    const sms = huaweiWingle4G.getSms()
    try {
       const res = await sms.getInboxSmsList();
       
       return success(res);
    } catch (err) {
       
      return error(err);
    }
    
}

module.exports.getSMSOutBox = async (success, error) => {
   const sms = huaweiWingle4G.getSms()
   try {
      const res = await sms.getOutboxSmsList();
      
      return success(res);
   } catch (err) {
      
     return error(err);
   }
   
}

module.exports.clearSMS = async (success, error, type) => {
   const sms = huaweiWingle4G.getSms()
  
    try {
       let res = null;
       if(type=="inbox"){
         res = await sms.getInboxSmsList();
       }
       else{
          res = await sms.getOutboxSmsList();
       }
      
       let smsIds = []
       res.map((val, idx) => {
          smsIds.push(val.id)
       })
       if(smsIds.length != 0)  sms.removeSms(smsIds)
       return success(res);
    } catch (err) {
       
      return error(err);
    }

}

module.exports.sendSMS = async (success, error, phoneNumber, content) => {
   const sms = huaweiWingle4G.getSms()
    try {
       let res = null;
       if(phoneNumber.length != 0) res = await sms.sendSms(phoneNumber,content);
       
       return success(res);
    } catch (err) {
       
      return error(err);
    }
}
 
module.exports.sendUSSD = async (success, error, code) => {
   const ussd = huaweiWingle4G.getUssd()
   try {
      let res = null;
      res = await ussd.sendUssd(code)
      return success(res)
   } catch (err) {
      return error(err)
   }
}

module.exports.replyUSSD = async (success, error, code) => {
   const ussd = huaweiWingle4G.getUssd()
   try {
      let res = null;
      res = await ussd.reply(code)
      return success(res)
   } catch (err) {
      return (err)
   }
}











