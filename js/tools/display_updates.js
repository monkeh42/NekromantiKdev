//misc style/display updaters

function updateShadow() {
    app.shadowStyle = (player.isInResearch ? (getActiveResearch()==7 ? 'inset 0px 0px 20px 10px #613227' : 'inset 0px 0px 20px 10px #e34805') : '') + (player.isInResearch && player.astralFlag ? ', ' : '') + (player.astralFlag ? 'inset 0px 0px 30px 20px #1c8a2e' : '');
}

function updateSingleBuyer(id, option) {
    player.autobuyers[id][option] = !player.autobuyers[id][option];
}

function updateBuyerOrder(unitTier) {
    Vue.nextTick(function() {
        let pri = parseInt(app.$children[9].$children[unitTier-1].$children[3].priSelected);
        let index = player.autobuyers.priority.indexOf(unitTier.toString());
        if (player.autobuyers.priority[pri-1] === undefined) { newPriority[pri-1] = unitTier.toString(); }
        else {
            if (index>=0) { player.autobuyers.priority.splice(index, 1); }
            player.autobuyers.priority.splice(pri-1, 0, unitTier.toString());
        }
    })
}

function updateSacBuyer() {
    Vue.nextTick(function() {
        player.autobuyers[9]['type'] = app.$children[9].$children[8].$children[2].sacType;
        if (app.$children[9].$children[8].$children[2].sacAmount != '') {
            try {
                player.autobuyers[9]['amount'] = new Decimal(app.$children[9].$children[8].$children[2].sacAmount);
                app.$children[9].$children[8].$children[2].sacError = false;
            }
            catch(err) {
                app.$children[9].$children[8].$children[2].sacError = true;
            }
        }
    })
}

function updateAscBuyer() {
    Vue.nextTick(function() {
        if (app.$children[9].$children[10].$children[2].ascAmount != '') {
            try {
                player.autobuyers[11]['amount'] = new Decimal(app.$children[9].$children[10].$children[2].ascAmount);
                app.$children[9].$children[10].$children[2].ascError = false;
            }
            catch(err) {
                app.$children[9].$children[10].$children[2].ascError = true;
            }
        }
    })
}

function updateMaxPrestige() {
    Vue.nextTick(function() {
        if (app.$children[9].$children[9].$children[2].prestAmount != '') {
            try {
                player.autobuyers[10]['max'] = new Decimal(app.$children[9].$children[9].$children[2].prestAmount);
                app.$children[9].$children[9].$children[2].prestError = false;
            }
            catch(err) {
                app.$children[9].$children[9].$children[2].prestError = true;
            }
        }
    })
}

function toggleTimeUpgBuyer() {
    player.autobuyers['time']['on'] = !player.autobuyers['time']['on'];
}

function updateDimBuyer(tier) {
    player.autobuyers[12][tier] = !player.autobuyers[12][tier];
    //document.getElementById(button).innerHTML = player.autobuyers[12][tier] ? 'ON' : 'OFF'
}

function toggleAllTimeBuyers() {
    for (let i=1; i<=NUM_TIMEDIMS; i++) {
        if (i<=4 || player.unlocks['timeDims2']) { updateDimBuyer(i); }
    }
}

//generic UI stuff (tabs, toggles, popups etc)

function toggleRealTimeDisplays() {
    player.displayRealTime = !player.displayRealTime;
    //document.getElementById('realTimeDisplayBut').innerHTML = player.displayRealTime ? 'toggle time displays: REAL TIME' : 'toggle time displays: GAME TIME'
    let elements = document.getElementsByClassName('secDisplay');
    let el;
    for (let i=0; i<elements.length; i++) {
        el = elements.item(i);
        el.innerHTML = player.displayRealTime ? 'real sec' : 'sec'
    }
}

function toggleTooltips() {
    player.tooltipsEnabled = !player.tooltipsEnabled;
    //document.getElementById('toggleTooltips').innerHTML = player.tooltipsEnabled ? 'TOGGLE FORMULA TOOLTIPS: ON' : 'TOGGLE FORMULA TOOLTIPS: OFF' 

    document.getElementById('brickTooltip').classList.toggle('tooltip');
    document.getElementById('trueTooltip').classList.toggle('tooltip');
    document.getElementById('antiTooltip').classList.toggle('tooltip');
    document.getElementById('achBoostTooltip').classList.toggle('tooltip');
}

function showChangelog(divID) {
    var allDivs = document.getElementsByClassName('changelogPageDiv');
    var tab;
    for (var i=0; i<allDivs.length; i++) {
        tab = allDivs.item(i);
        if (tab.id === divID) {
            (tab.style.display == 'block') ? tab.style.display = 'none': tab.style.display = 'block'
        } else {
            tab.style.display = 'none';
        }
    }
}

