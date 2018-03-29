# Release Ticket Creator
This tool assumes a gitflow workflow. Run it in the directory of your repository and it will create a jira ticket with all of the tickets that will go in the next release. The commits also need to contain the jira ticket somewhere in the commit. It assumes the format `/([A-Z]{2,4}-[0-9]{1,5})/`. EG. REW-8212 or RW-1 would match the pattern.

It will get the changes between you currently live branch (master) and what is in the next release (develop).

It was made very quickly and the code is terrible, apart from the part I stole from [Josh Johnson](https://github.com/jshjohnson/Bugbot)

## Requirements 
* Node 8

## Installation
```
npm i
alias release-ticket='node ${PWD} index.js'
```

To more permenantly install the tool (before it is published to npm) replace `${PWD}` with the absolute path to the git repo and add it to your `.bashrc` or `.npmrc`.

Add the following to your .bashrc or .zshrc

```
# Your Jira details or a specific release account.
export JIRA_PASSWORD=****
export JIRA_USERNAME=****
# Optional
alias release-ticket='node /Users/matt/Git/Experiments/release-ticket-maker/index.js'
```

## Usage
Navigate to the repository you want to release and run the following command
```
release-ticket
```
You will then be guided through the release ticket process.
