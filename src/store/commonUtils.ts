export const gridSpacing = 3;
export const fontSize = {
    lg: 30,
    md: 24,
    sm: 16,
    xs: 9
};
export { colors } from "./colors";
export { images } from "./images";
export { nftAbi, gameAbi } from "../assets/json/abi";

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
    return newData?.result;
}

export const REACT_APP_NFT_CONTRACT = "0x7cE7316C75F7F70571F7b8b8BEf7B77873C3D94a";
export const REACT_APP_GAME_CONTRACT = "0xf2bB723A48D9FBf2674d2A02bd034B116e797416";