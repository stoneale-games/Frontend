// src/lib/urqlClient.ts
import {Client, cacheExchange, fetchExchange, subscriptionExchange} from 'urql';

import { createClient as createWSClient } from 'graphql-ws';
import {getCookie} from "@/lib/cookieHelper.ts";

// Create a WebSocket client for subscriptions
const wsClient = createWSClient({
    url: 'https://api.stoneale.com/query', // must match server
    connectionParams: () => {
        const token = getCookie("token") || '';
        return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
    },
});


export const urqlClient = new Client({
    url: 'https://api.stoneale.com/query',
    exchanges: [
        cacheExchange,
        fetchExchange,
        subscriptionExchange({
            forwardSubscription(request) {
                const input = { ...request, query: request.query || '' };
                return {
                    subscribe(sink) {
                        const unsubscribe = wsClient.subscribe(input, sink);
                        return { unsubscribe };
                    },
                };
            },
        }),
    ],
    fetchOptions: () => {
        const token = getCookie("token") || '';
        return {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
        };
    },
});
