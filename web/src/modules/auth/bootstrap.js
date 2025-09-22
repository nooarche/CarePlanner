// [[HANDLE: SUPERUSER_BOOTSTRAP]]
export function initBootstrapUI(root) { root.innerHTML = '<button>Create Service</button>'; }
export function initUnlockFlow(root, cb) { root.innerHTML += '<button>Unlock Service</button>'; }
