import chalk from "chalk";
import * as helper from "../../commands/helper";
import * as env from "../../env";
import "../../polyfills";
import ICandidateApi from "./ICandidateApi";

export default class Prisma implements ICandidateApi {
  public name = "prisma";
  public dbname = "postgres";
  public port = 4466;
  public path = `/`;
  private hostIp: string;
  private dbIp: string;

  constructor(public host: string, db: string) {
    this.hostIp = host;
    this.dbIp = db;
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
    helper.runOnMachine(
      this.hostIp,
      `cd bachelor_client/${this.name}/setup/api/; sudo docker-compose up -d`,
    );

    helper.cloneClientRepo(env.postgres);
    helper.runOnMachine(
      this.dbIp,
      `cd bachelor_client/; sh ./shared/setup_all_machines.sh;`,
    );
    helper.runOnMachine(
      this.dbIp,
      `cd bachelor_client/${this.name}/setup/${this.dbname}/; sudo docker-compose up -d`,
    );
  }

  public start() {
    console.log(chalk.yellow("[GQL-BENCH => Starting Up SUT Components ]"));
    console.log(chalk.yellow("[GQL-BENCH => Starting Up Postgres ]"));

    helper.runOnMachine(
      this.dbIp,
      `cd bachelor_client/${this.name}/setup/${this.dbname}/; sudo docker-compose up -d`,
    );

    helper.delay(10);

    console.log(chalk.yellow("[GQL-BENCH => Starting Up Prisma ]"));
    helper.runOnMachine(
      this.hostIp,
      `cd bachelor_client/${this.name}/setup/api/; sudo docker-compose up -d`,
    );
  }

  public playground() {
    console.log(chalk.yellow("[GQL-BENCH => Opening GraphQL Playground ]"));
    helper.run(`open -a safari http://${this.hostIp}:4466`);
  }

  public monitor() {
    console.log(chalk.yellow("[GQL-BENCH => Opening Monitoring View ]"));
    helper.run(`open -a safari http://${this.hostIp}:8080`);
    helper.run(`open -a safari http://${this.dbIp}:8080`);
    helper.run(`open -a safari http://${env.client}:8080`);
  }

  public deploy() {
    console.log(chalk.yellow("[GQL-BENCH => Deploying Datamodel ]"));

    helper.runOnMachine(
      this.hostIp,
      `cd bachelor_client/${this.name}/setup/; prisma deploy`,
    );
  }

  public wipeData() {
    console.log(chalk.yellow("[GQL-BENCH => Resetting API Data ]"));

    helper.runOnMachine(
      this.hostIp,
      `cd bachelor_client/${this.name}/setup/; prisma reset -f`,
    );
  }

  public validateLoad() {}

  public shutdown() {
    console.log(chalk.yellow("[GQL-BENCH => Shutting Down Prisma ]"));
    helper.runOnMachine(this.hostIp, `sudo docker stop api_prisma_1`);
    helper.runOnMachine(this.dbIp, `sudo docker stop postgres_postgres_1`);
  }
}
