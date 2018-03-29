console.log("Generating Release Tickets");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getTicketsFromStdOut = require('./lib/getTicketsFromStdOut');
const formatReleaseTicket = require('./lib/formatReleaseTicket');
const constants = require('./constants');

const jira = require('./lib/jira');

const gitCommand = 'git log --graph --oneline --first-parent  master..develop';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    const { stdout, stderr } = await exec(gitCommand);
  
    if (stderr) {
      throw new Error('There was an error ...');
    }
  
  
    const ticketsToLink = getTicketsFromStdOut(stdout);
  
    if(ticketsToLink.length === 0) {
      console.log("There are no differences between master and develop are you actually relesing anything?");
      throw new Error("No changes");
    }
    let description, team, releaseDate;
    rl.question('What is your team name?\n', answer => {
      team = answer;
      rl.question('What date are you releasing? \n', answer => {
        releaseDate = answer;
        rl.question('Enter a description of the release ticket. EG: Which services you are deploying.\n', (answer) => {
          description = answer;
          console.log(`Thanks, you entered: ${description}`);
          rl.question(`The tickets going into this release are ${ticketsToLink.join(',')} \nCorrect (yes/no)?\n`, async (answer) => {
            rl.close();
            if (answer.match(/^y(es)?$/i)) {
              console.log('Great, I will now make the release ticket');
  
              const ticketDescription = formatReleaseTicket(team, releaseDate, description, ticketsToLink);
  
              const ticket = await jira.createTicket(team, releaseDate, constants.JIRA_RELEASE_PROJECT, ticketDescription);
              console.log(`Your release ticket was sucessfully created @ ${ticket.linkToTicket}`);
            }
            else {
              console.log('No worries, come back later if you change your mind');
            }
            
          });
        });
      });
      
    });
    
  
    rl.on('SIGINT', () => {
      rl.question('Are you sure you want to exit? ', (answer) => {
        if (answer.match(/^y(es)?$/i)) rl.pause();
      });
    });

  }
  catch(err) {
    console.log(`An Error Occured: ${err.message}`);
  }
  
   

})();
