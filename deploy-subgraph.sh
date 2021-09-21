#!/bin/bash

set -e

LOG_START='\n\e[1;36m' # new line + bold + color
LOG_END='\n\e[0m' # new line + reset color
DONE_START='\n\e[1;32m' # new line + bold + green
DONE_END='\n\n\e[0m'    # new line + reset

printf "${LOG_START}Fetching 'deploy-subgraph' npm packages...${LOG_END}"

yarn

printf "${LOG_START}Installing Graph CLI...${LOG_END}"
yarn global add @graphprotocol/graph-cli@0.21.1

# for CI purposes, it will get the latest deployed npm packages for the current CI jobs
if [[ $KEEP_CORE_VERSION != "" ]] && [[ $KEEP_ECDSA_VERSION != "" ]] && [[ $KEEP_TBTC_VERSION != "" ]]
then
    yarn upgrade \
      @keep-network/keep-core@$KEEP_CORE_VERSION  \
      @keep-network/keep-ecdsa@$KEEP_ECDSA_VERSION \
      @keep-network/tbtc@$KEEP_TBTC_VERSION  --exact
fi

printf "${LOG_START}Regenerating the subgraph...${LOG_END}"

ETH_RPC_URL=${ETH_RPC_URL} node ./update-ropsten-subgraph.js

printf "${LOG_START}Authenticating with thegraph.com...${LOG_END}"

graph auth --studio ${SUBGRAPH_DEPLOY_KEY}

printf "${LOG_START}Building the subgraph...${LOG_END}"

graph codegen && graph build

printf "${LOG_START}Deploying the subgraph...${LOG_END}"

# generate a random hex and use it for Version Label
SUBGRAPH_API=`openssl rand -hex 12 | graph deploy --studio ${SUBGRAPH_SLUG} subgraph.ropsten.yaml | sed -n 's/Queries (HTTP): \(.*\)/\1/p'`

printf "${LOG_START}Creating tmp file with subgraph url...${LOG_END}"

rm -f subgraph_api
touch subgraph_api

filter_url=$(grep -o 'api[^[:blank:]]*' <<< ${SUBGRAPH_API})

filter_non_printable=$(tr -dc '[[:print:]]' <<< ${filter_url})

# remove everything after the url split by '['
echo ${filter_non_printable} | cut -f1 -d"[" >> subgraph_api

printf "${DONE_START}Subgraph deployed successfully!${DONE_END}"
