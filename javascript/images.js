//

var loaded = false;
//I'm using Derek Leung Image Loader method: https://jsfiddle.net/user/DerekL

//ImageCollection class
function ImageCollection(list) {
	this.list = list;
	this.total = 0;
	this.images = {};
	this.config(list);
}
ImageCollection.prototype.config = function(list){
	var total = this.total
	for(var i = 0; i < list.length; i++) {
		var img = new Image();
		this.images[list[i].name] = img;
		window.addEventListener("load", function(){
            total++;
			
            if(total === list.length){
				loaded = true;
				window.dispatchEvent(imageLoaded);
            }
			//console.log(list.length + " " + total)
			
        });
		img.src = list[i].url;
	}
}
ImageCollection.prototype.get = function(name){
	return this.images[name];
}
ImageCollection.prototype.waitToRun = function(){
	return new Promise(function(resolve, reject){
		window.addEventListener("imgLoad", function(){
			resolve();
		});
		if(reject) {
			window.addEventListener("error", function(){
				throw new Error("Image fetching failed");
			});
			
		}
	});
}

var imgs = new ImageCollection([
	{
		name: "mountains",
		url: "graphics/backgrounds/mountains.png"
	},
	{
		name: "MoonBackground",
		url: "Moon Background 2.png"
	},
	{
		name: "BlockTexture",
		url: "graphics/blocks/block_01.png"
	},
	{
		name: "BlockTexture2",
		url: "graphics/blocks/block_02.png"
	},
	{
		name: "BlockTexture3",
		url: "graphics/blocks/block_03.png"
	},
	{
		name: "BlockTexture4",
		url: "graphics/blocks/block_04.png"
	},
	{
		name: "BlockTexture5",
		url: "graphics/blocks/block_05.png"
	},
	{
		name: "BlockTexture6",
		url: "graphics/blocks/block_06.png"
	},
	{
		name: "BlockTexture7",
		url: "graphics/blocks/block_07.png"
	},
	{
		name: "BlockTexture8",
		url: "graphics/blocks/block_08.png"
	},
	{
		name: "BlockTexture9",
		url: "graphics/blocks/block_09.png"
	},
	{
		name: "BlockTexture10",
		url: "graphics/blocks/block_10.png"
	},
	{
		name: "BlockTexture11",
		url: "graphics/blocks/block_11.png"
	},
	{
		name: "BlockTexture12",
		url: "graphics/blocks/block_12.png"
	},
	{
		name: "WoodTexture",
		url: "graphics/blocks/wood_block_01.png",
	},
    {
    	name: "WoodTexture2",
    	url: "graphics/blocks/wood_block_02.png",
    },
    {
    	name: "WoodTexture3",
    	url: "graphics/blocks/wood_block_03.png",
    },
    {
    	name: "WoodTexture4",
    	url: "graphics/blocks/wood_block_04.png",
    },
    {
    	name: "WoodTexture5",
    	url: "graphics/blocks/wood_block_05.png",
    },
    {
    	name: "PlayerTexture",
    	url: "graphics/player/player_block.png",
    },
    {
    	name: "PlayerTexture2",
	  	url: "graphics/player/player_block_02.png",
    },
	{
		name: "blank",
		url: "graphics/blocks/blank_01.png"
	},
	{
		name: "PlayerTextureFlight",
		url: "graphics/player/player_flight.png"
	},
	{
		name: "Spike",
		url: "graphics/blocks/spike_01.png"
	},
    {
        name: "DarkOakTrunk01",
        url: "graphics/blocks/DarkOakTrunk01 (1).png"
    },
    {
        name: "DarkOakTrunk02",
        url: "graphics/blocks/DarkOakTrunk02 (1).png"
    },
    {
        name: "DarkOakTrunk03",
        url: "graphics/blocks/DarkOakTrunk03.png"
    },
	{
		name: "LeafTexture",
		url: "blocks/leaves_01.png"
	},
	{
		name: "LampBase",
		url: "graphics/blocks/lamppost_bottom.png"
	},
	{
		name: "LampMiddleLit",
		url: "graphics/blocks/lamppost_middle.png"
	},
	{
		name: "LampMiddleDark",
		url: "graphics/blocks/lamppost_middle_dark.png"
	},
	{
		name: "LampTopLit",
		url: "graphics/blocks/lamppost_top.png"
	},
	{
		name: "LampTopDark",
		url: "graphics/blocks/lamppost_top_dark.png"
	},
	{
		name: "backgroundTest",
		url: "Background_test.png",
	},
	{
		name: "A",
		url: "graphics/font/capital/Capital A.png",
	},
	{
		name: "B",
		url: "graphics/font/capital/Capital B.png",
	},
	{
		name: "C",
		url: "graphics/font/capital/Capital C.png",
	},
	{
		name: "D",
		url: "graphics/font/capital/Capital D.png",
	},
	{
		name: "E",
		url: "graphics/font/capital/Capital E.png",
	},
	{
		name: "F",
		url: "graphics/font/capital/Capital F.png",
	},
	{
		name: "G",
		url: "graphics/font/capital/Capital G.png",
	},
	{
		name: "H",
		url: "graphics/font/capital/Capital H.png",
	},
	{
		name: "I",
		url: "graphics/font/capital/Capital I.png",
	},
	{
		name: "J",
		url: "graphics/font/capital/Capital J.png",
	},
	{
		name: "K",
		url: "graphics/font/capital/Capital K.png",
	},
	{
		name: "L",
		url: "graphics/font/capital/Capital L.png",
	},
	{
		name: "M",
		url: "graphics/font/capital/Capital M.png",
	},
	{
		name: "N",
		url: "graphics/font/capital/Capital N.png",
	},
	{
		name: "O",
		url: "graphics/font/capital/Capital A.png",
	},
	{
		name: "P",
		url: "graphics/font/capital/Capital P.png",
	},
	{
		name: "Q",
		url: "graphics/font/capital/Capital Q.png",
	},
	{
		name: "R",
		url: "graphics/font/capital/Capital R.png",
	},
	{
		name: "S",
		url: "graphics/font/capital/Capital S.png",
	},
	{
		name: "T",
		url: "graphics/font/capital/Capital T.png",
	},
	{
		name: "U",
		url: "graphics/font/capital/Capital U.png",
	},
	{
		name: "V",
		url: "graphics/font/capital/Capital V.png",
	},
	{
		name: "W",
		url: "graphics/font/capital/Capital W.png",
	},
	{
		name: "X",
		url: "graphics/font/capital/Capital X.png",
	},
	{
		name: "Y",
		url: "graphics/font/capital/Capital Y.png",
	},
	{
		name: "Z",
		url: "graphics/font/capital/Capital Z.png",
	},
	{
		name: "a",
		url: "graphics/font/lowercase/Lowercase A.png",
	},
	{
		name: "b",
		url: "graphics/font/lowercase/Lowercase B.png",
	},
	{
		name: "c",
		url: "graphics/font/lowercase/Lowercase C.png",
	},
	{
		name: "d",
		url: "graphics/font/lowercase/Lowercase D.png",
	},
	{
		name: "e",
		url: "graphics/font/lowercase/Lowercase E.png",
	},
	{
		name: "f",
		url: "graphics/font/lowercase/Lowercase F.png",
	},
	{
		name: "g",
		url: "graphics/font/lowercase/Lowercase G.png",
	},
	{
		name: "h",
		url: "graphics/font/lowercase/Lowercase H.png",
	},
	{
		name: "i",
		url: "graphics/font/lowercase/Lowercase I.png",
	},
	{
		name: "j",
		url: "graphics/font/lowercase/Lowercase J.png",
	},
	{
		name: "k",
		url: "graphics/font/lowercase/Lowercase K.png",
	},
	{
		name: "l",
		url: "graphics/font/lowercase/Lowercase L.png",
	},
	{
		name: "m",
		url: "graphics/font/lowercase/Lowercase M.png",
	},
	{
		name: "n",
		url: "graphics/font/lowercase/Lowercase N.png",
	},
	{
		name: "o",
		url: "graphics/font/lowercase/Lowercase O.png",
	},
	{
		name: "p",
		url: "graphics/font/lowercase/Lowercase P.png",
	},
	{
		name: "q",
		url: "graphics/font/lowercase/Lowercase Q.png",
	},
	{
		name: "r",
		url: "graphics/font/lowercase/Lowercase R.png",
	},
	{
		name: "s",
		url: "graphics/font/lowercase/Lowercase S.png",
	},
	{
		name: "t",
		url: "graphics/font/lowercase/Lowercase T.png",
	},
	{
		name: "u",
		url: "graphics/font/lowercase/Lowercase U.png",
	},
	{
		name: "v",
		url: "graphics/font/lowercase/Lowercase V.png",
	},
	{
		name: "w",
		url: "graphics/font/lowercase/Lowercase W.png",
	},
	{
		name: "x",
		url: "graphics/font/lowercase/Lowercase X.png",
	},
	{
		name: "y",
		url: "graphics/font/lowercase/Lowercase Y.png",
	},
	{
		name: "z",
		url: "graphics/font/lowercase/Lowercase Z.png",
	},
	{
		name: "trampoline",
		url: "graphics/blocks/trampoline_01.png",
	},
    {
        name: "play",
        url: "graphics/icons/play_01.png",
    },
    {
        name: "pause",
        url: "graphics/icons/pause_01.png",
    },
	{
		name: "play2",
		url: "graphics/icons/play_02.png",
	},
	{
		name: "pause2",
		url: "graphics/icons/pause_02.png",
	},
	{
		name: "PortalDark",
		url: "graphics/blocks/portal_01.png",
	},
    {
        name: "0",
        url: "graphics/font/numbers/Number0.png",
    },
    {
        name: "1",
        url: "graphics/font/numbers/Number1.png",
    },
    {
        name: "2",
        url: "graphics/font/numbers/Number2.png",
    },
    {
        name: "3",
        url: "graphics/font/numbers/Number3.png",
    },
    {
        name: "4",
        url: "graphics/font/numbers/Number4.png",
    },
    {
        name: "5",
        url: "graphics/font/numbers/Number5.png",
    },
    {
        name: "6",
        url: "graphics/font/numbers/Number6.png",
    },
    {
        name: "7",
        url: "graphics/font/numbers/Number7.png",
    },
    {
        name: "8",
        url: "graphics/font/numbers/Number8.png",
    },
    {
        name: "9",
        url: "graphics/font/numbers/Number9.png",
    },
	{
		name: ":",
		url: "graphics/font/colon.png",
	},
	{
		name: " ",
		url: "graphics/font/space.png",
	},
	{
		name: ".",
		url: "graphics/font/period.png",
	},
	{
		name: "portalLitFront",
		url: "graphics/blocks/portal_lit_front.png",
	},
	{
		name: "portalDarkFront",
		url: "graphics/blocks/portal_dark_front.png",
	},
	{
		name: "portalLitBack",
		url: "graphics/blocks/portal_lit_back.png",
	},
	{
		name: "portalDarkBack",
		url: "graphics/blocks/portal_dark_back.png",
	},
    {
        name: "DirtTexture1",
        url: "graphics/blocks/dirtblock_01.png",
    },
    {
        name: "DirtTexture2",
        url: "graphics/blocks/dirtblock_02.png",
    },
    {
        name: "DirtTexture3",
        url: "graphics/blocks/dirtblock_03.png",
    },
    {
        name: "DirtTexture4",
        url: "graphics/blocks/dirtblock_04.png",
    },
    {
        name: "DirtTexture5",
        url: "graphics/blocks/dirtblock_05.png",
    },
    {
        name: "DirtTexture6",
        url: "graphics/blocks/dirtblock_06.png",
    },
    {
        name: "DirtTexture7",
        url: "graphics/blocks/dirtblock_07.png",
    },
    {
        name: "DirtTexture8",
        url: "graphics/blocks/dirtblock_08.png",
    },
    {
        name: "DirtTexture9",
        url: "graphics/blocks/dirtblock_09.png",
    },
    {
        name: "DirtTexture10",
        url: "graphics/blocks/dirtblock_10.png",
    },
    {
        name: "DirtTexture11",
        url: "graphics/blocks/dirtblock_11.png",
    },
    {
        name: "DirtTexture12",
        url: "graphics/blocks/dirtblock_12.png",
    },
	{
		name: "RedWoodTexture1",
		url: "graphics/blocks/red_trunk1.png",
	},
	{
		name: "RedWoodTexture2",
		url: "graphics/blocks/red_trunk2.png",
	},
	{
		name: "RedWoodTexture3",
		url: "graphics/blocks/red_trunk3.png",
	},
	{
		name: "backOn",
		url: "graphics/icons/backbutton_on.png",
	},
	{
		name: "backOff",
		url: "graphics/icons/backbutton_off.png",
	},
	{
		name: "settingsOn",
		url: "graphics/icons/gearsettings_on.png",
	},
	{
		name: "settingsOff",
		url: "graphics/icons/gearsettings_off.png",
	},
	{
		name: "howOn",
		url: "graphics/icons/helpbutton_on.png",
	},
	{
		name: "howOff",
		url: "graphics/icons/helpbutton_off.png",
	},
	{
		name: "linksOn",
		url: "graphics/icons/hyperlinkbutton_on.png",
	},
	{
		name: "linksOff",
		url: "graphics/icons/hyperlinkbutton_off.png",
	},
	{
		name: "levelSelectOn",
		url: "graphics/icons/lvlselect_on.png",
	},
	{
		name: "levelSelectOff",
		url: "graphics/icons/lvlselect_off.png",
	},
	{
		name: "restartOn",
		url: "graphics/icons/restart_on.png",
	},
	{
		name: "restartOff",
		url: "graphics/icons/restart_off.png",
	},
	{
		name: "upArrowOn",
		url: "graphics/icons/uparrowbutton_on.png",
	},
	{
		name: "upArrowOff",
		url: "graphics/icons/uparrowbutton_off.png",
	},
	{
		name: "downArrowOn",
		url: "graphics/icons/downarrowbutton_on.png",
	},
	{
		name: "downArrowOff",
		url: "graphics/icons/downarrowbutton_off.png",
	},
	{
		name: "spikeDown",
		url: "graphics/blocks/spikemoss_upsidedown.png",
	},
	{
		name: "bush",
		url: "graphics/blocks/grass01.png",
	},
	{
		name: "fadeLeft",
		url: "graphics/blocks/lightfade_left.png",
	},
	{
		name: "fadeRight",
		url: "graphics/blocks/lightfade_right.png",
	},
	{
		name: "rail",
		url: "graphics/blocks/railing01.png",
	},
	{
		name: "mainButtonPlayOff",
		url: "graphics/icons/mainplaybuttonoff.png",
	},
	{
		name: "mainPlayButtonOn",
		url: "graphics/icons/mainplaybutton_on.png",
	},
	{
		name: "Htitle",
		url: "graphics/font/main font/title_h_white.png",
	},
	{
		name: "Etitle",
		url: "graphics/font/main font/title_e_white.png",
	},
	{
		name: "Ititle",
		url: "graphics/font/main font/title_i_white.png",
	},
	{
		name: "Ntitle",
		url: "graphics/font/main font/title_n_white.png",
	},
	{
		name: "Otitle",
		url: "graphics/font/main font/title_o_white.png",
	},
	{
		name: "Ptitle",
		url: "graphics/font/main font/title_p_white.png",
	},
	{
		name: "Rtitle",
		url: "graphics/font/main font/title_r_white.png",
	},
	{
		name: "Ztitle",
		url: "graphics/font/main font/title_z_white.png"
	},
	{
		name: " title",
		url: "graphics/font/space.png"
	},
	{
		name: "ititle",
		url: "graphics/font/main font/title_trampoline_i.png"
	}
]);

