const START_PLAYER = {
    corpses: new Decimal(10),
    units: {
        1: {
            unlocked: true,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        2: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        3: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        4: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        5: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        6: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        7: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        8: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
    },
    
    // this is [number of units, tier]
    nextSpaceReset: [1, 5],
    spaceResets: new Decimal(0),
    worlds: new Decimal(0),

    buildings: {
        1: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        2: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        3: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
    },

    construction: {
        1: new Decimal(0),
        2: new Decimal(0),
        3: new Decimal(0),
        4: new Decimal(0),
    },

    timeDims: {
        1: {
            unlocked: true,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        2: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        3: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        4: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
    },

    timeUpgs: {
        11: false,
        12: false,
        13: false,
        14: false,
        21: false,
        22: false,
        23: false,
        24: false,
        31: false,
        32: false,
        33: false,
        34: false,
    },

    autobuyers: {
        1: {
            on: false,
            fast: false,
            bulk: false,
        },
        2: {
            on: false,
            fast: false,
            bulk: false,
        },
        3: {
            on: false,
            fast: false,
            bulk: false,
        },
        4: {
            on: false,
            fast: false,
            bulk: false,
        },
        5: {
            on: false,
            fast: false,
            bulk: false,
        },
        6: {
            on: false,
            fast: false,
            bulk: false,
        },
        7: {
            on: false,
            fast: false,
            bulk: false,
        },
        8: {
            on: false,
            fast: false,
            bulk: false,
        },
        9: {
            on: false,
            fast: false,
            amount: new Decimal(0),
            type: 'atx',
            autolock: true,
        },
        10: {
            on: false,
            fast: false,
            priority: false,
        },
        
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    },

    bricks: new Decimal(0),
    brickGainExp: 0.2,
    astralFlag: false,

    crystals: new Decimal(0),
    trueEssence: new Decimal(0),
    truePercent: 50,
    antiPercent: 50,
    antiEssence: new Decimal(0),
    timeResets: new Decimal(0),
    timeLocked: false,
    
    totalCorpses: new Decimal(0),
    totalWorlds: new Decimal(0),
    totalSpaceResets: new Decimal(0),
    totalTimeResets: new Decimal(0),
    totalCrystals: new Decimal(0),

    bestCrystalGain: new Decimal(0),
    bestCrystalRate: new Decimal(0),

    pastRuns: {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(0),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
        ],
    },
    
    lastUpdate: new Date(),
    lastAutoSave: new Date(),
    lastAutobuy: new Date(),

    unlocks: {
        'unitsTab': {
            'mainTab': true, 
            'spacePrestige': false,  
            'autobuyers': false,
            'fastBuyers': false,
            'BulkBuyers': false,
            'prestigeBuyer': false,
            'advancedBuyer': false,
        },
        'buildingsTab': {
            'mainTab': false,
            'factory': false,
            'factoryRow2': false,
            'necropolis': false,
            'necropolisRow2':false,
            'sun': false,
            'sunRow2': false,
            'construction': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
        },
        'galaxyTab': {
            'mainTab': false,
            'arkTab': false,
        },
    },

    achievements: {
        11: {
            unlocked: false,
            new: false,
        },
        12: {
            unlocked: false,
            new: false,
        },
        13: {
            unlocked: false,
            new: false,
        },
        14: {
            unlocked: false,
            new: false,
        },
        15: {
            unlocked: false,
            new: false,
        },
    },

    confirmations: {
        'worldPrestige': {
            'click': true,
            'key': true,
        },
        'timePrestige': {
            'click': true,
            'key': true,
        },
        'timeRespec': {
            'click': true,
            'key': true,
        },
    },

    tooltipsEnabled: false,
    activeTabs: ['unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'statSubTab'],
    hotKeysOn: true,
    displayData: [],
}

const ACH_DATA = {
    11: {
        title: 'The Astral Brick Road',
        desc: 'Unlock Buildings.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach11',
        canUnlock: function() {
            return player.unlocks['buildingsTab']['mainTab'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    12: {
        title: 'Nekro-Carpentry',
        desc: 'Unlock Construction.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach12',
        canUnlock: function() {
            return player.unlocks['buildingsTab']['construction'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    13: {
        title: 'Killing Time',
        desc: 'Unlock Time Warp.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach13',
        canUnlock: function() {
            return player.unlocks['timeTab']['mainTab'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    14: {
        title: 'Master Of The Dead',
        desc: 'Own at least one of each unit.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach14',
        canUnlock: function() {
            for (let i=1; i<=NUM_UNITS; i++) {
                if (player.units[i].amount.eq(0)) { return false; }
            }
            return true;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    15: {
        title: 'One Sun, Two Sun, Dead Sun, Blue Sun',
        desc: 'Build the Dead Sun.',
        reward: 'Double base nekro-photon production (2/sec -> 4/sec).',
        showEffect: false,
        hasReward: true,
        divID: 'ach15',
        canUnlock: function() {
            return isBuilt(3);
        },
        effect: function() {
            return new Decimal(2);
        },
        onUnlock: function() {
            return;
        }
    },
}

const UNLOCKS_DATA = {
    'unitsTab': {
        'mainTab': {
            unlocked: true,
            classNotID: false,
            idsToShow: [],
            idsToHide: [],
            condition: function() {
                return true;
            }
        }, 
        'spacePrestige': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['spacePresContainer'],
            idsToHide: [],
            condition: function() {
                return player.units[4].bought.gte(1);
            }
        },  
        'autobuyers': {
            unlocked: false,
            classNotID: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: ['unitsSubMenu', 'autobuyersSubTabBut'],
            idsToHide: [],
            condition: function() {
                return hasTUpgrade(13);
            }
        },
        'fastBuyers': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerSpeedOnContainer'],
            cssVar: '--speedDisplay',
            classToEnable: 'speedBuyerRadio',
            condition: function() {
                return hasTUpgrade(24);
            }
        },
        'bulkBuyers': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerBulkOnContainer'],
            cssVar: '--bulkDisplay',
            classToEnable: 'bulkBuyerRadio',
            condition: function() {
                return hasTUpgrade(33);
            }
        },
        'prestigeBuyer': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: [],
            cssVar: '--prestigeDisplay',
            condition: function() {
                return hasTUpgrade(34);
            }
        },
        'advancedBuyer': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerAmountOptionsContainer'],
            cssVar: '--optionsDisplay',
            classToEnable: 'buyerList',
            condition: function() {
                return hasUpgrade(3, 22);
            }
        },
    },
    'buildingsTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            notifyID: 'buildingsTabBut',
            idsToShow: ['buildingsTabCell', 'worldsBonusDisplay', 'totalBonusDisplay'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(1);
            }
        },
        'factory': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['factoryUpgradesRow1', 'factoryHeaderRow'],
            idsToHide: ['factoryBuildRow'],
            condition: function() {
                return isBuilt(1);
            }
        },
        'factoryRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['factoryUpgradesRow2'],
            idsToHide: [],
            condition: function() {
                return hasUpgrade(3, 11) && isBuilt(1);
            }
        },
        'necropolis': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['necropolisUpgradesRow1', 'necropolisHeaderRow'],
            idsToHide: ['necropolisBuildRow'],
            condition: function() {
                return isBuilt(2);
            }
        },
        'necropolisRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['necropolisUpgradesRow2'],
            idsToHide: [],
            condition: function() {
                return hasUpgrade(3, 12) && isBuilt(2);
            }
        },
        'sun': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['sunUpgradesRow', 'sunHeaderRow'],
            idsToHide: ['sunBuildRow'],
            condition: function() {
                return isBuilt(3);
            }
        },
        'sunRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['sunUpgradesRow2'],
            idsToHide: [],
            condition: function() {
                return hasTUpgrade(34) && isBuilt(3);
            }
        },
        'construction': {
            unlocked: false,
            classNotID: false,
            notifyID: 'constructionSubTabBut',
            parentNotify: 'buildingsTabBut',
            idsToShow: ['buildingsSubMenu', 'constructionSubTabBut'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(2);
            }
        },
    },
    'timeTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            notifyID: 'timeTabBut',
            idsToShow: ['timeTabCell', 'timeBoostDisplay'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(3);
            }
        },
        'timeUpgrades': {
            unlocked: false,
            classNotID: false,
            notifyID: 'timeUpgSubTabBut',
            parentNotify: 'timeTabBut',
            idsToShow: ['timeSubMenu', 'timeUpgSubTabBut'],
            idsToHide: [],
            condition: function() {
                return hasUpgrade(3, 13);
            }
        }
    },
    'galaxyTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['galaxyTabCell', 'timeBoostDisplay'],
            idsToHide: [],
            condition: function() {
                return false;
            }
        },
        'arkTab': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['galaxiesSubMenu', 'shipSubTabBut'],
            idsToHide: [],
            condition: function() {
                return false;
            }
        },
    },
}

