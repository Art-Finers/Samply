import React, { useEffect, useState } from "react";
import {
  ClientFactory,
  INodeStatus,
  IAccount,
  DefaultProviderUrls,
  IDatastoreEntryInput,
  IContractStorageData,
} from "@massalabs/massa-web3";
import Args from "@massalabs/massa-web3/dist/utils/arguments";

const baseAccount = {
  publicKey: "P12VATv5VJYpUMMyYJiWCAUwKkpfTavPbC4zvbvtpyydXiezCifB",
  secretKey: "S17pF39Sm5oHHwVokYBmutEevZoGWBaXALuKHBtxuNYbDdTZQH4",
  address: "A1ayUH8uQqTYb1tdwhvtj7J159vTiFLaKvbNMGnWLXXidn3wsPH",
} as IAccount;

type TNodeStatus = INodeStatus | null;

const sc_addr = "A1NhK6TKscteBNbBPZrSBup733PTH4yM3SjvjQjXKgaQCBJ8qTp"

function NodeInfo() {
  const [nodeStatus, setNodeStatus] = useState<TNodeStatus>(null);

  const getNodeStatusAsync = async () => {
    try {
      let web3Client = await ClientFactory.createDefaultClient(
        DefaultProviderUrls.TESTNET,
        false,
        baseAccount
      );
      const nodeStatus: INodeStatus = await web3Client
        .publicApi()
        .getNodeStatus();
      setNodeStatus(nodeStatus);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNodeStatusAsync();
  }, []);

  const getNodeOverview = (nodeStatus?: TNodeStatus): JSX.Element => {
    if (!nodeStatus) {
      return <p>"Getting Massa's Node Status..."</p>;
    }
    return (
      <ul>
        <li>Massa Net Version: {nodeStatus?.version}</li>
        <li>Massa Net Node Id: {nodeStatus?.node_id}</li>
        <li>Massa Net Node Ip: {nodeStatus?.node_ip}</li>
        <li>Massa Net Time: {nodeStatus?.current_time}</li>
        <li>Massa Net Cycle: {nodeStatus?.current_cycle}</li>
      </ul>
    );
  };

  return getNodeOverview(nodeStatus);
}


export default class SampleLoader extends React.Component {
  state = {
    name: 'Samply',
  };

  // constructor(props) {
  //   super(props);
  // }

  changeState = () => {
    this.setState({
      name: 'Sana',
    });
  };

  upload = () => {
    let args = new Args();
  
    ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      false,
      baseAccount
    ).then(function (web3Client) {
      web3Client.smartContracts().callSmartContract(
        {
          /// storage fee for taking place in books
          fee: 0,
          /// The maximum amount of gas that the execution of the contract is allowed to cost.
          maxGas: 70000000,
          /// The price per unit of gas that the caller is willing to pay for the execution.
          gasPrice: 0,
          /// Extra coins that are spent from the caller's balance and transferred to the target
          coins: 0,
          /// Target smart contract address
          targetAddress: sc_addr,
          /// Target function name. No function is called if empty.
          functionName: "createSample",
          /// Parameter to pass to the target function
          parameter: args.serialize(),
        },
        baseAccount
      ).then(function (txid) {
        console.log("upload sample ", txid);
      });
    });
  }

  download = () => {

    ClientFactory.createDefaultClient(
      DefaultProviderUrls.TESTNET,
      false,
      baseAccount
    ).then(function (web3Client) {
      web3Client.publicApi().getDatastoreEntries(
        [{ address: sc_addr, key: "Hello" } as IDatastoreEntryInput],
      ).then(function (res: IContractStorageData[]) {
        console.log("download sample ", "", res);
      });
    });

  }

  render() {
    const state = this.state;
    return (
      <div id="content">
        <button onClick={this.upload}>Upload</button>
        <button onClick={this.download}>Download</button>
      </div>
    );
  }
}
