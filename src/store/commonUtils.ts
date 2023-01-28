export const gridSpacing = 3;
export const fontSize = {
    lg: 30,
    md: 24,
    sm: 16,
    xs: 9
};
export { colors } from "./colors";
export { images } from "./images";
export { nftAbi } from "../assets/json/abi";

export const callRpc = async (method: any, params?: any) => {
    var options: any = {
        method: "POST",
        headers: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: 1,
        }),
    };
    const res: any = await fetch("https://api.hyperspace.node.glif.io/rpc/v1", options);
    let newData = await res.json();
    console.log("res---", newData?.result);
    return newData?.result;
}