function showChangelogSection(divID) {
    var allDivs = document.getElementsByClassName('changelogSection');
    var tab;
    var log;
    for (var i=0; i<allDivs.length; i++) {
        tab = allDivs.item(i);
        if (tab.id === divID) {
            (tab.style.display != 'none') ? tab.style.display = 'none': tab.style.display = 'table-cell'
        } else {
            tab.style.display = 'none';
            let allLogs = document.getElementsByClassName('changelogPageDiv');
            for (let j=0; j<allLogs.length; j++) {
                allLogs.item(j).style.display = 'none'; 
            }
        }
    }
}

function toggleConfirmations(action, method) {
    player.confirmations[action][method] = !player.confirmations[action][method];
}

function toggleDisplay(id) {
    player.headerDisplay[id] = !player.headerDisplay[id];
}

function openConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'block';
}

function closeConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'none';
}

function openDisplayPopup() {   
    document.getElementById('displayPopup').style.display = 'block';
    //dragElement(document.getElementById('displayPopup'));
}

function closeDisplayPopup() {
    document.getElementById('displayPopup').style.display = 'none';
}

function setDisplayDefaults() {
    copyData(player.headerDisplay, DATA.sp.headerDisplay);
}

function setConfDefaults() {
    for (let i=1; i<=DATA.ul.confirmations.rows; i++) {
        player.confirmations[DATA.ul.confirmations[i].id] = DATA.sp.confirmations[DATA.ul.confirmations[i].id];
    }
}

function isHelp() {
    return app.showHelp;
}

function tabButtonClick(id) {
    if (DATA.tabs[id]===undefined || player.tab==id) { return; }
    if (id=='h') { player.help = !player.help; }
    else { player.tab = DATA.tabs[id].pid; }
}

function subTabButtonClick(layer, id) {
    if (DATA.tabs[layer]===undefined || DATA.tabs[layer].subTabs[id]===undefined || player.subTabs[layer]==id) { return; }
    player.subTabs[layer] = DATA.tabs[layer].subTabs[id].pid;
}

function cycleSubtabs() {
    let tabName = getActiveTab();
    if (tabName === null) {return}
    switch (tabName) {
        case 'unitsTab':
            if (player.unlocks['autobuyers']) {
                if (isActiveTab('autobuyersSubTab')) { showUnitSubTab('unitsSubTab', 'unitsSubTabBut', 'unitsTabBut') }
                else { showUnitSubTab('autobuyersSubTab', 'autobuyersSubTabBut', 'unitsTabBut') }
            }
            break;
        case 'buildingsTab':
            if (player.unlocks['construction']) {
                if (isActiveTab('constructionSubTab')) { showBuildingSubTab('buildingsSubTab', 'buildingsSubTabBut', 'buildingsTabBut') }
                else { showBuildingSubTab('constructionSubTab', 'constructionSubTabBut', 'buildingsTabBut') }
            }
            break;
        case 'timeTab':
            if (player.unlocks['timeUpgrades']) {
                if (isActiveTab('timeUpgSubTab')) { showTimeSubTab('timeDimSubTab', 'timeDimSubTabBut', 'timeTabBut') }
                else { showTimeSubTab('timeUpgSubTab', 'timeUpgSubTabBut', 'timeTabBut') }
            }
            break;
        case 'galaxyTab':
            if (player.unlocks['ark']) {
                if (isActiveTab('galaxiesSubTab')) { showGalaxySubTab('researchSubTab', 'researchSubTabBut', 'galaxyTabBut') }
                else if (isActiveTab('researchSubTab')) {
                    if (player.unlocks['infResearch']) {
                        showGalaxySubTab('infResearchSubTab', 'infResearchSubTabBut', 'galaxyTabBut')
                    } else { showGalaxySubTab('arkSubTab', 'arkSubTabBut', 'galaxyTabBut') }
                }
                else if (isActiveTab('infResearchSubTab')) { showGalaxySubTab('arkSubTab', 'arkSubTabBut', 'galaxyTabBut') }
                else { showGalaxySubTab('galaxiesSubTab', 'galaxiesSubTabBut', 'galaxyTabBut') }
            }
            break;
    }
}

function isActiveTab(tabName) {
    return (document.getElementById(tabName).style.display == 'block');
}

function getActiveTab() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            return tab.id;
        }
    }
    return null;
}

