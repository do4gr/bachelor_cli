import chalk from "chalk";
import * as commander from "commander";
import ICandidateApi from "./apis/candidateApis/ICandidateApi";
import * as commands from "./commands/commands";
import * as helper from "./commands/helper";
import * as env from "./env";
import "./polyfills";

commander.version("0.0.0").description("Benchmarking CLI Prototype");

const candidate: ICandidateApi = helper.candidateApi(env.candidate);

commander
  .command("generator")
  .alias("g")
  .description("Setup Workload generator Machine")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Setting up Workload Generator ***=========="),
    );
    commands.setupClient();
  });

commander
  .command("testcandidate")
  .alias("t")
  .description("Setup Test Candidate Machines")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Setting up Testing Candidate ***=========="),
    );
    candidate.setUp();
  });

commander
  .command("start")
  .alias("st")
  .description("Start Test Candidate")
  .action(() => {
    console.log(chalk.yellow("=========*** Starting Candidate ***=========="));
    candidate.start();
  });

commander
  .command("deploy")
  .alias("d")
  .description("Generates the API from the provided GraphQL SDL")
  .action(() => {
    console.log(chalk.yellow("=========*** Generating API ***=========="));
    candidate.deploy();
  });

commander
  .command("playground")
  .alias("pl")
  .description("Open Playground For Candidate")
  .action(() => {
    console.log(chalk.yellow("=========*** Starting Candidate ***=========="));
    candidate.playground();
  });

commander
  .command("monitor")
  .alias("m")
  .description("Open cAdvisor Monitors")
  .action(() => {
    console.log(chalk.yellow("=========*** Open Monitors ***=========="));
    candidate.monitor();
  });

commander
  .command("load")
  .alias("l")
  .description("Run the load phase as specified")
  .action(() => {
    console.log(chalk.yellow("=========*** Running Load Phase ***=========="));
    commands.loadPhase(env.candidate);
  });

commander
  .command("run")
  .alias("r")
  .description("Run the transaction phase as specified")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Running Transaction Phase ***=========="),
    );
    commands.transactionPhase(env.candidate);
  });

commander
  .command("pull")
  .alias("p")
  .description("Pull Results of Test Run")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Pulling Test Run Results ***=========="),
    );
    commands.pullResults();
  });

commander
  .command("wipe")
  .alias("w")
  .description("Wipes data on test candidate")
  .action(() => {
    console.log(chalk.yellow("=========*** Wiping data ***=========="));
    candidate.wipeData();
  });

commander
  .command("update")
  .alias("u")
  .description("Update Workload Parameters on Client Machine")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Updating Workload Parameters ***=========="),
    );
    helper.scpPushFolder(
      "root",
      env.client,
      "./workloads",
      "~/bachelor_client/",
    );
  });

commander
  .command("shutdown")
  .alias("s")
  .description("Shut down test candidate")
  .action(() => {
    console.log(
      chalk.yellow("=========*** Shutting Down Test Candidate ***=========="),
    );
    candidate.shutdown();
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
