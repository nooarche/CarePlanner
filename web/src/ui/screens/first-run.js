// [[HANDLE: ROUTE_FIRST_RUN]]
import { initBootstrapUI, initUnlockFlow } from "../../modules/auth/bootstrap.js";
export function mountFirstRun(root) {
  root.innerHTML = `<section id="bootstrap"></section><section id="unlock"></section>`;
  initBootstrapUI(root.querySelector("#bootstrap"));
  initUnlockFlow(root.querySelector("#unlock"), (svc)=>alert('Unlocked '+svc.serviceName));
}
