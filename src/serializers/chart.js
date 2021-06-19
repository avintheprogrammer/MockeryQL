import ImageSerializer from './image';

function serializeDefaultChart(asset) {
  const {
    type,
    slug: headline,
    name: title,
    url,
    datePublished,
    description,
    chartType,
  } = asset;

  return {
    type,
    headline,
    title,
    url,
    datePublished,
    description,
    chartType,
  };
}

function serializeStockChart(asset) {
  const {
    chartColumn: headers,
    timeFrame,
    chartIssueId: tickerIssueIDs,
    chartIssueDetail: tickerIssueDetails,
  } = asset;
  return {
    ...serializeDefaultChart(asset),
    headers,
    timeFrame,
    tickerIssueIDs,
    tickerIssueDetails,
  };
}

function serializeImageChart(asset) {
  const { filepath, filename, image } = asset;
  return {
    ...serializeDefaultChart(asset),
    file: `${filepath}${filename}`,
    image: ImageSerializer(image),
  };
}

/**
 * Parses static CAPI CSV chart
 * @param {string} csv
 * @returns {array<array[string]>} chart
 */
function parseCSV(csv) {
  const escapeQuoteString = '%2C';
  // find all coma characters inside quotes and replace them.
  const csvEscaped = csv.replace(/"([^"]+)(,)([^"]+)"/ig, `$1${escapeQuoteString}$3`).trim();
  // split the result by new lines, then split each row by ',' and restore ',' in each row
  const finalResult = csvEscaped.split(/\r\n/).map(row => {
      const rowSplitted = row.split(',');
      const result = rowSplitted.map(escapedRow => (escapedRow.split(escapeQuoteString).join(',')));
      return result;
  });
  return finalResult;
}

function serializeCSVChart(asset) {
  const { chartData, chartRowHeader: rowHeader, chartColumnHeader: columnHeader } = asset;
  const rows = parseCSV(chartData);

  return {
    ...serializeDefaultChart(asset),
    rows,
    rowHeader: rowHeader === 'Yes',
    columnHeader: columnHeader === 'Yes',
  };
}

export default function serialize(asset = {}) {
  switch (asset.chartType) {
    case 'csv':
      return serializeCSVChart(asset);
    case 'image':
      return serializeImageChart(asset);
    case 'stock':
      return serializeStockChart(asset);
    default:
      return serializeDefaultChart(asset);
  }
}
