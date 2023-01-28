import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const MetamaskButton = () => {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address });
    //! Need to create a function to recall the event on reload
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });


    const { ethereum } = window;
    const onSubmit = () => {
        console.log("called----", isConnected)
        isConnected ? switchAccount() : connect();
    }

    const switchAccount = async () => {
        //user onConnect again to change the address
        console.log("This is calling")
        const permissions = ethereum && await ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{
                eth_accounts: {},
            }]
        });
        console.log("Permission----", permissions)
    }

    return (
        <Button onClick={() => onSubmit()} variant="contained" color={isConnected ? 'error' : 'success'}>
            {isConnected ? "Switch Account" : "Metamask Login"}
        </Button>
    )
}

export default MetamaskButton;