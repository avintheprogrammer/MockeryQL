function toSlide(asset = {}) {
  const {
    gsx$cardtype: type = {},
    gsx$title: title = {},
    gsx$subtitle: subtitle = {},
    gsx$bodytext: body = {},
    gsx$imageurl: imageurl = {},
    gsx$imagecaption: imageCaption = {},
    gsx$videothumbnail: videoImage = {},
    gsx$videotitle: videoTitle = {},
    gsx$videoduration: videoTime = {},
    gsx$quote: quote = {},
    gsx$quotecredit: author = {},
    gsx$quotelinkurl: quoteLinkUrl = {},
    gsx$quotelinktext: quoteLinkText = {},
    gsx$videourl: videoUrl = {},
  } = asset;

  const serializedItem = {
    type: type.$t,
    title: title.$t,
    subtitle: subtitle.$t,
    body: (body.$t || '').split(/\r|\n/),
    imageurl: imageurl.$t,
    quote: quote.$t,
    author: author.$t,
    quoteLinkUrl: quoteLinkUrl.$t,
    quoteLinkText: quoteLinkText.$t,
    imageCaption: imageCaption.$t,
  };

  if (serializedItem.type === 'Video Dominant' || serializedItem.type === 'Alternate Video Dominant') {
    serializedItem.card = {
      title: videoTitle.$t,
      image: videoImage.$t,
      videoTime: videoTime.$t,
      videoUrl: videoUrl.$t,
    };
  }

  return serializedItem;
}

export default function serialize(asset = []) {
  const { entry: entries = [] } = asset.feed || {};
  return entries.map(toSlide);
}
