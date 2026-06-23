// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';

const WORLD_MAP_SECTION = $w('#worldMapSection');
const WORLD_MAP_SECTION_TITLE = $w('#worldMapSection-Title');
const WORLD_MAP_SECTION_SEARCH_INPUT = $w('#worldMapSection-Search-Input');
const WORLD_MAP_SECTION_DATEPICKER_INPUT = $w('#worldMapSection-DatePicker-Input');
const WORLD_MAP_SECTION_OPTION_DROPDOWN_INPUT = $w('#worldMapSection-Option-Dropdown-Input');
const WORLD_MAP_SECTION_TOPACTIONBUTTONS = $w('#worldMapSection-TopActionButtons');
const WORLD_MAP_SECTION_TOPACTIONBUTTONS_ACTION2_BUTTON = $w('#worldMapSection-TopActionButtons-Cancel-Button');
const WORLD_MAP_SECTION_TOPACTIONBUTTONS_ACTION1_BUTTON = $w('#worldMapSection-TopActionButtons-Submit-Button');
const WORLD_MAP_SECTION_iFRAME_CONTAINER = $w('#worldMapSection-iFrame-Container');
const WORLD_MAP_SECTION_iFRAME = $w('#worldMapSection-iFrame');
const WORLD_MAP_SECTION_iFRAME_DISPLAY_TEXT = $w('#worldMapSection-iFrame-Display-Text');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER = $w('#worldMapSection-iFrame-Analytics-Container');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_1 = $w('#worldMapSection-iFrame-Analytics-Container-1');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_1_TEXT = $w('#worldMapSection-iFrame-Analytics-Container-1-Text');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_2 = $w('#worldMapSection-iFrame-Analytics-Container-2');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_2_TEXT = $w('#worldMapSection-iFrame-Analytics-Container-2-Text');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_3 = $w('#worldMapSection-iFrame-Analytics-Container-3');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_3_TEXT = $w('#worldMapSection-iFrame-Analytics-Container-3-Text');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_4 = $w('#worldMapSection-iFrame-Analytics-Container-4');
const WORLD_MAP_SECTION_iFRAME_ANALYTICS_CONTAINER_4_TEXT = $w('#worldMapSection-iFrame-Analytics-Container-4-Text');
const WORLD_MAP_SECTION_iFRAME_STATUSCONTAINER = $w('#worldMapSection-iFrame-StatusContainer');
const WORLD_MAP_SECTION_iFRAME_STATUSCONTAINER_TEXT = $w('#worldMapSection-iFrame-StatusContainer-Text');

let outbreakData = [];
let mapIsReady = false;

function postToMapFrame(message) {
  if (!mapIsReady) {
    return;
  }

  WORLD_MAP_SECTION_iFRAME.postMessage(message);
}

function sendOutbreakDataToMap() {
  postToMapFrame({
    type: 'OUTBREAK_DATA',
    payload: outbreakData,
  });
}

function sendSearchToMap() {
  const query = String(WORLD_MAP_SECTION_SEARCH_INPUT.value || '').trim();

  if (!query) {
    return;
  }

  postToMapFrame({
    type: 'SET_LOCATION',
    payload: query,
  });
}

function registerIframeEvents() {
  WORLD_MAP_SECTION_iFRAME.onMessage((event) => {
    const message = event.data;

    if (!message || typeof message !== 'object') {
      return;
    }

    if (message.type === 'MAP_READY') {
      mapIsReady = true;
      sendOutbreakDataToMap();
      sendSearchToMap();
    }
  });
}

function registerSearchEvents() {
  WORLD_MAP_SECTION_TOPACTIONBUTTONS_ACTION1_BUTTON.onClick(() => {
    sendSearchToMap();
  });

  WORLD_MAP_SECTION_SEARCH_INPUT.onKeyPress((event) => {
    if (event.key === 'Enter') {
      sendSearchToMap();
    }
  });
}

$w.onReady(async function () {
  registerIframeEvents();
  registerSearchEvents();

  try {
    const results = await wixData.query("T-VirusOutbreak").limit(100).find();

    outbreakData = results.items.map((item) => ({
      nameOfArea: item.nameOfArea,
      population: Number(item.population || 0),
      infected: Number(item.infected || 0)
    }));

    sendOutbreakDataToMap();
  } catch (error) {
    console.error("Failed to load T-VirusOutbreak collection:", error);
  }
});