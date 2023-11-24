export enum ComponentGroupEnum {
  CHART = 'chart',
  TEXT = 'text',
  MEDIA = 'media',
  SEARCH = 'search',
  ADVANCE = 'advance',
  CLIPBOARD = 'clipBoard',
}

export enum ComponentTypeEnum {
  DV_BASE_CELL = 'dv_base_cell',
  DV_ECHART_CELL = 'dv_echart_cell',
  DV_THREE_CELL = 'dv_three_cell',
  DV_CESIUM_CELL = 'dv_cesium_cell',
}

export enum ComponentEnum {
  DV_BAR = 'dv-bar',
  DV_BAR_STACK = 'dv-bar-stack',
  DV_STRIP = 'dv-strip',
  DV_STRIP_STACK = 'dv-strip-stack',
  DV_LINE = 'dv-line',
  DV_LINE_AREA = 'dv-line-area',
  DV_BIAXIAL = 'dv-biaxial',
  DV_PIE = 'dv-pie',
  DV_RADAR = 'dv-radar',
  DV_FUNNEL = 'dv-funnel',
  DV_SCATTER = 'dv-scatter',
  DV_HEATMAP = 'dv-heatmap',
  DV_TREE_MAP = 'dv-tree-map',
  DV_LIQUID_FILL = 'dv-liquid-fill',
  DV_WORD_CLOUD = 'dv-word-cloud',

  DV_TABLE = 'dv-table',
  DV_TABLE_CROSS = 'dv-table-cross',

  DV_TEXT = 'dv-text',
  DV_TITLE = 'dv-title',
  DV_MARQUEE = 'dv-marquee',
  DV_STATISTIC = 'dv-statistic',
  DV_CLOCK = 'dv-clock',
  DV_WEATHER = 'dv-weather',

  DV_IMAGE = 'dv-image',
  DV_BORDER = 'dv-border',

  DV_SWIPER = 'dv-swiper',
  DV_3D_SCENE = 'dv-3d-scene',
  DV_GIS_SCENE = 'dv-gis-scene',
}

const ComponentCellEnum = {}
ComponentCellEnum[ComponentTypeEnum.DV_BASE_CELL] = [
  ComponentEnum.DV_TABLE,
  ComponentEnum.DV_TABLE_CROSS,
  ComponentEnum.DV_TEXT,
  ComponentEnum.DV_TITLE,
  ComponentEnum.DV_MARQUEE,
  ComponentEnum.DV_STATISTIC,
  ComponentEnum.DV_CLOCK,
  ComponentEnum.DV_WEATHER,
  ComponentEnum.DV_IMAGE,
  ComponentEnum.DV_BORDER,
  ComponentEnum.DV_SWIPER,
]
ComponentCellEnum[ComponentTypeEnum.DV_ECHART_CELL] = [
  ComponentEnum.DV_BAR,
  ComponentEnum.DV_BAR_STACK,
  ComponentEnum.DV_STRIP,
  ComponentEnum.DV_STRIP_STACK,
  ComponentEnum.DV_LINE,
  ComponentEnum.DV_LINE_AREA,
  ComponentEnum.DV_BIAXIAL,
  ComponentEnum.DV_PIE,
  ComponentEnum.DV_RADAR,
  ComponentEnum.DV_FUNNEL,
  ComponentEnum.DV_SCATTER,
  ComponentEnum.DV_HEATMAP,
  ComponentEnum.DV_TREE_MAP,
  ComponentEnum.DV_LIQUID_FILL,
  ComponentEnum.DV_WORD_CLOUD,
]
ComponentCellEnum[ComponentTypeEnum.DV_THREE_CELL] = [ComponentEnum.DV_3D_SCENE]
ComponentCellEnum[ComponentTypeEnum.DV_CESIUM_CELL] = [ComponentEnum.DV_GIS_SCENE]

export { ComponentCellEnum }
