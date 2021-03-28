var app;

function loadVue() {

	Vue.component('tab-button', {
		props: ['data', 'active'],
		template: `
		<div v-if="DATA.tabs[data].unlocked()">
			<button v-bind:class="{ tabBut: true, tabButSelected: (active==DATA.tabs[data].pid && data!='h'), helpButSelected: (data=='h' && player.help) }" v-on:click="tabButtonClick(data)" v-html="((data=='h' && player.help) ? 'CLOSE HELP' : DATA.tabs[data].title)"></button>
		</div>
		`
	}) 

	Vue.component('sub-tab-button', {
		props: ['data', 'id', 'active'],
		template: `
		<div v-if="DATA.tabs[data].subTabs[id].unlocked()">
			<button v-bind:class="{ subTabBut: true, tabButSelected: (active==DATA.tabs[data].subTabs[id].pid) }" v-on:click="subTabButtonClick(data, id)" v-html="DATA.tabs[data].subTabs[id].title"></button>
		</div>
		`
	}) 

	Vue.component('sub-nav', {
		props: ['data', 'ids', 'active'],
		template: `
		<div v-if="DATA.tabs[data].subUnlocked()" class="subNavMenu">
			<div v-for="i in ids.length">
				<sub-tab-button :data="data" :id="ids[i-1]" :active="active"></sub-tab-button>
			</div>
		</div>
		`
	})

	Vue.component('main-nav', {
		props: ['data', 'active'],
		template: `
		<div class="navMenu">
			<div v-for="i in data.length">
				<tab-button :data="data[i-1]" :active="active"></tab-button>
			</div>
		</div>
		`
	})

	Vue.component('num-text', {
		props: ['data', 'val', 'label'],
		methods: {
			plural(d, str) {
				d = new Decimal(d.replace(',', ''));
				if (str.slice(-3)=='ies') { return (d.eq(1) ? (str.slice(0, -3)+'y') : str); }
				else if (str=='research'||str=='void research') { return str; }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span><span :class="DATA[data].layerDisplay.numClass" v-html="val"></span> {{ plural(val, label) }}</span>
		`
	})

	Vue.component('num-text-plain', {
		props: ['val', 'label'],
		methods: {
			plural(d, str) {
				d = new Decimal(d.replace(',', ''));
				if (str=='galaxies') { return (d.eq(1) ? 'galaxy' : str); }
				else if (str=='depleted galaxies') { return (d.eq(1) ? 'depleted galaxy' : str); }
				else if (str=='research'||str=='void research') { return str; }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span v-html="val + ' ' + plural(val, label)"></span>
		`
	})

	Vue.component('dimension', {
		props: ['data', 'id'],
		template: `
		<div v-if="DATA[data][id] !== undefined" class="dimensionRow">
			<div style="max-width: 5%;" class="dimensionElement" v-html="(data=='u') ? id : ''"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '15%'} : {'max-width': '20%'}]" class="dimensionElement" v-html="DATA[data][id].name"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatUnitRow(DATA[data][id].mult())+'x'"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '10%'} : {'max-width': '5%'}]" class="dimensionElement" v-html="(data=='u') ? ('('+formatUnitRow(DATA[data][id].prodMult())+'x)') : ''"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatWhole(DATA[data][id].amount())"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatWhole(DATA[data][id].bought())"></div>
			<div style="max-width: 11%;" class="dimensionElement" v-html="(DATA[data][id].gainPercent().gte(0.1) ? '(+'+formatUnitRow(DATA[data][id].gainPercent())+'%/s)' : (DATA[data][id].gainPercent().gte(0.05) ? '(<0.1%/s)' : ''))"></div>
			<div style="max-width: 17%;" class="dimensionElement"><button v-on:click="DATA[data].buySingle(id)" v-bind:class="{ [DATA[data].className]: true, single: true, can: DATA[data][id].canAfford(), cant: !DATA[data][id].canAfford() }">Cost: <num-text-plain :val="formatWholeUnitRow(DATA[data][id].cost())" :label="DATA[data].resource"></num-text-plain></button></div>
			<div style="max-width: 12%;" class="dimensionElement"><button v-on:click="DATA[data].buyMax(id)" v-bind:class="{ [DATA[data].className]: true, max: true, can: DATA[data][id].canAfford(), cant: !DATA[data][id].canAfford() }" v-html="'Buy max (' + formatWholeUnitRow(DATA[data].getMax(id)) + ')'"></button></div>
		</div>
		`
	})

	Vue.component('dimension-header', {
		props: ['data'],
		template: `
		<div class="dimensionRow dimensionHeader">
			<div style="max-width: 5%;" class="dimensionElement" v-html="(data=='u') ? 'Tier' : ''"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '15%'} : {'max-width': '20%'}]" class="dimensionElement" v-html="(data=='u') ? 'Unit Type' : 'Dimension'"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="(data=='u') ? 'Corpse Mult' : 'Multiplier'"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '10%'} : {'max-width': '5%'}]" class="dimensionElement" v-html="(data=='u') ? '(Unit Mult)' : ''"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="'Owned'"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="'(Bought)'"></div>
			<div style="max-width: 11%;" class="dimensionElement" v-html="'Gain'"></div>
			<div style="max-width: 29%;" class="dimensionElement" style="text-align: center;"><button v-on:click="DATA[data].buyMaxA()" v-bind:class="{ [DATA[data].className]: true, max: true, can: true }" v-html="'Max all'"></button></div>
		</div>
		`
	})

	Vue.component('dimension-table', {
		props: ['data'],
		template: `
        <div class="dimTable">
		<dimension-header :data="data"></dimension-header>
			<div v-for="tier in DATA[data].numTiers">
				<div v-if="(data=='u'&&DATA.ul.units[tier]())||(data=='td'&&DATA.ul.dimensions[tier]())">
					<dimension :data="data" :id="tier"></dimension>
				</div>
			</div>
        </div>
		`
	})

	Vue.component('multi-boxes', {
		props: ['data'],
		template: `
		<div class="researchesTable">
			<div v-for="row in DATA[data].multi.rows" class="researchesRow">
				<div v-for="col in DATA[data].multi.cols"><div class="researchCell">
					<multi-box :data="data" :id="row*10+col"></multi-box>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('multi-box', {
		props: ['data', 'id'],
		template: `
		<div v-bind:class="{ [DATA[data].multi.klass()]: true }">
			<div v-for="i in DATA[data].multi.numElsByBox(id)">
				<component v-if="DATA[data].multi.boxUnlocked(id)" :is="DATA[data].multi.dataLists[id][i].tag" v-bind:class="{ [DATA[data].multi.dataLists[id][i].klass()]: true }" 
							v-bind:style="(DATA[data].multi.dataLists[id][i].style !== undefined) ? DATA[data].multi.dataLists[id][i].style() : {}" 
							v-html="DATA[data].multi.dataLists[id][i].htm()" 
							v-on:click="(DATA[data].multi.dataLists[id][i].click !== undefined) ? DATA[data].multi.dataLists[id][i].click().handle(DATA[data].multi.dataLists[id][i].click().arg) : function() {}">
				</component>
			</div>
		</div>
		`
	})

	Vue.component('upgrade', {
		props: {
			data: String, 
			id: String,
			cssid: {
				type: String,
				default: '',
			},
			extra: {
				type: String,
				default: '',
			},
		},
		methods: {
			strikeout(d) {
				return (d.slice(0,1)=='g' && (isResearchActive(6)||isResearchActive(7)))
			}
		},
		template: `
		<div v-if="data!='a'||!player.win">
			<button v-if="DATA[data].upgrades[id]!== undefined" v-on:click="DATA[data].buyUpg(data, id)" v-bind:id="cssid" v-bind:class="{ [DATA[data].upgrades.className]: true, bought: DATA[data].upgrades[id].isBought(), cant: (!(DATA[data].upgrades[id].canAfford())&&!DATA[data].upgrades[id].isBought()), can: (DATA[data].upgrades[id].canAfford()&&!DATA[data].upgrades[id].isBought()&&!DATA[data].upgrades[id].locked()), locked: DATA[data].upgrades[id].locked(), tooltip: (player.tooltipsEnabled&&DATA[data].upgrades[id].displayTooltip)}" v-bind:extra-attr="extra" v-bind:data-title="DATA[data].upgrades[id].displayFormula()">
				<div v-if="data!='a'||(!DATA[data].upgrades[id].isBought()&&!DATA[data].upgrades[id].locked())">
					<span v-if="data=='a'">Build component:<br></span>
					<span v-html="DATA[data].upgrades[id].title" style="font-weight: 900;"></span><br>
					<span v-html="DATA[data].upgrades[id].desc()+'<br>'"></span>
					<span v-if="DATA[data].upgrades[id].requires!==undefined"><span v-if="DATA[data].upgrades[id].requires.length>0"v-bind:style="[strikeout(data) ? { 'text-decoration': 'line-through' } : { 'text-decoration': '' }]">Requires: <span style="font-weight: 900;" v-html="DATA[data].upgrades[DATA[data].upgrades[id].requires[0]].title"></span><span v-if="DATA[data].upgrades[id].requires.length>1"> or <span style="font-weight: 900;" v-html="DATA[data].upgrades[DATA[data].upgrades[id].requires[1]].title"></span></span><br></span></span> 
					Cost: <span v-if="data=='a'" v-html="DATA[data].upgrades[id].cost()"></span><span v-else><num-text-plain :val="formatWhole(DATA[data].upgrades[id].cost())" :label="DATA[data].upgrades[id].resource"></num-text-plain></span>
					<span v-if="data=='c'"><br>Level: {{ formatWhole(player.construction[id]) + (DATA[data].upgrades[id].extraLevels()>0 ? ' + ' + formatWhole(DATA[data].upgrades[id].extraLevels()) : '') }}</span>
					<span v-if="DATA[data].upgrades[id].displayEffect"><br>Currently: <span v-html="DATA[data].upgrades[id].effectString()"></span></span>
				</div>
				<div v-if="data=='a'&&DATA[data].upgrades[id].isBought()">
					<span v-html="DATA[data].upgrades[id].title.toUpperCase()+' ONLINE.'" style="font-weight: 900;"></span>
				</div>
			</button>
		</div>
		`
	})

    Vue.component('building', {
		props: ['data'],
		template: `
		<div v-if="DATA[data].unlocked()" class="buildingsTable">
			<div v-if="!player.buildings[DATA[data].tier].built">
				<button v-on:click="buyBuilding(data)" v-bind:class="{ buildBut: DATA[data].canAffordBuild(), unclickableBuildBut: !DATA[data].canAffordBuild() }">
					Build the<h3 v-html="DATA[data].id"></h3>Cost: <span v-html="formatWhole(DATA[data].cost)"></span> astral bricks
				</button>
			</div>
			<div v-else>
				<div>
					<h3 v-html="DATA[data].id"></h3>
					you have <num-text data="sp" :val="formatDefault(player.buildings[DATA[data].tier].amount)" :label="DATA[data].resource"></num-text><br>
					<span v-if="DATA[data].displayResourceGain">you are producing <num-text data="sp" :val="formatDefault(player.buildings[DATA[data].tier].amount)" :label="DATA[data].resource"></num-text>/sec (based on your {{ DATA[data].basedOn }})<br></span>
					<span v-if="data=='b3'"><div v-if="player.astralFlag" style="min-height: 30px;">you are producing <num-text data="sp" :val="formatDefault(DATA[data].prod())" label="nekro-photons"></num-text>/real sec, only during astral enslavement.<br></div><div v-else style="min-height: 25px; margin-top: 5px;" v-html="DATA[data].extraText()+'<br>'"></div></span>
					<span v-else-if="DATA[data].hasExtraText" style="font-variant-numeric: tabular-nums;" v-html="DATA[data].extraText()+'<br>'"></span>
					<div v-for="row in DATA[data].upgrades.rows" class="buildingUpgRow">
						<div v-for="col in DATA[data].upgrades.cols"><div v-if="(DATA[data].upgrades[row*10+col]!== undefined) && DATA[data].upgrades[row*10+col].unlocked()" class="buildingUpgCell">
							<upgrade :data = "data" :id = "(row*10+col).toString()"></upgrade>
						</div></div>
					</div>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('construction', {
		props: ['data'],
		template: `
		<div class="constrTable">
			<div class="constrUpgHeader">
				<h2 style="font-size: 18pt;">CONSTRUCTION UPGRADES</h2>
				<layer-button data="c" :width="120" text="Max all" fname="buyMaxAllConstr"></layer-button>
			</div>
			<div class="constrUpgRow">
				<div v-for="upg in 4"><div v-if="(DATA[data].upgrades[upg]!== undefined) && DATA[data].upgrades[upg].unlocked()" class="constrUpgCell">
					<upgrade :data = "data" :id = "upg.toString()"></upgrade>
					<layer-button data="c" :width="120" text="Buy max" fname="buyMaxConstr" :args="upg"></layer-button>
				</div></div>
			</div>
			<div v-if="hasMilestone(1)" class="constrUpgRow">
				<div v-for="upg in 2"><div v-if="(DATA[data].upgrades[4+upg]!== undefined) && DATA[data].upgrades[4+upg].unlocked()" class="constrUpgCell">
					<upgrade :data = "data" :id = "(4+upg).toString()"></upgrade>
					<layer-button data="c" :width="120" text="Buy max" fname="buyMaxConstr" :args="upg"></layer-button>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('time-upg-table', {
		props: ['data'],
		template: `
        <div class="timeUpgTable" v-bind:style="[hasMilestone(6) ? {'width': '1210px'} : {'width': '726px'}]">
			<div v-for="row in DATA[data].upgrades.rows" class="timeUpgRow">
				<div v-if="hasMilestone(6)"><div v-if="DATA[data].upgrades[40+row]!== undefined && DATA[data].upgrades[40+row].unlocked()" class="timeUpgCell">
					<upgrade :data = "data" :id = "(40+row).toString()"></upgrade>
				</div></div>
				<div v-for="col in DATA[data].upgrades.cols"><div v-if="DATA[data].upgrades[col*10+row]!== undefined && (col<4)" class="timeUpgCell">
					<upgrade :data = "data" :id = "(col*10+row).toString()"></upgrade>
				</div></div>
				<div v-if="hasMilestone(6)"><div v-if="DATA[data].upgrades[50+row]!== undefined && DATA[data].upgrades[50+row].unlocked()" class="timeUpgCell">
					<upgrade :data = "data" :id = "(50+row).toString()"></upgrade>
				</div></div>
			</div>
        </div>
		`
	})

	Vue.component('galaxy-table', {
		props: ['data'],
		template: `
		<div class="galaxyTable">
			<div class="galaxyUpgRow">
				<h3 v-html="DATA[data].name" style="flex: 1;"></h3>
			</div>
			<div class="galaxyUpgRow">
				<div class="topGalaxyCell">
					<upgrade :data = "data" id = "11"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="leftGalaxyCell">
					<upgrade :data = "data" id = "21"></upgrade>
				</div>
				<div class="rightGalaxyCell">
					<upgrade :data = "data" id = "22"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="leftGalaxyCell">
					<upgrade :data = "data" id = "31"></upgrade>
				</div>
				<div class="rightGalaxyCell">
					<upgrade :data = "data" id = "32"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="bottomGalaxyCell">
					<upgrade :data = "data" id = "41"></upgrade>
				</div>
			</div>
        </div>
		`
	})

	Vue.component('galaxies-table', {
		props: [],
		data() {
			return {
				num: player.activeGalaxies[0],
				first: player.activeGalaxies[1],
				second: player.activeGalaxies[2],
			}
		},
		template: `
		<div v-bind:class="{galaxiesTable4Cont: (num=='4'), galaxiesTableCont: (num!='4')}">
			<div v-for="gal in 4"><div v-if="(num=='4')||(first==gal.toString())||((second==gal.toString())&&(num=='2'))" class="galaxyCell">
				<galaxy-table :data="'g'+gal.toString()"></galaxy-table>
			</div></div>
		</div>
		`
	})

	Vue.component('eth-upg-table', {
		props: ['data'],
		template: `
		<div class="ethUpgTable">
			<div class="ethUpgHeader">
				<h2 style="font-size: 20pt; -webkit-text-stroke-width: .5px; -webkit-text-stroke-color: white;">Ethereal Upgrades</h2>
				<layer-button data="e" :width="250" :text="'Respec Ethereal Upgrades<br>(forces a sacrifice reset)'" fname="respecEthereal"></layer-button>
			</div>
			<div v-for="row in DATA[data].upgrades.rows" class="ethUpgRow">
				<div v-for="col in DATA[data].upgrades.cols"><div v-if="(DATA[data].upgrades[row*10+col]!== undefined) && DATA[data].upgrades[row*10+col].unlocked()" class="ethUpgCell">
					<upgrade :data = "data" :id = "(row*10+col).toString()"></upgrade>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('prestige-button', {
		props: ['data'],
		template: `
		<div class="prestigeContainer">
			<button v-on:click="DATA[data].prestige.doReset()" v-bind:class="{ [DATA[data].prestige.className]: true, cant: !DATA[data].prestige.canReset(), can: DATA[data].prestige.canReset(), tooltip: (player.tooltipsEnabled&&DATA[data].prestige.displayTooltip)}" v-bind:data-title="DATA[data].prestige.displayFormula()">
				<div v-html="DATA[data].prestige.heading" style="font-weight: 900; font-size: 17pt; margin: 5px 0px;"></div>
				<div v-if="DATA[data].prestige.displayDesc()" style="margin: 5px 0px;" v-html="DATA[data].prestige.desc"></div>
				<div v-if="DATA[data].prestige.canReset()" style="font-size: 15pt; margin: 0px;">Reset for <num-text-plain :val="formatWhole(DATA[data].prestige.getGain())" :label="DATA[data].prestige.gainResource"></num-text-plain></div>
				<div v-if="!DATA[data].prestige.canReset()" style="font-size: 15pt; margin: 0px;">Requires {{ DATA[data].prestige.getReqAmount() }} {{ DATA[data].prestige.getReqResource() }}</div>
				<div v-if="DATA[data].prestige.canReset()&&DATA[data].prestige.showNextAt" style="font-size: 15pt; margin: 0px;">Next at {{ formatWhole(DATA[data].prestige.getNextAt()) }} {{ DATA[data].prestige.getReqResource() }}</div>
			</button>
		</div>
		`
	})

	Vue.component('opt-button', {
		props: ['data'],
		template: `
		<div>
			<button v-bind:class="{ optBut: true }" v-on:click="DATA.o[data].fxn()" v-html="(DATA.o[data].altToggle() ? DATA.o[data].altTitle : DATA.o[data].title)"></button>
		</div>
		`
	}) 

	Vue.component('options-table', {
		props: [],
		template: `
		<div class="optionsTable">
			<div v-for="row in DATA['o'].rows" class="optRow">
				<div v-for="col in DATA['o'].cols"><div class="optButCell">
					<opt-button :data="10*row+col"></opt-button>
				</div><div>
			</div>
		</div>
		`
	}) 

	Vue.component('layer-button', {
		props: {
			data: String,
			width: Number,
			height: {
				type: Number,
				default: null,
			},
			text: String,
			fname: String,
			args: {
				type: null,
				default: null,
			},
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else if (Array.isArray(a)) { window[f](a[0], a[1]); }
				else { window[f](a); }
			}
		},
		template: `
		<button v-on:click="call(fname, args)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true }" v-bind:style="[(height==0) ? {'width': width+'px'} : {'width': width+'px', 'height': height+'px'}]" v-html="text"></button>
		`
	})

	Vue.component('layer-button-two', {
		props: {
			data: String,
			width: Number,
			text: String,
			fname: String,
			args: {
				type: null,
				default: null,
			},
			width2: Number,
			text2: String,
			fname2: String,
			args2: {
				type: null,
				default: null,
			},
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else { window[f](a); }
			}
		},
		template: `
		<div>
			<button v-on:click="call(fname, args)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true }" v-bind:style="[{'width': width+'px'}]" v-html="text"></button>
			<button v-on:click="call(fname2, args2)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true }" v-bind:style="[{'width': width2+'px'}]" v-html="text2"></button>
		</div>
		`
	})

	Vue.component('milestone', {
		props: ['data'],
		template: `
		<div v-bind:class="{ milestoneTD: true, locked: !player.milestones[data], unlocked: player.milestones[data] }">
			<span v-bind:class="{ milestoneReq: true, unlocked: player.milestones[data] }" v-html="DATA.ms[data].reqText"></span><br>
			<span class="milestoneReward" style="font-size: 11pt;" v-html="DATA.ms[data].rewardText"></span>
		</div>
		`
	})

	Vue.component('milestones', {
		props: [],
		template: `
		<div class="milestoneTable">
			<div v-for="i in 7">
				<milestone :data="i"></milestone>
			</div>
		</div>
		`
	})

	Vue.component('toggle-button', {
		props: {'fname': String,
				'args': {
					type: null,
					default: null,
				}, 
				'on': Boolean,
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else if (Array.isArray(a)) { window[f](a[0], a[1]); }
				else { window[f](a); }
			}
		},
		template: `
		<button class="confBut" v-on:click="call(fname, args)" v-html="on ? 'ON' : 'OFF'"></button>
		`
	})

	Vue.component('display-toggle', {
		props: ['data'],
		template: `
		<div class="toggleRow">
			<div class="toggleText" v-html="DATA.header[data].text"></div>
			<div class="toggleButtonDiv">
				<toggle-button class="confBut" fname="toggleDisplay" :args="DATA.header[data].id" :on="player.headerDisplay[DATA.header[data].id]"></toggle-button>
			</div>
		</div>
		`
	})

	Vue.component('display-toggles', {
		props: [],
		template: `
		<div class="displayButtonsTable">
			<div v-for="i in DATA.header.rows">
				<div v-if="player.headerDisplayUnlocked[DATA.header[i].id]">
					<display-toggle :data="i"></display-toggle>
				</div>
			</div>
			<button class="displayButSkinny" style="margin: 10px;" v-on:click="setDisplayDefaults()">defaults</button>
		</div>
		`
	})

	Vue.component('confirm-toggle', {
		props: ['data'],
		template: `
		<div class="toggleRow">
			<div class="toggleText" v-html="DATA.ul.confirmations[data].text"></div>
			<div class="toggleButtonConfDiv">
				<toggle-button class="confBut" :data="DATA.ul.confirmations[data].id" fname="toggleConfirmations" :args="[DATA.ul.confirmations[data].id, 'click']" :on="player.confirmations[DATA.ul.confirmations[data].id]['click']"></toggle-button>
			</div>
			<div class="toggleButtonConfDiv">
				<toggle-button class="confBut" :data="DATA.ul.confirmations[data].id" fname="toggleConfirmations" :args="[DATA.ul.confirmations[data].id, 'key']" :on="player.confirmations[DATA.ul.confirmations[data].id]['key']"></toggle-button>
			</div>
		</div>
		`
	})

	Vue.component('confirm-toggles', {
		props: [],
		template: `
		<div class="confirmButtonsTable">
			<div class="toggleRow">
				<div class="toggleText"><strong>action</strong></div>
				<div class="toggleButtonConfHead">
					<strong>on<br>click</strong>
				</div>
				<div class="toggleButtonConfHead">
					<strong>on<br>key</strong>
				</div>
			</div>
			<div v-for="i in DATA.ul.confirmations.rows">
				<div v-if="player.confirmations[DATA.ul.confirmations[i].id].unlocked">
					<confirm-toggle :data="i"></confirm-toggle>
				</div>
			</div>
			<button class="displayButSkinny" style="margin: 10px;" v-on:click="setConfDefaults()">defaults</button>
			<button class="optBut" style="margin: 10px;" v-on:click="closeConfirmationsPopup()">CLOSE</button>
		</div>
		`
	})

	Vue.component('stats-table', {
		props: ['data'],
		template: `
		<div>
			<div class="statsTableDiv">
				<h3>{{ player.stats[data].label }}</h3>
				<div class="statsHeader">
					<div class="resourceCellH">resource</div>
					<div class="totalCellH">total</div>
					<div class="bestCellH">best</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">corpses</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalCorpses) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestCorpses) }}</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">astral bricks</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalBricks) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestBricks) }}</div>
				</div>
				<div class="statsRow" v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))">
					<div class="resourceCell">time crystals</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalCrystals) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestCrystals) }}</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">exterminated worlds</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalWorlds) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestWorlds) }}</div>
				</div>
				<div class="statsRow" v-if="(data=='allTimeStats')&&player.stats['allTimeStats'].totalAscensions.gt(0)">
					<div class="resourceCell">depleted galaxies</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalGalaxies) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestGalaxies) }}</div>
				</div>
			</div>
			<div class="statsTableText">
				<div>
					<span>you have world prestiged {{ formatWhole(player.stats[data].totalSpaceResets) }} times</span>
					<span v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))"> / sacrificed {{ formatWhole(player.stats[data].totalSpaceResets) }} times</span>
					<span v-if="data=='allTimeStats'"> / ascended {{ formatWhole(player.stats[data].totalAscensions) }} times</span>
				</div>
				<div>
					<span v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))">your best crystal gain was {{ formatWhole(player.stats[data].bestCrystalGain) }} and your best crystal gain rate was {{ formatWhole(player.stats[data].bestCrystalRate) }}/min</span>
				</div>
				<div>
					<span v-if="(data=='allTimeStats')&&player.stats['allTimeStats'].totalAscensions.gt(0)">you have spent a total of {{ formatWhole(player.stats[data].totalSpentGalaxies) }} galaxies</span>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('stats-page', {
		props: [],
		template: `
		<div class="statsTables">
			<div v-if="player.stats['thisSacStats'].displayStats()">
				<stats-table data="thisSacStats"></stats-table>
			</div>
			<div v-if="player.stats['thisAscStats'].displayStats()">
				<stats-table data="thisAscStats"></stats-table>
			</div>
			<div>
				<stats-table data="allTimeStats"></stats-table>
			</div>
		</div>
		`
	})

	Vue.component('ten-sac', {
		props: [],
		template: `
		<div class="pastRunsTable">
			<div v-if="(player.pastRuns.lastRun.timeSpent != 0)">
				<div><h3>Last 10 Sacrifice Runs</h3></div>
				<div v-html="'Avg. of past 10 runs: ' + generateSacAvgs()"></div>
				<br>
				<div v-for="i in 10">
					<div v-html="generateSacString(i-1)"></div>
				</div>
			</div>
			<div v-else>
				<div><h3>Last 10 Sacrifice Runs</h3></div>
				<div>you don't have any past runs!</div>
			</div>
		</div>
		`
	})

	Vue.component('ten-asc', {
		props: [],
		template: `
		<div class="pastRunsTable">
			<div v-if="(player.pastAscRuns.lastRun.timeSpent != 0)">
				<div><h3>Last 10 Ascension Runs</h3></div>
				<div v-html="'Avg. of past 10 runs: ' + generateAscAvgs()"></div>
				<br>
				<div v-for="i in 10">
					<div v-html="generateAscString(i-1)"></div>
				</div>
			</div>
			<div v-else>
				<div><h3>Last 10 Ascension Runs</h3></div>
				<div>you don't have any past runs!</div>
			</div>
		</div>
		`
	})

	Vue.component('achievement', {
		props: ['data'],
		methods: {
			genTooltip(id) {
				let str = '';
				if (DATA.ach[id].secret && !player.achievements[id]) { str += DATA.ach[id].hint; }
				else { str += DATA.ach[id].desc; }
				if (DATA.ach[id].hasReward) { str += (' Reward: ' + DATA.ach[id].reward); }
				if (DATA.ach[id].showEffect) { str += (' Currently: ' + formatDefault2(DATA.ach[id].effect()) + 'x'); }
				return str;
			}
		},
		template: `
		<div v-bind:class="{ achievement: true, locked: !player.achievements[data], unlocked: player.achievements[data], achTooltip: true }" v-bind:data-title="genTooltip(data)" v-html="'<p>'+DATA.ach[data].title+(DATA.ach[data].reward ? '<br>+' : '')+'</p>'"></div>
		`
	})

	Vue.component('achievements', {
		props: [],
		template: `
		<div class="achTable">
			<div v-for="row in DATA.ach.rows" class="achRow">
				<div v-for="col in DATA.ach.cols">
					<achievement :data="row*10+col"></achievement>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('popup', {
		props: ['data', 'text'],
		template: `
		<div v-bind:class="{ [data]: true }" v-html="text"></div>
		`
	})

	Vue.component('popups', {
		props: [],
		template: `
		<div id="popupContainer">
			<div v-for="popup in timedPopups">
				<transition name="fade">
					<div v-if="timedPopups[popup].time>0">
						<popup :data="timedPopups[popup].className" :text="timedPopups[popup].popupText"></popup>
					</div>
				</transition>
			</div>
		</div>
		`
	})

    app = new Vue({
		el: "#app",
		data: {
			player,
			Decimal,
			format,
			formatWhole,
            formatDefault,
			formatDefault2,
			formatUnitRow,
			formatUnitRow2,
			formatWholeUnitRow,
			formatTime,
			buyBUpg,
			buyTUpg,
			buyGUpg,
			buyArkUpgrade,
			buyEUpg,
			hasUpgrade,
			hasTUpgrade,
			hasGUpgrade,
			hasAUpgrade,
			hasEUpgrade,
			hasMilestone,
			hasAchievement,
			HOTKEYS,
            DATA,
            GAME_DATA,
			POPUPS: {
				'achUnlock': false, 
				'mileUnlock': false, 
				'offline': false, 
				'import': false, 
				'export': false, 
				'favs': false, 
				'milestones': false, 
				'confirmations': false, 
				'header': false,
			},
			timedPopups,
			getCorpsesPerSecond,
			getCorpseMultFromUnits,
			getGalaxiesBonus,
			getWorldsBonus,
			getTotalCorpseMult,
			getBricksPerSecond,
			getAstralNerf,
			getNumCompletedProj,
			isResearchActive,
			isResearchCompleted,
			getTheoremBoostW,
			getTheoremBoostC,
			getNumAchievements,
			getNumAchRows,
			getAchievementEffect,
			getAchievementBoost,
			getEssenceProdAfterSlider,
			getTrueTimeBuff,
			getAntiTimeBuff,
			getResearchPerSecond,
			getCurrentGoal,
			tabButtonClick,
			generateHelpText,
			generateLastAsc,
			generateAscAvgs,
			generateAscString,
			generateLastSac,
			generateSacAvgs,
			generateSacString,
			isOffline: false,
			galSelected: player.activeGalaxies[0],
			respecNextGal: false,
			respecNextSac: false,
			dontRespec: player.dontResetSlider,
			sliderVal: player.antiPercent,
			shadowStyle: '',
			devSpeed: 1,
			showHelp: false,
		},
	})
}