const HOTKEYS = {
    'm': {
        desc: 'Max All Units',
        onPress: function() {
            buyMaxAll();
        }
    },
    'a': {
        desc: 'Toggle Astral Enslavement',
        onPress: function() {
            toggleAstral();
        }
    },
    'w': {
        desc: 'World Prestige',
        onPress: function() {
            spacePrestigeKey();
        }
    },
    's': {
        desc: 'Sacrifice',
        onPress: function() {
            timePrestigeKey();
        }
    },
    'r': {
        desc: 'Respec Time Production',
        onPress: function() {
            respecTimeKey();
        }
    },
    '1': {
        desc: 'Buy One Zombie',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(1) : buySingleUnit(1)
        }
    },
    '2': {
        desc: 'Buy One Abomination',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(2) : buySingleUnit(2)
        }
    },
    '3': {
        desc: 'Buy One Skeleton Mage',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(3) : buySingleUnit(3)
        }
    },
    '4': {
        desc: 'Buy One Banshee',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(4) : buySingleUnit(4)
        }
    },
    '5': {
        desc: 'Buy One Lich',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(5) : buySingleUnit(5)
        }
    },
    '6': {
        desc: 'Buy One Behemoth',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(6) : buySingleUnit(6)
        }
    },
    '7': {
        desc: 'Buy One Ancient One',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(7) : buySingleUnit(7)
        }
    },
    '8': {
        desc: 'Buy One Sun Eater',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(8) : buySingleUnit(8)
        }
    },
}



