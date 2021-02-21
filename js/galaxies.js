



function arkIsUnlocked(a) {
    return player.ark[a].unlocked;
}

function getAUpgCost(a) {
    return ARK_DATA[a].cost;
}

function getAUpgDesc(a) {
    return ARK_DATA[a].desc;
}

function getAUpgName(a) {
    return ARK_DATA[a].title;
}

function getAUpgEffect(a) {
    return ARK_DATA[a].effect();
}

function hasAUpgrade(a) {
    return player.ark[a].bought;
}

function canAffordAUpg(a) {
    return (player.bricks.gte(ARK_DATA[a].cost) && player.ark[a].unlocked);
}

function isDisplayEffectA(a) {
    return ARK_DATA[a].displayEffect;
}

function isDisplayTooltipA(a) {
    return ARK_DATA[a].displayTooltip;
}

function getGUpgCost(g, u) {
    return GALAXIES_DATA[g].upgrades[u].cost();
}

function getGUpgDesc(g, u) {
    return GALAXIES_DATA[g].upgrades[u].desc;
}

function getGUpgName(g, u) {
    return GALAXIES_DATA[g].upgrades[u].title;
}

function getGUpgEffect(g, u) {
    return GALAXIES_DATA[g].upgrades[u].effect();
}

function hasGUpgrade(g, u) {
    return player.galaxyUpgs[g][u].bought;
}

function isDisplayEffectG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayEffect;
}

function isDisplayTooltipG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayTooltip;
}

function hasPrereqGUpg(g, u) {
    if (u==11) { return true; }
    else {
        var reqs = GALAXIES_DATA[g].upgrades[u].requires;
        for (var i=0; i<reqs.length; i++) {
            if (hasGUpgrade(g, reqs[i])) { return true; }
        }
        return false;
    }
}

function canAffordGUpg(g, u) {
    if (player.galaxies.gte(GALAXIES_DATA[g].upgrades[u].cost())) {
        return hasPrereqGUpg(g, u) && !hasGUpgrade(g, u);
    } else { return false; }
}

function buyGUpg(g, u) {
    if (canAffordGUpg(g, u)) {
        let thisRow = GALAXIES_DATA[g].upgrades[u].row;
        player.galaxies = player.galaxies.minus(GALAXIES_DATA[g].upgrades[u].cost());
        player.spentGalaxies = player.spentGalaxies.plus(GALAXIES_DATA[g].upgrades[u].cost());
        player.galaxyUpgs[g][u].bought = true;
        addGUpgClass(g, u, 'boughtGalaxyUpg');
        remGUpgClass(g, u, 'galaxyUpg');

        for (let i=thisRow+1; i<=NUM_GALAXY_ROWS; i++) {
            player.rowCosts[i] = player.rowCosts[i].plus(1);
        }
        
        if (u == 21) {
            player.galaxyUpgs[g][22].locked = true;
            addGUpgClass(g, 22, 'lockedGalaxyUpg');
            remGUpgClass(g, 22, 'galaxyUpg')
            remGUpgClass(g, 22, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[22].textID).style.display = 'none';
            player.galaxyUpgs[g][32].locked = true;
            addGUpgClass(g, 32, 'lockedGalaxyUpg');
            remGUpgClass(g, 32, 'galaxyUpg')
            remGUpgClass(g, 32, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[32].textID).style.display = 'none';
        } else if (u == 22) {
            player.galaxyUpgs[g][21].locked = true;
            addGUpgClass(g, 21, 'lockedGalaxyUpg');
            remGUpgClass(g, 21, 'galaxyUpg')
            remGUpgClass(g, 21, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[21].textID).style.display = 'none';
            player.galaxyUpgs[g][31].locked = true;
            addGUpgClass(g, 31, 'lockedGalaxyUpg');
            remGUpgClass(g, 31, 'galaxyUpg')
            remGUpgClass(g, 31, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[31].textID).style.display = 'none';
        }
    }
}

