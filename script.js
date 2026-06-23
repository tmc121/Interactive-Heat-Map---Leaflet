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



$w.onReady(async function () {
  try {
    const results = await wixData.query("T-VirusOutbreak").limit(100).find();

    const outbreakData = results.items.map((item) => ({
      nameOfArea: item.nameOfArea,
      population: Number(item.population || 0),
      infected: Number(item.infected || 0)
    }));
	

    WORLD_MAP_SECTION_iFRAME.postMessage({
      type: "OUTBREAK_DATA",
      payload: outbreakData,
	  
    });
  } catch (error) {
    console.error("Failed to load T-VirusOutbreak collection:", error);
  }
});

function renderHeat() {
  const heatPoints = buildHeatPoints();

  if (heatLayer) {
    heatLayer.setLatLngs(heatPoints);
  } else {
    heatLayer = L.heatLayer(heatPoints, {
      radius: 42,
      blur: 32,
      maxZoom: 5,
      minOpacity: 0.28,
      max: 1,
      gradient: {
        0.15: "#1b263b",
        0.3: "#415a77",
        0.45: "#778da9",
        0.6: "#ffba08",
        0.78: "#f48c06",
        1.0: "#d00000"
      }
    }).addTo(map);
  }

  renderTooltips();
}