import * as env from "../env";
import "../polyfills";
import * as helper from "./helper";

export function setupClient() {
  helper.cloneClientRepo(env.client);
  helper.runOnMachine(
    env.client,
    `cd bachelor_client/; sh ./shared/setup_all_machines.sh; sh ./shared/setup_workload_generator.sh`,
  );
}

export async function loadPhase(candidate: string) {
  helper.runOnMachine(
    env.client,
    `cd bachelor_client/; sh ./workloads/load.sh ${candidate}`,
  );
}

export async function transactionPhase(candidate: string) {
  helper.runOnMachine(
    env.client,
    `cd bachelor_client/; sh ./shared/run.sh ${candidate}`,
  );
}

export function pullResults() {
  helper.pullResults(env.client);
}
