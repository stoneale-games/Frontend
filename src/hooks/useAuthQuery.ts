import { useEffect } from "react";
import {
    useQuery,
    type AnyVariables,
    type UseQueryArgs,
    type UseQueryResponse,
} from "urql";
import { useLogout } from "@/hooks/useLogout";

export function useAuthQuery<Data = unknown, Variables extends AnyVariables = object>(
    args: UseQueryArgs<Variables>
): UseQueryResponse<Data, Variables> {
    const [result, reexecuteQuery] = useQuery<Data, Variables>(args);
    const logout = useLogout(); // ✅ use the hook here

    useEffect(() => {
        if (result.error) {
            console.log(result.error);

            const authError = result.error.graphQLErrors.find((err) =>
                err.message.toLowerCase().includes("auth")
            );

            console.log(authError);

            if (authError) {
                logout(); // ✅ now clears token + redirects
            }
        }
    }, [result.error, logout]);

    return [result, reexecuteQuery];
}
