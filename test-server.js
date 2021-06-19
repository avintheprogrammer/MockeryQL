const fs = require('fs');
const ls = require('list-directory-contents');
const request = require('request-promise');

const SRC_DIR = `./${process.env.APP_DIR || 'src'}`;
const globalAppConfig = require(`${SRC_DIR}/app/PhoenixQlConfig.js`).default;

const {
  GRAPHQL_SERVER_URI = 'http://localhost:4000/graphql',
  PHOENIX_HOME = '../WEB.Phoenix' } = globalAppConfig.getProperties();

const BACKTICK = '`';

const traversePath = (phoenixHome, processFiles) => {
  ls(`${phoenixHome}/src`, (err, tree) => {
    if (err) throw err;

    const isQueryFile = item => item && item.indexOf('query.js') > 0;
    const queryFiles = tree.filter(isQueryFile);
    console.log('=============================');
    console.log(queryFiles);
    console.log('=============================');

    const sourceFiles = queryFiles.map(fullPath => (
      fullPath.substr(PHOENIX_HOME.length + 1)
    ));

    if (typeof processFiles === 'function') {
      processFiles(sourceFiles);
    }
  });
};

const extractGraphQL = (phoenixHome, file) => {
  const path = `${phoenixHome}/${file}`;
  const content = fs.readFileSync(path).toString();
  const start = content.indexOf(BACKTICK) + 1;
  const end = content.indexOf(BACKTICK, start);
  const graphQL = (start > 0 && end > 0) ? content.substring(start, end) : '';
  return graphQL;
};

const displayError = (file, variableName, graphQL, query, err) => {
  console.error('======================================================');
  console.error(`\n###### ERROR: ${file}, ${variableName} #####\n`);

  const hasMultipleErrors = err &&
                            err.message &&
                            err.message.indexOf('errors') > 0;
  if (hasMultipleErrors) {
    const statusStr = err.message.substr('400 -'.length + 1);
    const status = JSON.parse(statusStr);
    status.errors.forEach((element) => {
      console.error(element);
    });
  } else {
    console.error(err);
  }
  console.log('\n\n', graphQL.variables, '\n', query);
  console.error('======================================================');
};

const makeGraphQLRequest = ({ file, graphQL, variableName, query }) => {
  const options = {
    method: 'POST',
    uri: GRAPHQL_SERVER_URI,
    body: graphQL,
    json: true,
    headers: {
      /* 'content-type': 'application/x-www-form-urlencoded' /* */
    },
  };

  return request(options)
    .catch((err) => {
      displayError(file, variableName, graphQL, query, err);
    });
};

const getVariables = (variableName) => {
  // TODO: maybe we can hardcode the same variables for all queries?
  // That could simplify this a lot!
  let variables = {};

  switch (variableName) {
    case '$id':
      // TODO: run multiple passes with different id's
      variables = { id: 104314759 };
      break;
    case '$path':
      variables = { path: '/2017/11/16/us-stock-futures-earnings-data-tax-on-the-agenda.html' };
      break;
    case '$articleID':
      variables = { articleID: 104847372 };
      break;
    case '$brand':
      variables = { brand: 'cnbc', product: 'web' };
      break;
    case '$source':
      variables = { id: 104314759, source: 'parsely', tag: 'Articles', section: 'Economy' };
      break;
    case '$clip':
      variables = { clip: 'John Wells' };
      break;
    case '$term':
      variables = { term: 'Hathaway' };
      break;

    default:
  }
  return variables;
};

const variablePattern = /(\$\w+)/g;

const runGraphQL = (file) => {
  let variables = {};
  let variableName;

  const query = extractGraphQL(PHOENIX_HOME, file);
  if (query) {
    const matches = query.match(variablePattern);
    const needsVariable = matches && matches.length;

    if (needsVariable) {
      [variableName] = matches;
      variables = getVariables(variableName);
    }
    const graphQL = {
      query,
      variables,
    };
    return makeGraphQLRequest({ file, graphQL, variableName, query });
  }
  // Something really wrong here!
  console.log(`############## Alert! Alert! No gql in ${file}? ############`);
  return Promise.resolve({});
};

// TODO: find IDs with useful with data:
// a live query with keynotes
// a live query for mostPopular
// a live query for wildcard

// Image / logo?
// Fail on 6, src/containers/Article/query.js
// Fail on 17, src/components/Article/ArticleHeader/query.js
// Fail on 18, src/components/Article/Banner/query.js
// Fail on 25, src/components/Video/ChapterList/query.js

const processFiles = async (queryFiles) => {
  const graphQLRequests = queryFiles.map(runGraphQL);
  return Promise.all(graphQLRequests);
};

const run = () => {
  try {
    traversePath(PHOENIX_HOME, processFiles);
    console.log('done!!!');
  } catch (e) {
    console.log('Final error: ', e.message);
  }
};

run();
