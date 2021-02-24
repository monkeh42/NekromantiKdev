//misc info functions

function getResourceEff(b) {
    return BUILDS_DATA[b].resourceEff();
}

function getDisplaySymbol(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect[1];
}

function isDisplayEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect;
}

function isDisplayTooltip(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayTooltip;
}

function isDisplayEffectC(c) {
    return CONSTR_DATA[c].displayEffect;
}

function getCLevel(c) {
    return player.construction[c];
}

function canAffordCUpg(c) {
    return player.bricks.gte(CONSTR_DATA[c].cost());
}

function getCUpgName(c) {
    return CONSTR_DATA[c].title;
}

function getCUpgDesc(c) {
    return CONSTR_DATA[c].desc;
}

function getCUpgCost(c) {
    return CONSTR_DATA[c].cost();
}

function getCUpgEffect(c) {
    return CONSTR_DATA[c].effect();
}

function getExtraLevels(c) {
    return CONSTR_DATA[c].extraLevels();
}

function isBuilt(b) {
    return player.buildings[b].built;
}

function hasUpgrade(b, u) {
    return player.buildings[b].upgrades[u];
}

function getUpgName(b, u) {
    return BUILDS_DATA[b].upgrades[u].title;
}

function getUpgDesc(b, u) {
    return BUILDS_DATA[b].upgrades[u].desc();
}

function getUpgCost(b, u) {
    return BUILDS_DATA[b].upgrades[u].cost;
}

function getUpgEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].effect();
}

function canAffordBUpg(b, u) {
    return BUILDS_DATA[b].canAffordUpg(u) && !hasUpgrade(b, u);
}

function canAffordBuilding(b) {
    return player.bricks.gte(BUILDS_DATA[b].cost);
}

function getBuildingProdPerSec(b) {
    return BUILDS_DATA[b].prod();
}

//production/calculation

function getBricksPerSecond() {
    var e = hasGUpgrade(1, 21) ? 0.25 : 0.2
    var b = getCorpsesPerSecond().pow(e);
    if (isBuilt(2)) { b = b.times(getResourceEff(2)) }
    if (hasUpgrade(2, 11)) { b = b.times(getUpgEffect(2, 11)); }
    if (hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
    if (hasGUpgrade(3, 41)) { b = b.times(getGUpgEffect(3, 41)); }
    return b;
}

//buy functions

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        player.buildings[b].built = true;
        player.bricks = player.bricks.minus(BUILDS_DATA[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        player.buildings[b].upgrades[u] = true;
        if (b==2) { player.bricks = player.bricks.minus(getUpgCost(b, u)); }
        else { player.buildings[b].amount = player.buildings[b].amount.minus(getUpgCost(b, u)); }
        remBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnClass);
        addBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnBought);
        if (BUILDS_DATA[b].upgrades[u].onBuy !== undefined) { BUILDS_DATA[b].upgrades[u].onBuy() }
    }
}

function buyCUpg(c) {
    if (canAffordCUpg(c)) {
        player.bricks = player.bricks.minus(getCUpgCost(c));
        player.construction[c] = player.construction[c].plus(1);
        if (CONSTR_DATA[c].onBuy !== undefined) { CONSTR_DATA[c].onBuy() }
    }
    if (CONSTR_DATA[c].isTimes) { writeHTMLCUpg(c, `<span style="font-weight: 900;">${getCUpgName(c)}</span><br>${getCUpgDesc(c)}<br>Cost: ${formatDefault(getCUpgCost(c))} astral bricks<br>Current level: ${formatWhole(player.construction[c]) + (getExtraLevels(c)>0 ? ' + ' + formatWhole(getExtraLevels(c)) : '')}${isDisplayEffectC(c) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(c)) + "x") : ""}`); }
    else { writeHTMLCUpg(c, `<span style="font-weight: 900;">${getCUpgName(c)}</span><br>${getCUpgDesc(c)}<br>Cost: ${formatDefault(getCUpgCost(c))} astral bricks<br>Current level: ${formatWhole(player.construction[c]) + (getExtraLevels(c)>0 ? ' + ' + formatWhole(getExtraLevels(c)) : '')}${isDisplayEffectC(c) ? ("<br>Currently: +" + formatDefault2(getCUpgEffect(c))) : ""}`); }

    if (c==5) {
        for (let i=1; i<=4; i++) {
            if (CONSTR_DATA[i].isTimes) { writeHTMLCUpg(i, `<span style="font-weight: 900;">${getCUpgName(i)}</span><br>${getCUpgDesc(i)}<br>Cost: ${formatDefault(getCUpgCost(i))} astral bricks<br>Current level: ${formatWhole(player.construction[i]) + (getExtraLevels(i)>0 ? ' + ' + formatWhole(getExtraLevels(i)) : '')}${isDisplayEffectC(i) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(i)) + "x") : ""}`); }
    else { writeHTMLCUpg(i, `<span style="font-weight: 900;">${getCUpgName(i)}</span><br>${getCUpgDesc(i)}<br>Cost: ${formatDefault(getCUpgCost(i))} astral bricks<br>Current level: ${formatWhole(player.construction[i]) + (getExtraLevels(i)>0 ? ' + ' + formatWhole(getExtraLevels(i)) : '')}${isDisplayEffectC(i) ? ("<br>Currently: +" + formatDefault2(getCUpgEffect(i))) : ""}`); }
        }
    }
}

