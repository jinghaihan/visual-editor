const ComponentTemplate = {
  Border: require('../component/Template/Border/Border.vue').default,
  Decoration: require('../component/Template/Decoration/Decoration.vue').default,
  MultilineText: require('../component/Template/Text/MultilineText.vue').default,
  CarouselText: require('../component/Template/Text/CarouselText.vue').default,
  BloomText: require('../component/Template/Text/BloomText.vue').default,
  DigitalFlop: require('../component/Template/Text/DigitalFlop.vue').default,
  ScrollBoard: require('../component/Template/Table/ScrollBoard.vue').default,
  ScrollRankingBoard: require('../component/Template/Table/ScrollRankingBoard.vue').default,
  DetailTable: require('../component/Template/Table/DetailTable.vue').default,
  LoadContainer: require('../component/Template/Custom/LoadContainer.vue').default,
  CarouselContainer: require('../component/Template/Custom/CarouselContainer.vue').default,
  TabContainer: require('../component/Template/Custom/TabContainer.vue').default,
  MediaImage: require('../component/Template/Media/MediaImage.vue').default
}

const CellResource = {
  ChartResource: require('../resource/Cell/Chart/Chart').default,
  BorderResource: require('../resource/Cell/Border/Border').default,
  DecorationResource: require('../resource/Cell/Decoration/Decoration').default,
  TextResource: require('../resource/Cell/Text/Text').default,
  TableResource: require('../resource/Cell/Table/Table').default,
  MediaResource: require('../resource/Cell/Media/Media').default,
  CustomResource: require('../resource/Cell/Custom/Custom').default
}

export {
  ComponentTemplate,
  CellResource
}
