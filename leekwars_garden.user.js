// ==UserScript==
// @name          [Leek Wars] Fast Garden
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Permet de lancer plus rapidement ses combats
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_garden.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_garden.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	var waitlist = [];

	// Click d'un adversaire
	$('body').on('mouseup', '#garden-solo .leek.enemy', function()
	{
		$(this).unbind("click");
	});
	$('body').on('click', '#garden-solo .leek.enemy', function()
	{
		submitFight("solo", {
			leek_id: _myLeek,
			target_id: $(this).attr('leek')
		});
	});
	
	// Click d'un farmer
	$('body').on('mouseup', '#garden-farmer .farmer.enemy', function()
	{
		$(this).unbind("click");
	});
	$('body').on('click', '#garden-farmer .farmer.enemy', function()
	{
		submitFight("farmer", {
			target_id: $(this).attr('id')
		});
	});

	// Click d'une compo adverse
	$('body').on('mouseup', '#garden-team .enemyCompo', function()
	{
		$(this).unbind("click");
	});
	$('body').on('click', '#garden-team .enemyCompo', function()
	{
		submitFight("team", {
			composition_id: _myCompo,
			target_id: $(this).attr('id')
		});
	});

	// Changement de poireau
	$('body').on('click', '#garden-solo .myleek', function()
	{
		var myleek_id = $(this).attr('leek');
		$('#garden-solo .fight-history').hide();
		$('#garden-solo .fight-history[element_id='+myleek_id+']').show();
	});

	// Changement de compo
	$('body').on('click', '#garden-team .myCompo', function()
	{
		var myCompo_id = $(this).attr('id');
		$('#garden-team .fight-history').hide();
		$('#garden-team .fight-history[element_id='+myCompo_id+']').show();
	});

	// Lancement du combat
	function submitFight(type, params)
	{
		_.post('garden/start-'+type+'-fight', params, function(data)
		{
			if (data.success)
			{
				var fight_id = data.fight;
				addHistory(type, params, fight_id);
				waitlist.push(fight_id);
				refreshResults();
			}
			refreshInterface();
		});
	}

	// Affichage de l'historique des combats
	function addHistory(type, params, fight_id)
	{

		if (type == "solo")
		{
			var myleek_id = $('#garden-solo .myleek.selected').attr('leek');
			var myleek_name = $('#garden-solo .myleek.selected').attr('name');

			var enemy_name = $('#garden-solo .leek[leek='+params.target_id+']').html().split('<br>')[0].split('</svg></div>')[1].replace(/\s/g,"");

			if (!$('#garden-solo .fight-history[element_id='+myleek_id+']').length)
				$('#garden-solo').append('<div class="fight-history" type="solo" element_id="'+myleek_id+'"></div>');
			$('#garden-solo .fight-history[element_id='+myleek_id+']').append('<div class="fight-wrapper" fight="'+fight_id+'"><div class="fight generating"><div class="fighters"><a href="/leek/'+myleek_id+'"><div class="fighter">'+myleek_name+'</div></a><div class="center"><a href="/fight/'+fight_id+'"><img src="http://leekwars.com/static/image/icon/garden.png"></a></div><a href="/leek/'+params.target_id+'"><div class="fighter">'+enemy_name+'</div></a></div></div></div>');
		}

		if (type == "farmer")
		{
			var enemy_name = $('#garden-farmer .farmer[id='+params.target_id+']').html().split('<br>')[1].replace(/\s/g,"");

			if (!$('#garden-farmer .fight-history').length)
				$('#garden-farmer').append('<div class="fight-history" type="farmer" element_id="0"></div>');
			$('#garden-farmer .fight-history').append('<div class="fight-wrapper" fight="'+fight_id+'"><div class="fight generating"><div class="fighters"><a href="/leek/'+LW.farmer.id+'"><div class="fighter">'+LW.farmer.name+'</div></a><div class="center"><a href="/fight/'+fight_id+'"><img src="http://leekwars.com/static/image/icon/garden.png"></a></div><a href="/leek/'+params.target_id+'"><div class="fighter">'+enemy_name+'</div></a></div></div></div>');
		}

		if (type == "team")
		{
			var myCompo_id = $('#garden-team .myCompo.selected').attr('id');
			var myCompo_name = $('#garden-team .myCompo.selected').attr('name');

			var enemy_name = $('#garden-team .enemyCompo[id='+params.target_id+']').html().split('<br>')[1].replace(/\s/g,"");

			if (!$('#garden-team .fight-history[element_id='+myCompo_id+']').length)
				$('#garden-team').append('<div class="fight-history" type="team" element_id="'+myCompo_id+'"></div>');
			$('#garden-team .fight-history[element_id='+myCompo_id+']').append('<div class="fight-wrapper" fight="'+fight_id+'"><div class="fight generating"><div class="fighters"><div class="fighter">'+myCompo_name+'</div><div class="center"><a href="/fight/'+fight_id+'"><img src="http://leekwars.com/static/image/icon/garden.png"></a></div><div class="fighter">'+enemy_name+'</div></div></div></div>');
		}

	}

	// Récupération du résultat des combats
	function refreshResults()
	{

		for (var i = 0; i < waitlist.length; i++)
		{
			var fight_id = waitlist[i];
			var waitlist_i = i;
			_.get('fight/get/' + fight_id, function(data)
			{
				if (data.fight.status == 1)
				{
					var fight = $('#garden-page .fight-wrapper[fight='+fight_id+'] .fight');
					fight.removeClass('generating');
					switch (data.fight.winner)
					{
						case 1:
							fight.addClass('win');
							break;
						case 2:
							fight.addClass('defeat');
							break;
						default:
							fight.addClass('draw');
					}
					waitlist.splice(waitlist_i, 1);
					waitlist_i--;
				}
			});
		}

		if (waitlist.length != 0)
			setTimeout(refreshResults, 1000);
	}

	function refreshInterface()
	{

		localStorage["garden/leek"] = $('#garden-solo .myleek.selected').attr('leek');
		localStorage["garden/compo"] = $('#garden-team .myCompo.selected').attr('id');

		var fight_history = [];
		$('#garden-page .fight-history').each(function()
		{
			fight_history.push({
				type : $(this).attr('type'),
				id : $(this).attr('element_id'),
				visible : $(this).is(":visible"),
				content : $(this).html()
			});
		});

		LW.on('pageload', function()
		{
			for (var i = 0; i < fight_history.length; i++)
			{
				var history = fight_history[i];
				$('#garden-'+history.type).append('<div class="fight-history" type="'+history.type+'" element_id="'+history.id+'"></div>');
				if (!history.visible)
					$('#garden-'+history.type+' .fight-history[element_id='+history.id+']').hide();
				$('#garden-'+history.type+' .fight-history[element_id='+history.id+']').html(history.content);
			}
		});

		LW.loadPage('garden');

	}

})();