function buyMaxConstr(upg) {
    while (canAffordCUpg(upg)) {
        buyCUpg(upg);
    }
}

function buyMaxAllConstr() {
    for (var i=4; i>0; i--) {
        buyMaxConstr(i);
    }
}

//prestige related

function toggleAstral() {
    if (player.unlocks['buildingsTab']['mainTab']) {
        player.astralFlag = !player.astralFlag;
        toggleAstralDisplay();
    }
    if (player.astralFlag) { player.thisSacStats.hasGoneAstral = true; }
}

function resetBuildingResources(sacrifice=false, ascension=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (!hasAchievement(15) || ascension) { player.bricks = new Decimal(START_PLAYER.bricks); }
    else if (sacrifice) { player.bricks = new Decimal(getAchievementEffect(15)); } 
    for (var b in BUILDS_DATA) {
        player.buildings[b].amount = new Decimal(START_PLAYER.buildings[b].amount);
    }
}

function resetBuildings(ascension=false) {
    if (player.astralFlag) { toggleAstral(); }
    
    if (hasTUpgrade(24)) {
        player.worlds = new Decimal(4);
        player.spaceResets = new Decimal(4);
        player.nextSpaceReset = [3, 8];
        copyData(player.thisSacStats, START_PLAYER.thisSacStats);
        if (hasGUpgrade(2, 22)) { player.worlds = player.worlds.plus(1); }
        player.thisSacStats.totalWorlds = player.worlds;
        player.thisSacStats.bestWorlds = player.worlds;
        if (ascension) {
            player.thisAscStats.totalWorlds = player.worlds;
            player.thisAscStats.bestWorlds = player.worlds;
        }
        return;
    }

    let tempSun = {};
    copyData(tempSun, player.buildings[3]);
    copyData(player.buildings, START_PLAYER.buildings);
    if (!hasMilestone(1)) { copyData(player.construction, START_PLAYER.construction); }

    if (hasTUpgrade(14)) {
        player.worlds = new Decimal(4);
        player.spaceResets = new Decimal(4);
        player.nextSpaceReset = [3, 8];
        copyData(player.buildings[3], tempSun);
        player.buildings[3].amount = new Decimal(0);
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
    } else if (hasTUpgrade(13)) {
        player.worlds = new Decimal(3);
        player.spaceResets = new Decimal(3);
        player.nextSpaceReset = [1, 8];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
    } else if (hasTUpgrade(12)) {
        player.worlds = new Decimal(2);
        player.spaceResets = new Decimal(2);
        player.nextSpaceReset = [1, 7];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
    } else if (hasTUpgrade(11)) {
        player.worlds = new Decimal(1);
        player.spaceResets = new Decimal(1);
        player.nextSpaceReset = [1, 6];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
        if (!hasMilestone(1)) { lockElements('buildingsTab', 'construction'); }
    } else {
        player.spaceResets = new Decimal(START_PLAYER.spaceResets);
        player.worlds = new Decimal(START_PLAYER.worlds);
        player.nextSpaceReset = START_PLAYER.nextSpaceReset.slice();
        lockTab('buildingsTab');
        if (hasMilestone(1)) {
            player.unlocks['buildingsTab']['construction'] = true;
            player.unlocks['buildingsTab']['constructionRow2'] = true;
        }
    }
    copyData(player.thisSacStats, START_PLAYER.thisSacStats);
    if (hasGUpgrade(2, 22)) { player.worlds = player.worlds.plus(1); }
    player.thisSacStats.totalWorlds = player.worlds;
    player.thisSacStats.bestWorlds = player.worlds;
    if (ascension) {
        player.thisAscStats.totalWorlds = player.worlds;
        player.thisAscStats.bestWorlds = player.worlds;
    }

    if (!hasTUpgrade(24) && tempSun.upgrades[13] && (!ascension || hasAchievement(43))) {
        player.buildings[3].upgrades[13] = tempSun.upgrades[13];
    }
    if (!hasTUpgrade(24) && tempSun.upgrades[23]) {
        player.buildings[3].built = true;
        player.buildings[3].upgrades[23] = tempSun.upgrades[23];
    }
}

