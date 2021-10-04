var express = require('express');
var router = express.Router();
const moment = require('moment')
const { getSMSInBox, clearSMS, getSMSOutBox, sendSMS, sendUSSD, replyUSSD } = require('../functionnality/sms')
const url = require('url')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {page:'Accueil', menuId:'home', query: req.query, path: "/"});
});

router.get('/error', function(req, res, next){
  res.render('error', {page:'Erreur', menuId:'listsms', message: "Erreur durant la requete. Veuiller bien verifier votre equipement ou les données des champs s'il existe.SVP!"})
});

router.get('/listsms', function(req, res, next) {
  getSMSInBox(
    (result) => {res.render('listsms', {page:'Boite de reception', menuId:'listsms', data: result, moment: moment, query: req.query, path: "/listsms"});}, 

    (error) => {res.redirect('/error');}
  );
  
});

router.get('/sendedsms', function(req, res, next) {
  getSMSOutBox(
    (result) => {res.render('sendedsms', {page:'Messages envoyés', menuId:'msgenvoye', data: result, moment: moment, query: req.query, path: "/sendedsms"});}, 

    (error) => {res.redirect('/error');}
  );
  
});

router.get('/sendsms', function(req, res, next) {
  res.render('sendsms', {page:'Nouveau message', menuId:'sendsms', query: req.query, path: "/sendsms"});
});

router.get('/api', function(req, res, next) {
  res.render('api', {page:'API', menuId:'api', query: req.query, path: "/api"});
});

router.post('/clear', function(req, res, next){

  clearSMS(
    () => {
      if(req.body.type=='inbox') return res.redirect('/listsms');
      else return res.redirect('/sendedsms')
      
    }, 
    () => {
      res.redirect('/error')
    },
     req.body.type
     );
});

router.post('/send', function(req, res, next){
  let phoneNumber = req.body.phone_number.split(";");
  sendSMS(
    () => {res.redirect('/sendedsms')},
    () => {res.redirect('/error')},
    phoneNumber,
    req.body.message
  )
})

router.post('/send/ussd', function(req, res, next){
  let code = req.body.ussd
  let queryURl = req.body.url
  if(req.body.action == "REPONDRE")
  {
    replyUSSD(
      (result) => {res.redirect(url.format({
        pathname : queryURl,
        query: {
          isUSSD: true,
          ussdContent: result
        }
      } 
      ))},
      (error) => {res.redirect('/error')},
      code
    )
  }
  else{
    sendUSSD(
      (result) => {res.redirect(url.format({
        pathname : queryURl,
        query: {
          isUSSD: true,
          ussdContent: result
        }
      } 
      ))},
      (error) => {res.redirect('/error')},
      code
    )
  }
 
})

router.post('/reply/ussd', function(req, res, next){
  let code = req.body.ussd
  let queryURl = req.body.url
  
})

//api routes

router.get('/api/sms/inbox', function(req, res){
  getSMSInBox(
    (result) => {res.send(result)},
    (error) => {res.send(error)}
  )
})

router.get('/api/sms/outbox', function(req, res){
  getSMSOutBox(
    (result) => {res.send(result)},
    (error) => {res.send(error)}
  )
})

router.delete('/api/sms/delete/inbox', function(req, res){
  clearSMS(
    (result) => {
     res.send(result)
      
    }, 
    (error) => {
      res.send(error)
    },
     "inbox"
     );
})

router.delete('/api/sms/delete/outbox', function(req, res){
  clearSMS(
    (result) => {
     res.send(result)
      
    }, 
    (error) => {
      res.send(error)
    },
     "outbox"
     );
})

router.post('/api/sms/send', function(req, res, next){
  let phoneNumber = req.body.phone_number.split(";");
  sendSMS(
    (result) => {res.send(result)},
    (error) => {res.send(error)},
    phoneNumber,
    req.body.message
  )
})

router.post('/api/ussd/send', function(req, res){
  let code = req.body.ussd
  sendUSSD(
    (result) => {res.send(result)},
    (error) => {res.send(error)},
    code
  )
})

router.post('/api/ussd/reply', function(req, res){
  let code = req.body.ussd
  replyUSSD(
    (result) => {res.send(result)},
    (error) => {res.send(error)},
    code
  )
})




module.exports = router;
