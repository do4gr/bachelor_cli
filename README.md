# bachelor_cli

This is a CLI that can be used to manage a GraphQL API benchmarking client. The client can be found here https://github.com/do4gr/bachelor_client .

The user needs to configure the CLI in `env.ts`. The IP's of the machines to be used for the benchmarking runs as well as an identity file to authenticate for ssh need to be specified. 

Two mappers are implemented for the benchmarking client: Prisma using Postgres and Neo4j. The user can configure which one to use in `env.ts`.

```
Commands:
  generator|g      Setup Workload generator Machine
  testcandidate|t  Setup Test Candidate Machines
  start|st         Start Test Candidate
  deploy|d         Generates the API from the provided GraphQL SDL
  playground|pl    Open Playground For Candidate
  monitor|m        Open cAdvisor Monitors
  load|l           Run the load phase as specified
  run|r            Run the transaction phase as specified
  pull|p           Pull Results of Test Run
  wipe|w           Wipes data on test candidate
  update|u         Update Workload Parameters on Client Machine
  shutdown|s       Shut down test candidate
```

Run `$ yarn` to download dependencies, then use`$ ts-node benchmark.ts` as entry point. 

The `\workloads` folder contains files that can be modified to change the workload parameters the client uses. The cardinalities in `workload_social` and `load.sh` for the data to be created need to be the same!

