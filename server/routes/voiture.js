var mongoose = require( 'mongoose' );
var Voiture = require('../models/voiture');
var config = require('../config');

exports.savevoiture = function(req, res, next){
    const uid = req.params.id;
    const dt = req.body.expdate;
    const dt2 = req.body.expdate2;
    const typ = req.body.expaccount;
    const amt = req.body.expamt;
    const desc = req.body.expdesc;
    const expid = req.body.expid;

    if (!uid || !dt || !typ || !amt) {
        return res.status(422).send({ success: false, message: 'Posted data is not correct or incompleted.' });
    } else {

	if (expid) {
		//Edit voiture
		Voiture.findById(expid).exec(function(err, voiture){
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }

			if(voiture) {
        voiture.voituredate = dt;
        voiture.voituredate2 = dt2;
				voiture.voituretype = typ;
				voiture.voitureamt = amt;
				voiture.voituredesc = desc;
			}
			voiture.save(function(err) {
				if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				res.status(201).json({
					success: true,
					message: 'voiture updated successfully'
				});
			});
		});

	}else{

		// Add new voiture
		let oVoiture = new Voiture({
			userid: uid,
      voituredate: dt,
      voituredate2: dt2,
			voituretype: typ,
			voitureamt: amt,
			voituredesc: desc
		});

		oVoiture.save(function(err) {
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }

			res.status(201).json({
				success: true,
				message: 'voiture saved successfully'
			});
		});

	}
    }
}

exports.delvoiture = function(req, res, next) {
	Voiture.remove({_id: req.params.id}, function(err){
        if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
        res.status(201).json({
		success: true,
		message: 'voiture removed successfully'
	});
    });
}

exports.getvoiture = function(req, res, next){
	Voiture.find({_id:req.params.id}).exec(function(err, voiture){
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err });
        }
        res.status(201).json({
		success: true,
		data: voiture
	});
    });
}



exports.voiturereport = function(req, res, next){
    const uid = req.params.id || req.query.uname;
    const rptype = req.body.report || req.query.report;
    const from_dt = req.body.startdt || req.query.startdt;
    const to_dt = req.body.enddt || req.query.enddt;
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.body.page || req.query.page);
    let sortby = req.body.sortby || req.query.sortby;
    let query = {};

    if(!limit || limit < 1) {
	limit = 10;
    }

    if(!page || page < 1) {
	page = 1;
    }

    if(!sortby) {
	sortby = 'voituredate';
    }

    var offset = (page - 1) * limit;

    if (!uid || !rptype) {
        return res.status(422).send({ error: 'Posted data is not correct or incompleted.'});
	}else if(rptype === 'opt2' && !fromdt && !todt){
		return res.status(422).send({ error: 'From or To date missing.'});
	}else if(fromdt > todt){
		 return res.status(422).send({ error: 'From date cannot be greater than To date.'});
	}else{

		if(rptype === 'opt1'){
			// returns records for the current month
			let oDt = new Date();
			let month = oDt.getUTCMonth() + 1; //months from 1-12
			let year = oDt.getUTCFullYear();

			let fdt = new Date(year + "/" + month + "/1");
			let tdt = new Date(year + "/" + month + "/31");

			query = { userid:uid, voituredate:{$gte: fdt, $lte: tdt} };

			Voiture.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else if (rptype === 'opt2'){
			// return records within given date range
			query = { userid:uid, voituredate:{$gte: fromdt, $lte: todt} };

			Voiture.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else {
			// returns all voiture records for the user
			query = { userid:uid };

			Voiture.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});
		}

		var options = {
			select: 'voituredate voituredate2 voituretype voitureamt voituredesc',
			sort: sortby,
			offset: offset,
			limit: limit
		}

		Voiture.paginate(query, options).then(function(result) {
			res.status(201).json({
				success: true,
				data: result
			});
		});
	}
}
