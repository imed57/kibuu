import { CustomConnect } from "components/ConnectWallet";
import { EXAMPLE_ADDRESSES } from "config/constants/addresses";
import { ChainId } from "config/constants/chainId";
import { useDynamicExampleContract, useStaticExampleContract } from "hooks/useContract";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Example = () => {
    return (
        <div>
            <div>
                <CustomConnect></CustomConnect>

            </div>
        </div>
    );
};

export default Example;
