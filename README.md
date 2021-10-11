# A subgraph for the Keep/tBTC network.

This was created to back [allthekeeps.com](https://allthekeeps.com). It incorporates work from️:

- [@juliankoh](https://github.com/juliankoh): His [keep subgraph](https://github.com/juliankoh/keep-subgraph)

- [@suntzu93](https://github.com/suntzu93): His [tBTC](https://github.com/suntzu93/tbtc-thegraph) and
  [keepnetwork](https://github.com/suntzu93/keepnetwork-subgraph) subgraphs.
 
- [@Tibike6](https://github.com/Tibike6): His [keep subgraph](https://github.com/Tibike6/keep-subgraph/)

❤️

The live version is ready for you to play with: TBD

You may also find my companion graph [keep-pricefeed](https://github.com/miracle2k/keep-pricefeed) of interest.

# Development

- Run ./update-yamls.js to regenerate the subgraph.yaml files for both mainnet and ropsten based on the template.

# Development Ropsten (Auto)
- Run `ETH_RPC_URL=<url> SUBGRAPH_DEPLOY_KEY=<slug> GRAPH_DEPLOY_KEY=<key> ./deploy-subgraph.sh`

  - `ETH_RPC_URL`: ex. Infura https://ropsten.infura.io/v3/<your_ID>
  - `SUBGRAPH_SLUG`: after connecting to `thegraph.com` and creating a subgraph, you will have this slug
  - `SUBGRAPH_DEPLOY_KEY`: auth subgraph's deploy key