function getActiveTabs() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    var allSubTabs = document.getElementsByClassName('subTab');
    var subTab;
    var aTabs = [];
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            aTabs.push(tab.id);
        }
    }
    for (var j=0; j<allSubTabs.length; j++) {
        subTab = allSubTabs.item(j);
        if (subTab.style.display === 'block') {
            aTabs.push(subTab.id);
        }
    }
    return aTabs;
}

function showResponsive() {

}

/*function showTabR(tabName, buttonName) {
    let bName = tabName + 'But'
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
            document.getElementById(tab.id + 'RowSmall').classList.remove('rNavHidden');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
            document.getElementById(tab.id + 'RowSmall').classList.add('rNavHidden');
        }
    }
    
    displayData.push(['addClass', bName, 'tabButSelected'])
    displayData.push(['addClass', bName + 'Small', 'tabButSelected'])
    displayData.push(['addClass', bName + 'Mid', 'tabButSelected'])



    player.activeTabs[0] = tabName;
    if (buttonName !== undefined) { document.getElementById(buttonName).classList.remove('tabButNotify'); }
}*/

function showGalaxy(num) {
    player.activeGalaxies[1] = num;
    updateGalaxyDisplayProps();
}

function showGalaxies(num1, num2) {
    player.activeGalaxies[1] = num1;
    player.activeGalaxies[2] = num2;
    updateGalaxyDisplayProps();
}

function changeGalaxiesDisplayed() {
    Vue.nextTick(function() {
        player.activeGalaxies[0] = app.galSelected;
        updateGalaxyDisplayProps();
    })
}

function updateGalaxyDisplayProps() {
    if (player.activeGalaxies[0]=='4') {
        app.$children[45].displayAll = true;
        for (let i=1; i<=4; i++) {
            app.$children[45].displaySingles[i-1] = true;
        }
        return;
    }
    else {
        if (player.activeGalaxies[0]=='2') {
            app.$children[45].displayAll = true;
            app.$children[45].displayAll = false;
            for (let i=1; i<=4; i++) {
                if (player.activeGalaxies[1]==i.toString() || player.activeGalaxies[2]==i.toString()) { app.$children[45].displaySingles[i-1] = true; }
                else { app.$children[45].displaySingles[i-1] = false; }
            }
        } else {
            app.$children[45].displayAll = true;
            app.$children[45].displayAll = false;
            for (let i=1; i<=4; i++) {
                if (player.activeGalaxies[1]==i.toString()) { app.$children[45].displaySingles[i-1] = true; }
                else { app.$children[45].displaySingles[i-1] = false; }
            }
        }
    }
}

function showMilestones() {
    document.getElementById('milestonesPopup').style.display = 'block';
    //dragElement(document.getElementById('milestonesPopup'));
}

