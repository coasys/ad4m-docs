---
sidebar_position: 2
---

# Request Capability

Ad4m services are protected by [Capability-based security](https://en.wikipedia.org/wiki/Capability-based_security). An application could easily request access with following workflow.

**Build an ad4m client with GraphQL server and capability token,**

```typescript
function buildAd4mClient(server: string, token: string): Ad4mClient {
	let apolloClient = new ApolloClient({
		link: new WebSocketLink({
			uri: server,
			options: {
				reconnect: true,
				connectionParams: async () => {
					return {
						headers: {
							authorization: token
						}
					}
				}
			},
			webSocketImpl: WebSocket,
		}),
		cache: new InMemoryCache({ resultCaching: false, addTypename: false }),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: "no-cache",
			},
			query: {
				fetchPolicy: "no-cache",
			}
		},
	});

	//@ts-ignore
	return new Ad4mClient(apolloClient);
}
```

The `token` is an empty string if you haven't make a capability request yet.

```typescript
let ad4mClient = buildAd4mClient("ws://localhost:12000/graphql", "");
```

:::tip Notes

You may get following errors, and it can be ignored, tracked [issue](https://github.com/perspect3vism/ad4m/issues/43).

> Capability is not matched, you have capabilities: [{"with":{"domain":"agent","pointers":[""]},"can":["AUTHENTICATE"]}], expected: {"with":{"domain":"agent","pointers":[""]},"can":["SUBSCRIBE"]}

:::

**Request your capabilities, and get back `requestId`,**

```typescript
const requestId = await ad4mClient.agent.requestCapability(
    "demo-app",
    "demo-desc",
    "demo-url",
    '[{"with":{"domain":"agent","pointers":["*"]},"can":["READ"]},{"with":{"domain":"runtime.exception","pointers":["*"]},"can":["SUBSCRIBE"]}]'
);
```

The capabilities is in the string format of `Capability` array,

```typescript
interface Capability {
  with: Resource,
  can: string[],
}

interface Resource {
  domain: string,
  pointers: string[],
}
```

Your Ad4min app should popup a prompt with capability request information, **confirm the request and get back the 6 digits secret code**, you could also cancel the request by not confirm.

:::tip Notes

You can request all the capabilities for test purpose, with `'[{"with":{"domain":"*","pointers":["*"]},"can":["*"]}]`.

:::

**Generate your JWT token with `requestId` and `secretCode`,**

```typescript
const jwt = await ad4mClient.agent.generateJwt(requestId, secretCode);
```

The generated token could be further used to build a new ad4mClient,

```typescript
ad4mClient = buildAd4mClient("ws://localhost:12000/graphql", jwt);
```

With this token, you should have access to **read agent status, and subscribe runtime exceptions**.