function fixResetBug() {
    var num = 2*(Math.round(player.spaceResets)-3)
    switch (Math.round(player.spaceResets)) {
        case 0:
            player.nextSpaceReset = new Array(1, 5);
            break;
        case 1:
            player.nextSpaceReset = new Array(1, 6);
            break;
        case 2:
            player.nextSpaceReset = new Array(1, 7);
            break;
        case 3:
            player.nextSpaceReset = new Array(1, 8);
            break;
        default:
            player.nextSpaceReset = new Array(1+num, 8);

    }
    START_PLAYER.corpses = new Decimal(10);
    copyData(START_PLAYER.units, {
        1: {
            unlocked: true,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        2: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        3: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        4: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        5: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        6: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        7: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        8: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
    });
    
    // this is [number of units, tier]
    START_PLAYER.nextSpaceReset = new Array(1, 5);
    START_PLAYER.spaceResets = new Decimal(0)
    START_PLAYER.worlds = new Decimal(0);

    copyData(START_PLAYER.buildings, {
        1: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        2: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        3: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
    });

    copyData(START_PLAYER.construction, {
        1: new Decimal(0),
        2: new Decimal(0),
        3: new Decimal(0),
        4: new Decimal(0),
    });

    copyData(START_PLAYER.timeDims, {
        1: {
            unlocked: true,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        2: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        3: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        4: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
    });

    copyData(START_PLAYER.timeUpgs, {
        11: false,
        12: false,
        13: false,
        14: false,
        21: false,
        22: false,
        23: false,
        24: false,
        31: false,
        32: false,
        33: false,
        34: false,
    });

    copyData(START_PLAYER.autobuyers, {
        1: {
            on: false,
            fast: false,
            bulk: false,
        },
        2: {
            on: false,
            fast: false,
            bulk: false,
        },
        3: {
            on: false,
            fast: false,
            bulk: false,
        },
        4: {
            on: false,
            fast: false,
            bulk: false,
        },
        5: {
            on: false,
            fast: false,
            bulk: false,
        },
        6: {
            on: false,
            fast: false,
            bulk: false,
        },
        7: {
            on: false,
            fast: false,
            bulk: false,
        },
        8: {
            on: false,
            fast: false,
            bulk: false,
        },
        9: {
            on: false,
            fast: false,
            amount: new Decimal(0),
            type: 'atx',
            autolock: true,
        },
        10: {
            on: false,
            fast: false,
            priority: false,
        },
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    });

    copyData(START_PLAYER.pastRuns, {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(0),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
        ],
    });

    START_PLAYER.bricks = new Decimal(0);
    START_PLAYER.brickGainExp = 0.2;
    START_PLAYER.astralFlag = false;

    START_PLAYER.crystals = new Decimal(0);
    START_PLAYER.trueEssence = new Decimal(0);
    START_PLAYER.truePercent = 50;
    START_PLAYER.antiPercent = 50;
    START_PLAYER.antiEssence = new Decimal(0);
    START_PLAYER.timeResets = new Decimal(0);
    START_PLAYER.timeLocked = false;
    
    START_PLAYER.totalCorpses = new Decimal(0),
    START_PLAYER.totalWorlds = new Decimal(0),
    START_PLAYER.totalSpaceResets = new Decimal(0),
    START_PLAYER.totalTimeResets = new Decimal(0),
    START_PLAYER.totalCrystals = new Decimal(0),
    
    START_PLAYER.lastUpdate = new Date();
    START_PLAYER.lastAutoSave = new Date();
    START_PLAYER.lastAutobuy = new Date();

    copyData(START_PLAYER.unlocks, {
        'unitsTab': {
            'mainTab': true, 
            'spacePrestige': false,  
            'autobuyers': false,
            'fastBuyers': false,
            'BulkBuyers': false,
            'prestigeBuyer': false,
            'advancedBuyer': false,
        },
        'buildingsTab': {
            'mainTab': false,
            'factory': false,
            'factoryRow2': false,
            'necropolis': false,
            'necropolisRow2':false,
            'sun': false,
            'sunRow2': false,
            'construction': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
        },
        'galaxyTab': {
            'mainTab': false,
            'arkTab': false,
        },
    });

    copyData(START_PLAYER.achievements, {
        11: {
            unlocked: false,
            new: false,
        },
        12: {
            unlocked: false,
            new: false,
        },
        13: {
            unlocked: false,
            new: false,
        },
        14: {
            unlocked: false,
            new: false,
        },
        15: {
            unlocked: false,
            new: false,
        },
    });

    copyData(START_PLAYER.confirmations, {
        'worldPrestige': {
            'click': true,
            'key': true,
        },
        'timePrestige': {
            'click': true,
            'key': true,
        },
        'timeRespec': {
            'click': true,
            'key': true,
        },
    });

    START_PLAYER.tooltipsEnabled = false;
    START_PLAYER.activeTabs = new Array('unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'statSubTab');
    START_PLAYER.hotKeysOn = true,
    START_PLAYER.displayData = new Array(0);

    fixData(player, START_PLAYER);
    save();
}