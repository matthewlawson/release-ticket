const constants = require('../constants');
const request = require('request-promise-native');

const { JIRA_USERNAME, JIRA_PASSWORD } = process.env;
const authDetails = Buffer.from(`${JIRA_USERNAME}:${JIRA_PASSWORD}`).toString(
  'base64',
);

const createTicket = async (
  team,
  releaseDate,
  projectKey,
  description
) => {
  const body = {
    fields: {
      project: {
        key: projectKey,
      },
      summary: `${team} Release ticket ${releaseDate}`,
      issuetype: {
        id: constants.JIRA_BUG_ID,
      },
      labels: [
        'release'
      ],
      description
    },
  };

  try {
    const issue = await request({
      url: `${constants.JIRA_URL}/rest/api/2/issue`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${authDetails}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    }).on('response', response => {
      if (response.statusCode !== 201) {
        throw Error('Could not create Jira ticket', response);
      }
    });

    const { key, self } = JSON.parse(issue);

    return {
      ticketNumber: key,
      linkToTicket: `${constants.JIRA_URL}/browse/${key}`,
    };
  } catch (err) {
    throw Error(err);
  }
};



module.exports = {
  createTicket,
};
