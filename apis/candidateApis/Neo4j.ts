import chalk from "chalk";
import * as helper from "../../commands/helper";
import * as env from "../../env";
import "../../polyfills";
import ICandidateApi from "./ICandidateApi";

export default class Neo4j implements ICandidateApi {
  public name = "neo4j";
  public port = 7474;
  public path = `/graphql/`;
  private hostIp: string;

  constructor(public host: string) {
    this.hostIp = host;
  }

  public setUp() {
    console.log(
      chalk.yellow("[GQL-BENCH => Setting up Benchmarking Machines ]"),
    );

    helper.cloneClientRepo(this.hostIp);
    helper.runOnMachine(
      this.hostIp,
      `cd bachelor_client/; sh ./shared/setup_all_machines.sh; sh ./${this.name}/setup/setup.sh`,
    );
  }

  public start() {
    console.log(chalk.yellow("[GQL-BENCH => Starting Up SUT Components ]"));
    console.log(chalk.yellow("[GQL-BENCH => Starting Up Neo4j]"));

    helper.runOnMachine(this.hostIp, `sudo docker start neo4j-gqlbench`);
  }

  public playground() {
    // needs to open graphiql
    console.log(chalk.yellow("[GQL-BENCH => Opening GraphQL Playground ]"));
    console.log(
      `Playground is not supported by Neo4j. You can open GraphiQL at http://${this.hostIp}:7474/graphql/`,
    );
  }

  public monitor() {
    console.log(chalk.yellow("[GQL-BENCH => Opening Monitoring View ]"));
    helper.run(`open -a safari http://${this.hostIp}:8080`);
    helper.run(`open -a safari http://${env.client}:8080`);
  }

  public deploy() {
    console.log(chalk.yellow("[GQL-BENCH => Deploying Datamodel ]"));
    helper.runOnMachine(
      env.client,
      `cd ~/bachelor_client/neo4j/setup/;
      curl \
      --data '@datamodel.graphql'\
      -X POST ${this.hostIp}:${this.port}/graphql/idl/`,
    );
  }

  public wipeData() {
    console.log(chalk.yellow("[GQL-BENCH => Resetting API Data ]"));
    helper.run(
      `curl \
      -H "Content-Type: application/json" \
      -d '{"statements":[{"statement":"match (n) detach delete n "}]}'\
      http://${this.hostIp}:${this.port}/db/data/transaction/commit`,
    );
  }

  public shutdown() {
    console.log(chalk.yellow("[GQL-BENCH => Shutting Down Neo4j ]"));

    helper.runOnMachine(this.hostIp, `sudo docker stop neo4j-gqlbench`);
  }
}
