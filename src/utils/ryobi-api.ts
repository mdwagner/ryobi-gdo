import type {
  AuthenticateResponse,
  RyobiRequest,
  RyobiResponse,
  LoginResponse,
  DeviceIdResponse,
} from "./ryobi-api.types";
import Storage from "./storage";

export class RyobiApi {
  ryobiLoginUrl = "https://tti.tiwiconnect.com/api/login";
  ryobiDevicesUrl = "https://tti.tiwiconnect.com/api/devices";
  ryobiWSUrl = "wss://tti.tiwiconnect.com/api/wsrpc";

  constructor() {
    const store = Storage.getStoreLazy();

    store?.remove("username");
    store?.remove("password");
  }

  // not gonna work on the web
  async login(username: string, password: string): Promise<LoginResponse> {
    const store = Storage.getStore();

    await store.set("username", username);
    await store.set("password", password);

    return fetch(this.ryobiLoginUrl, {
      mode: "cors",
      method: "POST",
      headers: {
        "x-tc-transform": "tti-app",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((response) => response.json());
  }

  // not gonna work on the web
  async state(deviceId: string): Promise<DeviceIdResponse> {
    const store = Storage.getStore();

    const username: string = await store.get("username");
    const password: string = await store.get("password");

    const query = new URLSearchParams([
      ["username", username],
      ["password", password],
    ]);

    return fetch(`${this.ryobiDevicesUrl}/${deviceId}?${query}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }

  async main() {
    // login to ryobi
    const { result } = await this.login(
      process.env.REACT_APP_RYOBI_USERNAME!,
      process.env.REACT_APP_RYOBI_PASSWORD!
    );

    // say hello to user
    console.log(`Hello ${result.metaData.userName}!`);

    // start ws connection with ryobi
    const ws = new WebSocket(this.ryobiWSUrl);

    // login to ws connection
    ws.addEventListener("open", () => {
      const req: RyobiRequest = {
        jsonrpc: "2.0",
        method: "srvWebSocketAuth",
        params: {
          varName: result.varName,
          apiKey: result.auth.apiKey,
        },
      };
      ws.send(JSON.stringify(req));
    });

    // listen for incoming messages
    ws.addEventListener("message", (event) => {
      const response = JSON.parse(event.data) as RyobiResponse;

      switch (response.method) {
        case "authorizedWebSocket": {
          const data = response as AuthenticateResponse;
          if (data.params.authorized) {
            console.log("logged in!");
          } else {
            console.log("failed to login...");
            console.debug(data);
          }
          break;
        }
        default: {
          console.log(response);
          break;
        }
      }
    });

    // listen for errors
    ws.addEventListener("error", (event) => {
      console.log(event);
    });

    return ws;
  }
}