//data

const BUILDS_DATA = {
    1: {
        id: 'death factory',
        tier: 1,
        resource: 'armaments',
        cost: new Decimal(1000),
        upgResource: 'armaments',
        pBase: function()  {
            var b = player.units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = new Decimal(0.5);
            e = e.plus(getCUpgEffect(2));
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            if (hasUpgrade(2, 12)) { p = p.times(getUpgEffect(2, 12)); }
            if (hasUpgrade(1, 21)) { p = p.times(getUpgEffect(1, 21)); }
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        canAffordUpg: function(upg) {
            return player.buildings[this.tier].amount.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'factoryBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'factoryBuildRow',
        buildingHeaderID: 'factoryHeaderRow',
        upgradesRow1ID: 'factoryUpgradesRow1',
        upgradesRow2ID: 'factoryUpgradesRow2',
        upgradeBtnClass: 'factoryUpg',
        upgradeBtnUnclick: 'unclickFactoryUpg',
        upgradeBtnBought: 'boughtFactoryUpg',
        upgrades: {
            11: {
                title: 'Industrialize',
                desc: function() { return 'Arm your zombies, giving a boost to their corpse multiplier based on armaments.'; },
                cost: new Decimal(1000),
                buttonID: 'factoryUpg11',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + 2*log(x)' : '1 + 2*sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = new Decimal(Decimal.max(player.buildings[1].amount, 1).log10());
                        b = b.times(2);
                    } else {
                        var b = Decimal.max(player.buildings[1].amount, 1).log10();
                        var e = new Decimal(0.5);
                        b = Decimal.pow(b, e).times(2);
                    }
                    if (hasGUpgrade(3, 11)) { b = b.pow(getGUpgEffect(3, 11)); }
                    return b.plus(1);
                }
            },
            12: {
                title: 'Militarize',
                desc: function() { return 'Increase the base corpse multiplier of unit tiers 2 through 8 by 25%.'; },
                cost: new Decimal(5000),
                buttonID: 'factoryUpg12',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    var e = new Decimal(1.25);
                    return e;
                }
            },
            13: {
                title: 'Digitize',
                desc: function() { return 'Each unit tier\'s base unit multiplier is equal to its corpse multiplier, instead of the square root.'; },
                cost: new Decimal(10000),
                buttonID: 'factoryUpg13',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: 'Part Time Jobs',
                desc: function() { return 'Armament production is boosted based on abominations.'; },
                cost: new Decimal(100000),
                buttonID: 'factoryUpg21',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = new Decimal(Decimal.max(player.units[2].amount, 1).log10());
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.units[2].amount, 1).log10();
                        var e = new Decimal(0.5);
                        return Decimal.pow(b, e).plus(1);
                    }
                }
            },
            22: {
                title: 'Galactic Armaments',
                desc: function() { return 'The sun eater corpse multiplier is multiplicative instead of additive when it\'s greater than 1x.'; },
                cost: new Decimal(250000),
                buttonID: 'factoryUpg22',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return UNITS_DATA[8].corpseMult().gt(1);
                }
            },
            23: {
                title: 'Arm The Dead',
                desc: function() { return 'Corpse production is boosted based on corpses.'; },
                cost: new Decimal(500000),
                buttonID: 'factoryUpg23',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.corpses, 1);
                        b = Decimal.pow(b.log10(), 4);
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.corpses, 1);
                        b = Decimal.pow(b.log10(), 2);
                        return b.plus(1);
                    }
                }
            },
        }
    },
    2: {
        id: 'necropolis',
        tier: 2,
        resource: 'acolytes',
        cost: new Decimal(1e5),
        upgResource: 'astral bricks',
        pBase: function()  {
            var b = player.units[8].amount;
            return b;
        },
        pExp: function() {
            var e = 0.2;
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
            if (hasGUpgrade(3, 31)) { p = p.pow(2); }
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            if (player.buildings[2].amount.gte(1)) { r = r.plus(player.buildings[2].amount.log10()); }
            return r;
        },
        canAffordUpg: function(upg) {
            return player.bricks.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'necropolisBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'necropolisBuildRow',
        buildingHeaderID: 'necropolisHeaderRow',
        upgradesRow1ID: 'necropolisUpgradesRow1',
        upgradesRow2ID: 'necropolisUpgradesRow2',
        upgradeBtnClass: 'necropolisUpg',
        upgradeBtnUnclick: 'unclickNecropolisUpg',
        upgradeBtnBought: 'boughtNecropolisUpg',
        upgrades: {
            11: {
                title: 'Astral Kilns',
                desc: function() { return 'Gain 20% more astral bricks for each OoM (order of magnitude) of astral bricks owned.'; },
                cost: new Decimal(100000),
                buttonID: 'necropolisUpg11',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return '1.2^x'; },
                effect: function() {
                    var e = Decimal.floor(player.bricks.e);
                    var b = Decimal.pow(1.2, e);
                    if (hasGUpgrade(3, 21) && hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
                    return b;
                }
            },
            12: {
                title: 'Astral Forges',
                desc: function() { return 'Boost armament production based on astral bricks.'; },
                cost: new Decimal(500000),
                buttonID: 'necropolisUpg12',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = new Decimal(Decimal.max(player.bricks, 1).log10());
                    } else {
                        var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10());
                    }
                    if (hasGUpgrade(3, 21) && hasUpgrade(2, 22)) { e = e.times(getUpgEffect(2, 22)); }

                    return e.plus(1);
                }
            },
            13: {
                title: 'Astral Siege Engines',
                desc: function() { return 'Boost corpse production based on astral bricks.'; },
                cost: new Decimal(1000000),
                buttonID: 'necropolisUpg13',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = new Decimal(Decimal.max(player.bricks, 1).log10());
                    } else {
                        var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10());
                    }
                    if (hasGUpgrade(3, 21) && hasUpgrade(2, 23)) { e = e.times(getUpgEffect(2, 23)); }

                    return e.plus(1);
                }
            },
            21: {
                title: 'Astral Kiln Kilns',
                desc: function() { return 'Boost astral brick production based on astral bricks.'; },
                cost: new Decimal(1e9),
                buttonID: 'necropolisUpg21',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 4);
                    } else {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 2);
                    }

                    return b.plus(1);
                }
            },
            22: {
                title: 'Astral Time Machine',
                desc: function() { return 'Boost time essence production based on astral bricks.'; },
                cost: new Decimal(1e12),
                buttonID: 'necropolisUpg22',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 4);
                    } else {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 2);
                    }

                    return b.plus(1);
                }
            },
            23: {
                title: 'Astral Magnifying Glass',
                desc: function() { return 'Boost nekro-photon production based on astral bricks.'; },
                cost: new Decimal(1e15),
                buttonID: 'necropolisUpg23',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + (log(x)^2)/4' : '1 + log(x)/4'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = Decimal.div(Decimal.pow(Decimal.max(player.bricks, 1).log10(), 2), 4)
                    } else {
                        var e = Decimal.div(Decimal.max(player.bricks, 1).log10(), 4)
                    }

                    return e.plus(1);
                }
            }
        }
    },
    3: {
        id: 'dead sun',
        tier: 3,
        resource: 'nekro-photons',
        cost: new Decimal(1e8),
        upgResource: 'nekro-photons',
        pBase: function()  {
            var b = new Decimal(2);
            return b;
        },
        pExp: function() {
            var e = 1;
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            if (hasAchievement(25)) { p = p.times(getAchievementEffect(25)) }
            if (hasUpgrade(2, 23)) { p = p.times(getUpgEffect(2, 23)); }
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
            if (player.astralFlag) { return p; }
            else { return new Decimal(0); }
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        canAffordUpg: function(upg) {
            return player.buildings[3].amount.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'sunBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'sunBuildRow',
        buildingHeaderID: 'sunHeaderRow',
        upgradesRow1ID: 'sunUpgradesRow',
        upgradesRow2ID: 'sunUpgradesRow2',
        upgradeBtnClass: 'sunUpg',
        upgradeBtnUnclick: 'unclickSunUpg',
        upgradeBtnBought: 'boughtSunUpg',
        upgrades: {
            11: {
                title: 'Death Factory Expansion',
                desc: function() { return 'Unlock a new row of Death Factory upgrades.'; },
                cost: new Decimal(1000),
                buttonID: 'sunUpg11',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: 'Necropolis Expansion',
                desc: function() { return 'Unlock a new row of Necropolis upgrades.'; },
                cost: new Decimal(1000),
                buttonID: 'sunUpg12',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'Nekro-Time',
                desc: function() { return 'Unlock time upgrades.<br>(This upgrade is never reset on sacrifice.)'; },
                cost: new Decimal(10000),
                buttonID: 'sunUpg13',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: 'Solar Flares',
                desc: function() { return 'All building upgrade formulas based on log(x) are now based on log(x)^2.'; },
                cost: new Decimal(100000),
                buttonID: 'sunUpg21',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                onBuy: function() {
                    if (player.astralFlag) {
                        toggleAstral();
                        loadStyles();
                        toggleAstral();
                    } else { loadStyles(); }
                },
                effect: function() {
                    return new Decimal(1);
                }
            },
            22: {
                title: 'Menagerie of Worlds',
                desc: function() { return `Unlock advanced sacrifice autobuyer options permanently, and raise the sun eater base cost multiplier to ^0.67${hasAchievement(35) ? ' (0.333 after Galactic Angst).' : '.'}`; },
                cost: new Decimal(2500000),
                buttonID: 'sunUpg22',
                displayEffect: false,
                displayTooltip: true,
                displayFormula: function() { return hasAchievement(35) ? '(1e15x -> 1e5x)' : '(1e15x -> 1e10x)' },
                effect: function() {
                    if (hasAchievement(35)) { return 0.333; }
                    else { return 0.67; }
                }
            },
            23: {
                title: 'Cosmogenesis',
                desc: function() { return 'Unlock <strong>Depleted Galaxies</strong>.<br>(This upgrade is never reset.)'; },
                cost: new Decimal(25000000),
                buttonID: 'sunUpg23',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
        }
    },
    4: {
        id: 'galactic vortex',
        tier: 4,
        resource: 'black holes',
        cost: new Decimal(1e60),
        upgResource: 'black holes',
        pBase: function()  {
            var b = new Decimal(.001);
            return b;
        },
        prod: function() {
            var p = player.galaxies.plus(player.spentGalaxies).minus(player.buildings[this.tier].amount).times(this.pBase());
            return Decimal.max(p, 0); 
        },
        resourceEff: function() {
            return player.buildings[this.tier].amount.div(10);
        },
        canAffordUpg: function(upg) {
            return player.buildings[4].amount.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'vortexBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'vortexBuildRow',
        buildingHeaderID: 'vortexHeaderRow',
        upgradesRow1ID: 'vortexUpgradesRow',
        upgradesRow2ID: 'vortexUpgradesRow2',
        upgradeBtnClass: 'vortexUpg',
        upgradeBtnUnclick: 'unclickVortexUpg',
        upgradeBtnBought: 'boughtVortexUpg',
        upgrades: {
            11: {
                title: '1.1',
                desc: function() { return 'The first three construction upgrades get sqrt(x) extra levels, where x is the level of the next tier upgrade.'; },
                cost: new Decimal(5),
                buttonID: 'vortexUpg11',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: '1.2',
                desc: function() { return 'description'; },
                cost: new Decimal("Infinity"),
                buttonID: 'vortexUpg12',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: '1.3',
                desc: function() { return 'description'; },
                cost: new Decimal("Infinity"),
                buttonID: 'vortexUpg13',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: '2.1',
                desc: function() { return 'description'; },
                cost: new Decimal("Infinity"),
                buttonID: 'vortexUpg21',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                onBuy: function() {
                    if (player.astralFlag) {
                        toggleAstral();
                        loadStyles();
                        toggleAstral();
                    } else { loadStyles(); }
                },
                effect: function() {
                    return new Decimal(1);
                }
            },
            22: {
                title: '2.2',
                desc: function() { return 'description'; },
                cost: new Decimal("Infinity"),
                buttonID: 'vortexUpg22',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return '' },
                effect: function() {
                    return new Decimal(1);
                }
            },
            23: {
                title: '2.3',
                desc: function() { return 'description'; },
                cost: new Decimal("Infinity"),
                buttonID: 'vortexUpg23',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
        }
    },
}

const CONSTR_DATA = {
    1: {
        title: 'Stronger Forges',
        desc: 'Increases the base corpse multiplier of zombies by 5% per level.',
        tier: 1,
        baseCost: new Decimal(100),
        isTimes: true,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (hasGUpgrade(3, 22)) {
                if (player.construction[this.tier].gte(50)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(49)))); }
            } else {
                if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg1',
        displayEffect: true,
        extraLevels: function() {
            let e = CONSTR_DATA[5].effect();
            return e[this.tier-1];
        },
        displayEffect: true,
        effect: function() {
            let e = Decimal.max(1+(0.05*(player.construction[this.tier].plus(this.extraLevels()))), 1);
            if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
            return e;
        }
    },
    2: {
        title: 'Factory Expansion',
        desc: 'Add .02 per level to the armament gain exponent.',
        tier: 2,
        baseCost: new Decimal(250),
        isTimes: false,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (hasGUpgrade(3, 22)) {
                if (player.construction[this.tier].gte(50)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(49)))); }
            } else {
                if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg2',
        displayEffect: true,
        extraLevels: function() {
            let e = CONSTR_DATA[5].effect();
            return e[this.tier-1];
        },
        displayEffect: true,
        effect: function() {
            let e = .02*(player.construction[this.tier].plus(this.extraLevels()));
            if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
            return e;
        }
    },
    3: {
        title: 'Abominable Steroids',
        desc: 'Boosts the abomination unit multiplier by 10% per level.',
        tier: 3,
        baseCost: new Decimal(500),
        isTimes: true,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (hasGUpgrade(3, 22)) {
                if (player.construction[this.tier].gte(50)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(49)))); }
            } else {
                if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg3',
        displayEffect: true,
        extraLevels: function() {
            let e = CONSTR_DATA[5].effect();
            return e[this.tier-1];
        },
        displayEffect: true,
        effect: function() {
            let e = Decimal.max(1+(0.1*(player.construction[this.tier].plus(this.extraLevels()))), 1);
            if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
            return e;
        }
    },
    4: {
        title: 'World Refiner',
        desc: 'Add .02 per level to the exponent of the exterminated worlds boost to corpse gain.',
        tier: 4,
        baseCost: new Decimal(1000),
        isTimes: false,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (hasGUpgrade(3, 22)) {
                if (player.construction[this.tier].gte(50)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(49)))); }
            } else {
                if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            }
            return c;
        },
        baseCostMult: 10,
        expCostMult: 10,
        buttonID: 'constrUpg4',
        displayEffect: true,
        extraLevels: function() {
            let e = CONSTR_DATA[5].effect();
            return e[this.tier-1];
        },
        effect: function() {
            let e = .02*(player.construction[this.tier].plus(this.extraLevels()));
            if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
            return e;
        }
    },
    5: {
        title: 'Putrid Renovations',
        desc: 'Starting at level 1, the first four construction upgrades get one extra level for every [1/2/3/4] levels of this one.',
        tier: 5,
        baseCost: new Decimal(1e40),
        isTimes: true,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: 100000,
        expCostMult: 10,
        buttonID: 'constrUpg5',
        displayEffect: false,
        extraLevels: function() { return 0; },
        effect: function() {
            let k = player.construction[this.tier];
            if (k==0) { return [0, 0, 0, 0]; }
            let e = new Array(4);
            for (let i=0; i<4; i++) { e[i] = Math.floor((k-1)/(i+1))+1}
            return e;
        }
    },
    6: {
        title: 'Siege Nebulas',
        desc: 'You get [x] extra depleted galaxies when you ascend with over [x^2] levels.',
        tier: 6,
        baseCost: new Decimal(1e50),
        isTimes: false,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: new Decimal(1e10),
        expCostMult: 10,
        buttonID: 'constrUpg6',
        displayEffect: true,
        extraLevels: function() { return 0; },
        effect: function() {
            let g = Math.floor(player.construction[this.tier].sqrt());
            return g;
        }
    },
}