function hideMilestones() {
    document.getElementById('milestonesPopup').style.display = 'none';
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

function updateUnlocks() {
    for (let id in DATA.ul.main) {
        if (!player.unlocks[id] && DATA.ul.main[id].condition()) { unlockItem(id); }
    }
}

function unlockItem(item) {
    player.unlocks[item] = true;
    DATA.ul.main[item].onUnlock();
}

function updateAchievements() {
    for (let id in DATA.ach) {
        if (id!='rows'&&id!='cols') {
            if (!player.achievements[id] && DATA.ach[id].canUnlock()) {
                unlockAchievement(id)
            }
        }
    }
}

function unlockAchievement(a) {
    player.achievements[a] = true;
    showPopup('achUnlockPopup', 'Achievement Unlocked!', 2000);
    DATA.ach[a].onUnlock();
}

function mouseoverAchievement(ach) {
    if (document.getElementById(DATA.ach[ach].divID).classList.contains('achievementNew')) { document.getElementById(DATA.ach[ach].divID).classList.remove('achievementNew'); }
    for (let id in player.achievements) {
        if (document.getElementById(DATA.ach[ach].divID).classList.contains('achievementNew')) { return; }
    }
    document.getElementById('statsTabBut').classList.remove('tabButIndirectNotify');
    document.getElementById('achSubTabBut').classList.remove('tabButNotify');
}

function updateMilestones() {
    for (let id in DATA.ms) {
        if (!player.milestones[id] && DATA.ms[id].canUnlock()) {
            unlockMilestone(id)
        } 
    }
}

function unlockMilestone(m) {
    player.milestones[m] = true;
    showPopup('milesUnlockPopup', 'Milestone Unlocked!', 2000);
}

function closeOfflinePopup() {
    document.getElementById('offlineGainPopup').style.display = 'none';
}

function ascensionTextSingulizer(amt) {
    if ((new Decimal(1)).eq(amt)) { return 'ascension'; }
    else { return 'ascensions'; }
}

function galaxyTextSingulizer(amt) {
    if ((new Decimal(1)).eq(amt)) { return 'galaxy'; }
    else { return 'galaxies'; }
}

function showPopup(type, text, ms) {
    timedPopups.push({className: type, popupText: text, time: ms});
}

function showNormalPopup(pid) {
    app.$children[pid].isActivePop = true;
}

function closeNormalPopup(pid) {
    app.$children[pid].isActivePop = false;
}

//help text generators + related

function generateHelpText(tab) {
    var hText = HELP_TEXTS[tab]['mainTab'];

    for (k in HELP_TEXTS[tab]) {
        if (k != 'mainTab' && HELP_TEXTS[tab][k] != '' && player.unlocks[k]) { hText = hText + HELP_TEXTS[tab][k] + '<br>'; }
    }
    return hText;
}

function generateHelpForFullPage(tabName, button, section) {
    if (document.getElementById(tabName).style.display == 'block') {
        document.getElementById(tabName).style.display = 'none';
        document.getElementById(button).className = 'helpPageBut';
    }
    else {
        var allTabs = document.getElementsByClassName('helpPageDiv');
        var tab; 

        var hText = '';
        for (k in HELP_TEXTS[section]) {
            if (HELP_TEXTS[section][k] != '') { hText = hText + HELP_TEXTS[section][k] + '<br>'; } 
        }
        document.getElementById(tabName).innerHTML = hText;

        for (var i=0; i<allTabs.length; i++) {
            tab = allTabs.item(i);
            if (tab.id === (tabName)) {
                tab.style.display = 'block';
                document.getElementById(button).className = 'helpPageButSelected';
            } else {
                tab.style.display = 'none';
                document.getElementById(tab.id + 'But').className = 'helpPageBut';
            }
        }
    }
}

function generateLastSac(id) {
    if (player.pastRuns.lastTen[id].timeSpent == 0) { return [0, 0, 0]; }

    let timeSpent = player.pastRuns.lastTen[id].timeSpent
    let gainRate = new Decimal(player.pastRuns.lastTen[id].crystalGain.div(timeSpent/(1000*60)));
    let gain = new Decimal(player.pastRuns.lastTen[id].crystalGain);

    return [timeSpent, gain, gainRate]; 
}

function generateSacString(id) {
    let data = generateLastSac(id);

    return `${formatTime(data[0], 'num')}; ${formatDefault2(data[1])} crystals; ${ formatDefault2(data[2]) + " crystals/min" }`;
}

function generateSacAvgs() {
    if (player.pastRuns.lastRun.timeSpent == 0) { return ''; }

    let totalTime = 0;
    let totalGain = new Decimal(0);
    let count=0;
    let data = [];

    for (let i=0; i<10; i++) {
        data = generateLastSac(i);
        totalTime+=data[0];
        totalGain = totalGain.plus(data[1]);
        if (data[0]!=0) { count++; }
    }

    return `${formatTime(totalTime/count, 'num')}; ${formatDefault2(totalGain.div(count))} crystals; ${ formatDefault2(totalGain.div(totalTime/(60*1000))) + " crystals/min" }`;
}

function generateLastAsc(id) {
    if (player.pastAscRuns.lastTen[id].timeSpent == 0) { return [0, 0, 0]; }

    let timeSpent = player.pastAscRuns.lastTen[id].timeSpent
    let gainRate = new Decimal(player.pastAscRuns.lastTen[id].galaxyGain.div(timeSpent/(1000*60)));
    let gain = new Decimal(player.pastAscRuns.lastTen[id].galaxyGain);

    return [timeSpent, gain, gainRate]; 
}

function generateAscString(id) {
    let data = generateLastAsc(id);

    return `${formatTime(data[0], 'num')}; ${formatDefault2(data[1])} galaxies; ${ formatDefault2(data[2]) + " galaxies/min" }`;
}

function generateAscAvgs() {
    if (player.pastAscRuns.lastRun.timeSpent == 0) { return ''; }

    let totalTime = 0;
    let totalGain = new Decimal(0);
    let count=0;
    let data = [];

    for (let i=0; i<10; i++) {
        data = generateLastAsc(i);
        totalTime+=data[0];
        totalGain = totalGain.plus(data[1]);
        if (data[0]!=0) { count++; }
    }

    return `${formatTime(totalTime/count, 'num')}; ${formatDefault2(totalGain/count)} galaxies; ${ formatDefault2(totalGain.div(totalTime/(60*1000))) + " galaxies/min" }`;
}