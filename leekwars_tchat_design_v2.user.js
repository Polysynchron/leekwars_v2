// ==UserScript==
// @name          [Leek Wars] Tchat Design v2
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.12
// @description   Change le design du tchat
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_design_v2.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_design_v2.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	var _init = false;

	LW.on('pageload', function()
	{
		if (LW.farmer.id)
		{
			_init = true;
			init(LW.farmer.id);
		}
	});

	function init(farmer_id)
	{
		addGlobalStyle('\
			#chat\
			{\
				background-color: rgb(50, 50, 50);\
			}\
			.chat-messages, #chat .chat-messages\
			{\
				background-color: rgb(30, 30, 30);\
			}\
			.chat-messages .chat-message\
			{\
				margin: 2px 0;\
				padding: 5px 10px;\
				max-width: 80%;\
				border-radius: 5px;\
				clear: both;\
			}\
			.chat-messages .chat-message-time\
			{\
				top: auto;\
				bottom: 5px;\
			}\
			.chat-messages .chat-message-messages\
			{\
				padding-left: 0px;\
			}\
			.chat-messages .chat-avatar\
			{\
				border-radius: 40px;\
				box-shadow: 0px 0px 10px rgb(90, 90, 90);\
			}\
			.chat-messages .chat-message\
			{\
				float:left;\
				background-color: rgb(40, 40, 40);\
				color: #d7d7d7;\
				margin-left: 60px;\
				border: 0;\
			}\
			.chat-messages .chat-message .chat-avatar\
			{\
				margin-left: -60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"]\
			{\
				float:right;\
				background-color: rgb(60, 60, 60);\
				margin-right: 60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"] .chat-avatar\
			{\
				float:right;\
				margin-right: -60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"] .chat-message-author\
			{\
				text-align: right;\
			}\
			#chat-input\
			{\
				background-color: #f0f0f0;\
			}\
			.chat-input, #url-input, input[type="color"]\
			{\
				background-color: rgb(30, 30, 30);\
				color: white;\
        			border: none;\
        			border-radius: 8px;\
			}\
		');
	}

	function addGlobalStyle(css)
	{
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

})();
