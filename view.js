(function(){



var Chara;
Chara = (function(){

	function Chara(context, medias){

		this.imgTbl = [
			  'chara0.png'
			, 'chara1.png'
			, 'chara2.png'
			, 'chara3.png'
			, 'chara4.png'
		];

		this.size = 256;

		this.spriteTbl = [
			  [[1,1],[0,1],[1,1],[2,1]] // l
			, [[4,0],[3,0],[4,0],[5,0]] // u
			, [[4,1],[3,1],[4,1],[5,1]] // r
			, [[1,0],[0,0],[1,0],[2,0]] // d
		];
		this.img;
		this.ready 		= false;
		this.context 	= context;

		this.color 	= -1;
		
		this.direction = 3; // 0:l 1:u 2:r 3:d

		this.spriteIdx = 0;

		this.dx = 0;
		this.dy = 0;

		this.id = -1;

		this.moving = false;

		this.scale = 0.7;
		this.force = 48;
		this.name = '';

		this.medias = medias;

	}

	Chara.prototype.init = function() {
		//this.dx = Math.floor(Math.random()*(200-10)+10);
		//this.dy = Math.floor(Math.random()*(300-10)+10);
		this.dx = 2000;
		this.dy = 1100;
		this.setColor(Math.floor(Math.random()*(4-0)+0));
		return this;
	};

	Chara.prototype.input = function(dx, dy, direction) {
		this.dx = dx;
		this.dy = dy;
		this.direction = direction;
	};

	Chara.prototype.keyInput = function(keyBuffer) {
		this.moving = true;
		if (keyBuffer[37]) {
			this.direction = 0;
			this.dx -= this.force;
		} 
		else if (keyBuffer[38]) {
			this.direction = 1;
			this.dy -= this.force;
		}
		else if (keyBuffer[39]) {
			this.direction = 2;
			this.dx += this.force;
		}
		else if (keyBuffer[40]) {
			this.direction = 3;
			this.dy += this.force;
		}
		else {
			this.moving = false;
		}
	};

	Chara.prototype.drawOnPrerender = function() {
		if (this.ready && this.id > 0 && this.img) {

			//
			if (this.moving) {
				this.incIndex();
			}
			else {
				this.spriteIdx = 0;
			}

			//
			var pos = this.spriteTbl[this.direction][this.spriteIdx];
			var sx = pos[0] * this.size; var sy = pos[1] * this.size;
			this.context.drawImage(this.img, sx, sy, this.size, this.size, this.dx, this.dy, this.size * this.scale, this.size * this.scale);
			//this.context.fillStyle = "white";
			//this.context.font = "bold 32px sans-serif";
			//this.context.fillText(this.name, this.dx, this.dy, this.size * this.scale);
		}
	};

	Chara.prototype.incIndex = function() {
		var len = this.spriteTbl[this.direction].length;
		this.spriteIdx++;
		if (this.spriteIdx >= len) {
			this.spriteIdx = 0;
		}
		return this;
	};

	Chara.prototype.getContext = function() {
		return {
			  id:this.id
			, dx:this.dx
			, dy:this.dy
			, direction:this.direction
			, moving:this.moving
			, color:this.color
			, scale:this.scale
			, name:this.name
			, size:this.size
		};
	};

	Chara.prototype.setContext = function(ctx) {
		this.id = ctx.id;
		this.dx = ctx.dx;
		this.dy = ctx.dy;
		this.direction = ctx.direction;
		this.moving = ctx.moving;
		this.scale = ctx.scale;
		this.name = ctx.name;
		this.size = ctx.size;
		this.setColor(ctx.color);
		return this;
	};

	Chara.prototype.setForce = function(force) {
		this.force = force;
	};

	Chara.prototype.setScale = function(scale) {
		this.scale = scale;
	};

	Chara.prototype.setColor = function(color) {
		if (this.color === color) return;
		this.color = color;
		this.ready = false;

		var filename = this.imgTbl[this.color];
		this.img = this.medias[filename];
		this.ready = true;
		/*
		this.img = new Image();
		this.img.src = this.imgTbl[this.color];
		this.img.onload = (function (self) {
            return function () {
				self.ready = true;
            };
        })(this);
		*/
	}

	Chara.prototype.getForce = function() {
		return this.force;
	};

	Chara.prototype.getScale = function() {
		return this.scale;
	};

	return Chara;
})();

var Charas;
Charas = (function(){

	function Charas (chara, charasCanvasCtx, prerenderCanvas) {
		this.me = chara;
		this.charas = {};
		this.charasCanvasCtx = charasCanvasCtx;
		this.prerenderCanvas = prerenderCanvas;
	}

	Charas.prototype.has = function(id) {
		return id in this.charas;
	}

	Charas.prototype.add = function(chara) {
		this.charas[chara.id] = chara;
	}

	Charas.prototype.remove = function(id) {
		delete this.charas[id];
	}

	Charas.prototype.drawOnPrerender = function() {

		var charasPosTbl = [
			[0,0,128,128],
			[128,0,128,128],
			[0,128,128,128],
			[128,128,128,128]
		];

		var idx = 0;
		for (var id in this.charas) {

			// draw on prerender
			var chara = this.charas[id];
			chara.drawOnPrerender();

			// draw character on chara's canvas from prerender
			// var pos = charasPosTbl[idx];
			// var x = Math.max(chara.dx - pos[2] / 2, 0);
			// var y = Math.max(chara.dy - pos[3] / 2, 0);
			// x = Math.min(prerender.width - pos[2], x);
			// y = Math.min(prerender.height - pos[3], y);
			// this.charasCanvasCtx.drawImage(this.prerenderCanvas, x, y, 256, 256, pos[0], pos[1], pos[2], pos[3]);
		}

	}

	Charas.prototype.setContext = function(charaContext) {
		this.charas[charaContext.id].setContext(charaContext);
	}

	return Charas;
})();

var Saikoro;
Saikoro = (function(){

	function Saikoro(context, medias) {
		this.context = context;
		this.img;
		this.audio;
		this.ready = false;
		this.index = 0;
		this.size = 256;
		this.isShuffle = false;
		this.medias = medias;
	}

	Saikoro.prototype.init = function() {
		this.img = this.medias['saikoro.png'];
		this.audio = this.medias['saikoro_sound.wav'];
		this.ready = true;
		return this;
	}

	Saikoro.prototype.shuffleStart = function() {
		var cb = () => {
			console.log(this);
			this.isShuffle = false;
		}
		this.isShuffle = true;
		this.audio.addEventListener('ended', cb);
		this.audio.play();
	}

	Saikoro.prototype.draw = function() {
		if (this.ready) {
			var s = this.size;
			var x = (this.isShuffle) 
				? Math.floor(Math.random()*6) * this.size
				: this.index * this.size;
			this.context.clearRect(0,0,128,128);
			this.context.drawImage(this.img, x, 0, s, s, 0, 0, 128, 128);
		}
	}

	Saikoro.prototype.getContext = function() {
		return {
			index: this.index,
			isShuffle: this.isShuffle
		}
	}

	Saikoro.prototype.setContext = function(ctx) {
		this.index = ctx.index;
		this.isShuffle = ctx.isShuffle;
	}

	return Saikoro;

})();

var Map;
Map = (function(){
	/**
	 * 
	 * @param {*} context 
	 * @param {*} width 描画領域幅
	 * @param {*} height 描画領域縦 
	 */
	function Map(context, width, height, medias) {
		this.context = context;
		this.img;
		this.ready = false;
		this.width = width;
		this.height = height;
		this.medias = medias;
	}

	Map.prototype.init = function() {
		this.img = this.medias['map_full.jpg'];
		this.ready = true;
		return this;
	}

	Map.prototype.drawOnPrerender = function() {
		if (this.ready) {
			this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 
				0, 0, this.width, this.height);
		}
	}

	return Map;
})();

var Card;
Card = (function(){

	function Card(context, medias) {
		this.context = context;
		this.img;
		this.audio;
		this.ready = false;
		this.col = 0;
		this.row = 0;
		this.width = 300;
		this.height = 475;
		this.isShuffle = false;
		this.medias = medias;
	}

	Card.prototype.init = function() {
		this.img = this.medias['card.png'];
		this.audio = this.medias['talkcard_sound.wav'];
		this.ready = true;
		return this;
	}

	Card.prototype.shuffleStart = function() {
		var cb = () => {
			console.log(this);
			this.isShuffle = false;
		}
		this.isShuffle = true;
		this.audio.addEventListener('ended', cb);
		this.audio.play();
	}

	Card.prototype.draw = function() {
		if (this.ready) {
			var s = this.size;
			if (this.isShuffle) {
				var x = Math.floor(Math.random()*7) * this.width;
				var y = Math.floor(Math.random()*2) * this.height;
			}
			else {
				var x = this.col * this.width;
				var y = this.row * this.height;
			}
			this.context.clearRect(0,0,300,475);
			this.context.drawImage(this.img, x, y,300,475, 0, 0,300,475);
		}
	}

	Card.prototype.getContext = function() {
		return {
			col: this.col,
			row: this.row,
			isShuffle: this.isShuffle
		}
	}

	Card.prototype.setContext = function(ctx) {
		this.row = ctx.row;
		this.col = ctx.col;
		this.isShuffle = ctx.isShuffle;
	}

	return Card;

})();

window.onload = function() {

	// ----------------------------------------
	// key events
	//
	var keyBuffer = [];
	document.onkeydown = function (e){
		keyBuffer[e.keyCode] = true;
	};
	document.onkeyup = function (e){
		keyBuffer[e.keyCode] = false;
	};
	window.onblur = function (){
		keyBuffer = [];
	};

	// ----------------------------------------
	// elements 
	//
	var charasCanvas = document.getElementById('charasCanvas');
	var charasCanvasCtx = charasCanvas.getContext("2d");
	var prerender = document.getElementById('prerender');
	var prerenderCtx = prerender.getContext("2d");
	var saikoroCanvas = document.getElementById('saikoroCanvas');
	var saikoroCanvasCtx = saikoroCanvas.getContext("2d");
	var mapCanvas = document.getElementById('mapCanvas');
	var mapCanvasCtx = mapCanvas.getContext("2d");
	var cardCanvas = document.getElementById('cardCanvas');
	var cardCanvasCtx = cardCanvas.getContext("2d");
	var forceInput = document.getElementById('charaForce');
	var scaleInput = document.getElementById('charaScale');
	var nameInput = document.getElementById('charaName');
	var colorInput = document.getElementById('charaColor');
	var optionBtn = document.getElementById('optionBtn');
	var optionPain = document.getElementById('optionPain');
	var cardBtn = document.getElementById('cardBtn');
	var cardPain = document.getElementById('cardPain');
	var loading = document.getElementById('loading');

	// ----------------------------------------
	// instances
	//
	var me;
	var charas;
	var saikoro;
	var card;
	var map;

	// ----------------------------------------
	// properties 
	//
	var medias = {};
	var isPlaying = false;

	// ----------------------------------------
	// event handler
	//
	function onFrame() {

		// send player context.
		me.keyInput(keyBuffer);
		if (me.ready) sendPos(me.getContext());

		// draw saikoro on saikoro canvas.
		saikoro.draw();

		// draw card on card canvas.
		card.draw();

		// clear prerender canvas 
		prerenderCtx.clearRect(0,0,prerender.width, prerender.height);

		// draw map on prerender
		map.drawOnPrerender();

		// draw other characters on prerender
		charas.drawOnPrerender();

		// draw my character on prerender
		me.drawOnPrerender();

		// draw map on map canvas from prerender
		mapCanvasCtx.clearRect(0,0,mapCanvas.width, mapCanvas.height);
		mapCanvasCtx.drawImage(prerender, 0, 0, prerender.width, prerender.height, 
			0, 0, mapCanvas.width, mapCanvas.height);

		// draw my character on my canvas from prerender
		charasCanvasCtx.clearRect(0,0,charasCanvas.width, charasCanvas.height);
		var x = Math.max(me.dx - 390 /  4, 0);
		var y = Math.max(me.dy - 180 / 40, 0);
		x = Math.min(prerender.width -  390, x);
		y = Math.min(prerender.height - 180, y);
		charasCanvasCtx.drawImage(prerender, x, y, 390, 180, 0, 0, 390, 180);

		charasCanvasCtx.fillStyle = "white";
		charasCanvasCtx.font = "bold 32px sans-serif";
		charasCanvasCtx.fillText(me.name, 10, 40, 390);

		// draw other characters on character's canvas from prerender
		var charasPosTbl = [
			[0,0,128,128],
			[128,0,128,128],
			[0,128,128,128],
			[128,128,128,128]
		];
		var idx = 0;
		for (var id in charas.charas) {
			// draw character on chara's canvas from prerender
			var chara = charas.charas[id];
			var x = Math.max(chara.dx - 390 /  4, 0);
			var y = Math.max(chara.dy - 160 / 40, 0);
			x = Math.min(prerender.width -  390, x);
			y = Math.min(prerender.height - 160, y);
			charasCanvasCtx.drawImage(prerender, x, y, 390, 160, 0, 160 * ( idx + 1 ), 390, 160);

			charasCanvasCtx.fillStyle = "white";
			charasCanvasCtx.font = "bold 32px sans-serif";
			charasCanvasCtx.fillText(chara.name, 10, 160 * ( idx + 1 ) + 40, 390);

			idx++;
		}


	}

	saikoroCanvas.onclick = function () {
		if (!saikoro.isShuffle) {
			// 結果を決める
			saikoro.index = Math.floor(Math.random()*6);

			// 変更されたコンテキストをブロードキャスト
			sendShuffle(saikoro.getContext());

			// 自分自身のシャッフル開始
			saikoro.shuffleStart();
		}
	}

	cardCanvas.onclick = function () {
		if (!card.isShuffle) {
			// 結果を決める
			card.col = Math.floor(Math.random()*7);
			card.row = Math.floor(Math.random()*2);

			// 変更されたコンテキストをブロードキャスト
			sendCardShuffle(card.getContext());

			// 自分自身のシャッフル開始
			card.shuffleStart();
		}
	}

	forceInput.onchange = function() {
		me.setForce(parseInt(forceInput.value));
	}

	scaleInput.onchange = function() {
		me.setScale(parseFloat(scaleInput.value));
	}

	nameInput.onchange = function() {
		me.name = nameInput.value;
	}

	colorInput.onchange = function() {
		me.setColor(parseInt(colorInput.value));
	}

	optionBtn.onclick = function() {
		if (optionPain.style.display == 'none') {
			optionPain.style.display = 'block';
		} else {
			optionPain.style.display = 'none';
		}
	}

	cardBtn.onclick = function() {
		if (cardPain.style.display == 'none') {
			cardPain.style.display = 'block';
			sendCardToggle('block');
		} else {
			cardPain.style.display = 'none';
			card.col = 0; 
			card.row = 0;
			sendCardToggle('none');
		}
	}

	// ----------------------------------------
	// socket 
	//	

	var s = io.connect('http://'+document.domain+':3000');

	//サーバから受け取るイベント
	s.on("connect", function () {});
	s.on("disconnect", function (client) {});

	// プレイヤIDをリクエスト
	function reqId() {
		if (!isPlaying) {
			s.emit('C2SreqId');
		}
	}
	s.on('S2Cwelcome', function(data){
		me.id = data.id;
		me.name = data.id;
		nameInput.value = me.name;
		isPlaying = true;
	})
	s.on('S2Cbye', function(data){
		if (isPlaying) {
			charas.remove(data.id);
		}
	})

	// メッセージ
	function sendMsg(id, msg) {
		s.emit('C2SsendMsg', {id:id, msg:msg});
	}
	s.on('S2CsendMsg', function(data) {
		addLog(data.id+':'+data.msg);
	});
	document.getElementById('sendMsg').addEventListener('click', function(){
		var msg = document.getElementById('msg').value;
		sendMsg(me.id,msg);
	});

	// キャラコンテキスト
	function sendPos(ctx) {
		s.emit('C2SsendPos', ctx);
	}
	s.on('S2CsendPos', function(data){
		if (isPlaying) {
			if (charas.has(data.id)) {
				charas.setContext(data);	
			}
			else {
				charas.add(new Chara(prerenderCtx, medias).setContext(data).init());
			}
		}
	});

	// サイコロ
	function sendShuffle(ctx) {
		s.emit('C2SsendShuffle', ctx);
	}
	s.on('C2SsendShuffle', function(data){
		if (isPlaying) {
			saikoro.setContext(data);
			saikoro.shuffleStart();
		}
	});

	// カードの状態をブロードキャスト
	function sendCardShuffle(ctx) {
		s.emit('C2SsendCardShuffle', ctx);
	}
	s.on('C2SsendCardShuffle', function(data){
		if (isPlaying) {
			card.setContext(data);
			card.shuffleStart();
		}
	});

	// カード領域の表示/非表示
	function sendCardToggle(ctx) {
		s.emit('C2SsendCardToggle', ctx);
	}
	s.on('C2SsendCardToggle', function(data){
		if (isPlaying) {
			cardPain.style.display = data;
			if (data == 'none') {
				card.col = 0; 
				card.row = 0;
			}
		}
	});

	//
	function addLog(msg) {
		var elm = document.getElementById('log');		
		elm.innerHTML = msg+'<br />'+elm.innerHTML;
	}

	// ----------------------------------------
	// main
	//

	function main() {
		loading.style.display = 'none';

		reqId();

		me      = new Chara(prerenderCtx, medias).init();
		charas  = new Charas(me, charasCanvasCtx, prerender, medias);
		saikoro = new Saikoro(saikoroCanvasCtx, medias).init();
		card    = new Card(cardCanvasCtx, medias).init();
		map     = new Map(prerenderCtx, prerender.width, prerender.height, medias).init();

		scaleInput.value = me.scale;
		forceInput.value = me.force;
		colorInput.value = me.color;

		optionPain.style.display = 'none';
		cardPain.style.display = 'none';

		onFrame();
		setInterval(onFrame, 128);
	}


	// ----------------------------------------
	// preload
	//
	function loadImage(src) {
		return new Promise((resolve, reject) => {
		  const media = new Image();
		  media.onload = () =>  {
			  resolve(media);
		  }
		  media.onerror = (e) => { 
			  reject(e);
		  }
		  media.src = src;
		});
	}
	function loadAudio(src) {
		return new Promise((resolve, reject) => {
		  const media = new Audio();
		  media.addEventListener('canplay', () => {
			  resolve(media);
		  });
		  media.addEventListener('error', () => {
			  reject(e);
		  });
		  media.src = src;
		});
	}
	var url = 'https://localhost:3000/';
	var mediaPaths = {
		'image' : [
			url + 'chara0.png',
			url + 'chara1.png',
			url + 'chara2.png',
			url + 'chara3.png',
			url + 'chara4.png',
			url + 'map.jpg',
			url + 'saikoro.png',
			url + 'card.png',
			url + 'map_full.jpg'
		],
		'audio': [
			url + 'talkcard_sound.wav',
			url + 'saikoro_sound.wav',
			url + 'OWsugorokuBGM.wav'
		]
	}
	var promises = [];
	for (var key in mediaPaths) {
		if (key == 'image') {
			for (var i = 0; i < mediaPaths[key].length; i++ ) {
				promises.push(loadImage(mediaPaths[key][i]));
			}
		} 
		else if (key == 'audio') {
			for (var i = 0; i < mediaPaths[key].length; i++ ) {
				promises.push(loadAudio(mediaPaths[key][i]));
			}
		}
	}
	Promise.all(promises)
		.then((results) => { 
			for(var i = 0; i < results.length; i++) {
				var key = results[i].currentSrc.match(".+/(.+?)([\?#;].*)?$")[1];
				medias[key] = results[i];
			}
			console.log(results);
			main(); 
		})
		.catch((e) => { 
			console.log(e); 
		});


};

})();