function buyArkUpgrade(a) {
    if (!player.ark[a].bought && canAffordAUpg(a)) {
        player.bricks = player.bricks.minus(getAUpgCost(a));
        player.ark[a].bought = true;
        player.push(['togDisplay', a]);
        addAUpgClass(a, 'boughtArkUpg');
        remAUpgClass(a, 'arkUpg');
    }
}

function respecGalaxiesClick() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['click']) {
            if (!confirm("Are you sure? This will reset ALL of your progress up to unlocking Galaxies.")) return
        }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxiesKey() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['key']) {
            if (!confirm("Are you sure? This will reset ALL of your progress up to unlocking Galaxies.")) return
        }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxies() {
    player.galaxies = player.galaxies.plus(player.spentGalaxies);
    player.spentGalaxies = new Decimal(0);
    copyData(player.rowCosts, START_PLAYER.rowCosts);
    copyData(player.galaxyUpgs, START_PLAYER.galaxyUpgs);
    loadStyles();
}

function galaxyPrestigeClick() {
    if (player.confirmations['galaxyPrestige']['click']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function galaxyPrestigeKey() {
    if (player.confirmations['galaxyPrestige']['key']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function canGalaxyPrestige() {
    return player.worlds.gte(10);
}

function calculateGalaxyGain() {
    if (player.worlds.lt(10)) { return new Decimal(0); }
    let g = new Decimal(player.worlds).div(10);
    let d = new Decimal(g.sqrt());
    return Decimal.floor(player.worlds.pow(g.minus(d)));
}

function calculateNextGalaxy() {
    let gain = calculateGalaxyGain();
    if (gain.gte(1)) {
        let next = gain.plus(1);
        let nextW = new Decimal(player.worlds);
        let newGain = new Decimal(0);
        let g = new Decimal(0);
        let d = new Decimal(0)
        while (newGain.neq(next)) {
            nextW = nextW.plus(1);
            g = new Decimal(nextW).div(10);
            d = new Decimal(g.sqrt());
            newGain = Decimal.floor(nextW.pow(g.minus(d)));
        }
        return nextW;
    }
}

function galaxyPrestige(respec=false) {
    if (canGalaxyPrestige()) {
        if (!confirm("Are you sure? This will reset ALL of your progress up to unlocking Galaxies.")) return
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeNoConfirm(respec=false) {
    if (canGalaxyPrestige()) {
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        if (document.getElementById('respecOnAsc').checked) {
            document.getElementById('respecOnAsc').checked = false;
        }
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeReset(respec=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked) {
        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').disabled = false;
    }
    clearInterval(mainLoop);
    
    copyData(player.autobuyers, START_PLAYER.autobuyers);
    updateAutobuyersDisplay();

    player.pastAscRuns.lastRun.galaxyGain = calculateGalaxyGain();
    player.pastAscRuns.lastRun.timeSpent = (new Date).getTime()-player.pastAscRuns.lastRun.timeAscended;
    player.pastAscRuns.lastRun.timeAscended = (new Date).getTime();
    if (player.pastAscRuns.lastRun.galaxyGain.gt(player.allTimeStats.bestGalaxyGain)) { player.allTimeStats.bestGalaxyGain = new Decimal(player.pastAscRuns.lastRun.galaxyGain) }
    if (player.pastAscRuns.lastRun.galaxyGain.div(player.pastAscRuns.lastRun.timeSpent/60000).gt(player.allTimeStats.bestGalaxyRate)) { player.allTimeStats.bestGalaxyRate = new Decimal(player.pastAscRuns.lastRun.galaxyGain.div(player.pastAscRuns.lastRun.timeSpent/60000)) }
    for (var i=9; i>0; i--) { copyData(player.pastAscRuns.lastTen[i], player.pastAscRuns.lastTen[i-1]); }
    copyData(player.pastAscRuns.lastTen[0], player.pastAscRuns.lastRun);
    copyData(player.pastRuns, START_PLAYER.pastRuns);

    resetTime();
    resetTimeCounts();
    showTimeSubTab('timeDimSubTab');
    resetUnits();
    player.corpses = hasAchievement(41) ? new Decimal(START_PLAYER.corpsesAch41) : new Decimal(START_PLAYER.corpses)
    resetSpaceCounts();
    resetBuildingResources(false, true);
    resetBuildings(true);
    lockTab('unitsTab');
    lockTab('buildingsTab');
    unlockElementsOnLoad('unitsTab', 'fastBuyers');
    unlockElementsOnLoad('unitsTab', 'bulkBuyers');
    unlockElementsOnLoad('unitsTab', 'prestigeBuyer');
    unlockElementsOnLoad('unitsTab', 'advancedBuyer');
    lockTab('timeTab');
    
    
    if (document.getElementById('respecOnAsc').checked || respec) {
        respecGalaxies();
    }
    document.getElementById('respecOnAsc').checked = false;

    showUnitSubTab('unitsSubTab');
    showBuildingSubTab('buildingsSubTab');
    showTimeSubTab('timeDimSubTab');
    save();
    loadStyles();
    startInterval();
}

function resetTimeCounts() {
    player.timeResets = new Decimal(START_PLAYER.timeResets);
    player.crystals = new Decimal(START_PLAYER.crystals);
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    player.truePercent = new Decimal(START_PLAYER.truePercent);
    player.antiPercent = new Decimal(START_PLAYER.antiPercent);
    copyData(player.thisAscStats, START_PLAYER.thisAscStats);
}

const ARK_DATA = {
    'navigation': {
        name: 'navigation',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'navigationBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'torpedos': {
        name: 'torpedos',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'torpedosBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'railguns': {
        name: 'railguns',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'railgunsBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'engines': {
        name: 'engines',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'enginesBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'thrusters': {
        name: 'thrusters',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'thrustersBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'support': {
        name: 'support',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'supportBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
}

const GALAXIES_DATA = {
    1: {
        name: 'andromeda',
        id: 1,
        upgrades: {
            11: {
                title: 'title 1.11',
                desc: 'Decrease the astral enslavement time nerf from 10x -> 8x.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.11',
                lockImageID: '',
                textID: 'text1.11',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            21: {
                title: 'title 1.21',
                desc: 'Increase the exponent on the astral brick production formula from ^0.2 -> ^0.25.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.21',
                lockImageID: 'skull1.21',
                textID: 'text1.21',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            22: {
                title: 'title 1.22',
                desc: 'You produce 1% of your corpse production while in astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.22',
                lockImageID: 'skull1.22',
                textID: 'text1.22',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            31: {
                title: 'title 1.31',
                desc: 'Double the base photon production (2/sec -> 4/sec).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.31',
                lockImageID: 'skull1.31',
                textID: 'text1.31',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            32: {
                title: 'title 1.32',
                desc: 'The square root of the anti time essence boost affects time dimensions while in astral enslavement.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.32',
                lockImageID: 'skull1.32',
                textID: 'text1.32',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            41: {
                title: 'title 1.41',
                desc: 'Decrease the astral enslavement time nerf even more, 8x -> 5x.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg1.41',
                lockImageID: '',
                textID: 'text1.41',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
        },
    },
    2: {
        name: 'circinus',
        id: 2,
        upgrades: {
            11: {
                title: 'title 1.11',
                desc: 'The base zombie corpse multiplier is increased, 1.75 -> 2.5.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.11',
                lockImageID: '',
                textID: 'text2.11',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            21: {
                title: 'title 1.21',
                desc: 'Each unit tier produces the tier below it at a rate of 1/unit/sec instead of (1/tier)/unit/sec.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.21',
                lockImageID: 'skull2.21',
                textID: 'text2.21',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            22: {
                title: 'title 1.22',
                desc: 'Start every sacrifice with a 5th free exterminated world that doesn\'t count towards the world prestige requirement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.22',
                lockImageID: 'skull2.22',
                textID: 'text2.22',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            31: {
                title: 'title 1.31',
                desc: 'Unit production multipliers are boosted by your total galaxies.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.31',
                lockImageID: 'skull2.31',
                textID: 'text2.31',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return e.plus(1);
                },
            },
            32: {
                title: 'title 1.32',
                desc: 'Exponential cost scaling for all units starts after twice as many bought.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.32',
                lockImageID: 'skull2.32',
                textID: 'text2.32',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            41: {
                title: 'title 1.41',
                desc: 'First time dimensions also produce Sun Eaters at a greatly reduced rate (log(x)).',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: '/sec',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg2.41',
                lockImageID: '',
                textID: 'text2.41',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return getEssenceProdPerSecond().log10();
                },
            },
        },
    },
    3: {
        name: 'sculptor dwarf',
        id: 3,
        upgrades: {
            11: {
                title: 'title 1.11',
                desc: 'The effect of each second row Necropolis upgrade directly applies to the effect of the upgrade above it.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.11',
                lockImageID: '',
                textID: 'text3.11',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            21: {
                title: 'title 1.21',
                desc: 'Cube the <span style=\"font-weight: 800;\">Industrialize</span> effect.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.21',
                lockImageID: 'skull3.21',
                textID: 'text3.21',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(3);
                },
            },
            22: {
                title: 'title 1.22',
                desc: 'Exponential cost scaling for the first four construction upgrades starts after twice as many levels.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.22',
                lockImageID: 'skull3.22',
                textID: 'text3.22',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            31: {
                title: 'title 1.31',
                desc: 'Square your acolyte gain.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.31',
                lockImageID: 'skull3.31',
                textID: 'text3.31',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            32: {
                title: 'title 1.32',
                desc: 'The effects of the first four construction upgrades are each 20% stronger.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.32',
                lockImageID: 'skull3.32',
                textID: 'text3.32',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1.1);
                },
            },
            41: {
                title: 'title 1.41',
                desc: 'The <span style=\"font-weight: 800;\">Lightspeed</span> effect squared also applies to the production of corpses and astral bricks.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg3.41',
                lockImageID: '',
                textID: 'text3.41',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return getTUpgEffect(33).pow(2);
                },
            },
        },
    },
    4: {
        name: 'triangulum',
        id: 4,
        upgrades: {
            11: {
                title: 'title 1.11',
                desc: 'Your total galaxies boosts time essence production.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: true,
                displayFormula: '1 + x',
                buttonID: 'galaxyUpg4.11',
                lockImageID: '',
                textID: 'text4.11',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return e.plus(1);
                },
            },
            21: {
                title: 'title 1.21',
                desc: 'Quadruple your time crystal gain.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg4.21',
                lockImageID: 'skull4.21',
                textID: 'text4.21',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(4);
                },
            },
            22: {
                title: 'title 1.22',
                desc: 'The square root of the true time essence boost affects time dimensions outside of astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg4.22',
                lockImageID: 'skull4.22',
                textID: 'text4.22',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            31: {
                title: 'title 1.31',
                desc: 'Both time essence boosts are based on log(x)^2 instead of log(x).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg4.31',
                lockImageID: 'skull4.31',
                textID: 'text4.31',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(2);
                },
            },
            32: {
                title: 'title 1.32',
                desc: 'You passively produce your astral brick production ^0.9 outside of astral enslavement.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg4.32',
                lockImageID: 'skull4.32',
                textID: 'text4.32',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
            41: {
                title: 'title 1.41',
                desc: 'True and anti time essence no longer nerf the other\'s effect.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: '',
                buttonID: 'galaxyUpg4.41',
                lockImageID: '',
                textID: 'text4.41',
                cost: function() {
                    return player.rowCosts[this.row];
                },
                effect: function() {
                    return new Decimal(1);
                },
            },
        },
    },
}