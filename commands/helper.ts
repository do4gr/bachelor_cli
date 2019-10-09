import { execSync } from "child_process";
import Neo4j from "../apis/candidateApis/Neo4j";
import Prisma from "../apis/candidateApis/Prisma";
import * as envVars from "../env";
import * as env from "../env";

export function scpPushFolder(
  user: string,
  host: string,
  source: string,
  target: string,
) {
  run(`scp -r -i ${env.identity} ${source}  ${user}@${host}:${target}`);
}

export function scpPullFolder(
  user: string,
  host: string,
  source: string,
  target: string,
) {
  run(`scp -r -i ${env.identity} ${user}@${host}:${source} ${target} `);
}

export function run(command: string) {
  console.log(command);
  return execSync(command, { stdio: "inherit" });
}

export function runOnMachine(machine: string, command: string) {
  run(`ssh ${env.user}@${machine} -i ${env.identity} \
   '${command}'`);
}

export function cloneClientRepo(machine: string) {
  runOnMachine(machine, `rm -rf ${env.remote}`);
  runOnMachine(machine, `git clone ${env.client_repo}`);
}

export function pullResults(host: string) {
  const date = new Date().toISOString();
  scpPullFolder(
    env.user,
    host,
    env.remoteResults,
    env.local + "/" + date + "/",
  );
}

export function delay(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export function candidateApi(candidate: string) {
  if (candidate == "prisma") {
    return new Prisma(envVars.prisma, envVars.postgres);
  } else {
    return new Neo4j(envVars.neo4j);
  }
}
