import React, { FC, useEffect, useRef, useState } from 'react';
import useArrowKeyPress from '../../hooks/useArrowKeyPress';
import type { Tile } from '../../hooks/useGameBoard';
import type { GameStatus } from '../../hooks/useGameState';
import useSwipe from '../../hooks/useSwipe';
import { calcLocation, calcTileSize } from '../../utils/common';
import { Vector } from '../../utils/types';
import Box from '../Box';
import Grid from '../Grid';
import TileComponent from '../Tile';
import { useScreenshot } from 'use-react-screenshot'
import { Box as Box1, Button, Typography } from '@mui/material';
import { colors } from '../../../../store/colors';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { callRpc, nftAbi } from '../../../../store/commonUtils';
import { fetchSigner } from '@wagmi/core'
import { ethers, Wallet, providers } from 'ethers';
export interface GameBoardProps {
  tiles?: Tile[];
  gameStatus: GameStatus;
  rows: number;
  cols: number;
  boardSize: number;
  spacing: number;
  onMove: (dir: Vector) => void;
  onMovePending: () => void;
  onMergePending: () => void;
  onCloseNotification: (currentStatus: GameStatus) => void;
  total: number;
}

interface progressData {
  total: bigint;
  uploaded: bigint;
}

const GameBoard: FC<GameBoardProps> = ({
  tiles,
  gameStatus,
  rows,
  cols,
  boardSize,
  spacing,
  onMove,
  onMovePending,
  onMergePending,
  onCloseNotification,
  total
}) => {

  const { address, isConnected } = useAccount();
  const [{ width: tileWidth, height: tileHeight }, setTileSize] = useState(() =>
    calcTileSize(boardSize, rows, cols, spacing),
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const [image, takeScreenshot] = useScreenshot();

  useArrowKeyPress(onMove);
  useSwipe(boardRef, onMove);

  useEffect(() => {
    setTileSize(calcTileSize(boardSize, rows, cols, spacing));
  }, [boardSize, cols, rows, spacing]);


  //! main code
  // useEffect(() => {
  //   (gameStatus === 'win' || gameStatus === 'lost') && takeSnapShot();
  // }, [gameStatus]);

  // const takeSnapShot = () => {
  //   console.log("status----", gameStatus)
  //   if (gameStatus === 'win' || gameStatus === 'lost') {
  //     takeScreenshot(boardRef.current);
  //   }
  // }

  // useEffect(() => {
  //   (gameStatus === 'win' || gameStatus === 'lost') && image && postGameData();
  // }, [image])
  //!
  //? pagal code
  const takeSnapShot = () => {
    console.log("status----", gameStatus)
    takeScreenshot(boardRef.current);

  }

  useEffect(() => {
    postGameData();
  }, [image])
  //?

  const postGameData = () => {
    const apiKey =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJmODkxMmM5NmEwNzRDZkE5OTFDMmVBREQ4Q0VkOTk2RTdDMDdjYjIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MjI4MzA5MDA3NCwibmFtZSI6Ik5GVCBHYW1lIENhcmQifQ.YJiXkpS--mDOZfJg9MjmBD-n5ZnwwSD6ifY8M6L97Js";

    const options = (form: any) => {
      return {
        method: "POST",
        body: form,
        headers: {
          Authorization: apiKey,
        },
      }
    };
    if (isConnected) {
      Promise.all(image)
        .then(async (res) => {
          console.log('image ====', image);
          const blob = await fetch(image).then((res) => res.blob());
          const imageFile = new File([blob], "game2048.jpg", { type: 'image/jpeg' });
          const form = new FormData();
          form.append("file", imageFile);

          fetch("https://api.nft.storage/upload", options(form))
            .then((response) => {
              return response.json();
            })
            .then((responseJson) => {
              console.log("responseJson-----", `https://${responseJson?.value?.cid}.ipfs.nftstorage.link/game2048.jpg`);
              if (responseJson.ok) {
                const metadata = {
                  name: "Game Card",
                  description: "A game of 2048",
                  image: `https://${responseJson?.value?.cid}.ipfs.nftstorage.link/game2048.jpg`,
                  attributes: [
                    {
                      display_type: "date",
                      trait_type: "created",
                      value: new Date().getTime(),
                    },
                    {
                      display_type: "number",
                      trait_type: "Score",
                      value: total,
                    },
                  ],
                };
                // NFTStorage = (await import("")).default
                const str = JSON.stringify(metadata);
                const bytes = new TextEncoder().encode(str);
                const blob = new Blob([bytes], {
                  type: "application/json;charset=utf-8",
                });
                var metadataFile = new File([blob], "metadata.json", {
                  type: "application/json"
                });
                console.log(metadataFile);
                const form = new FormData();
                form.append("file", metadataFile);
                fetch('https://api.nft.storage/upload', options(form))
                  .then((response) => {
                    return response.json();
                  })
                  .then(async (responseJson) => {
                    if (responseJson.ok) {
                      const priorityFee = await callRpc(
                        'eth_maxPriorityFeePerGas'
                      );
                      const gasPrice = await callRpc('eth_gasPrice');
                      let link = `https://${responseJson?.value?.cid}.ipfs.nftstorage.link/metadata.json`;
                      console.log(
                        'responseJson-----',
                        `https://${responseJson?.value?.cid}.ipfs.nftstorage.link/metadata.json`,
                        '\n gasPrice---',
                        gasPrice,
                        '\n priorityFee---',
                        priorityFee,
                      );
                      const signer: any = await fetchSigner();
                      const nftcontract = new ethers.Contract(
                        process.env.REACT_APP_NFT_CONTRACT || '',
                        nftAbi,
                        signer
                      );
                      await nftcontract
                        .safeMint(address, link, {
                          gasPrice: gasPrice,
                          gasLimit: 1000000000,
                        })
                        .then(async (tx: any) => {
                          const receipt = await tx.wait();
                          console.log(
                            'final tx---',
                            tx,
                            '\n receipt---',
                            receipt
                          );
                        });
                    }
                  });
              }
            })
        })
    }
  }

  return (
    <Box1 flex={1} flexDirection='column' >
      <Button onClick={() => takeSnapShot()} >Result</Button>
      <Box position="relative" ref={boardRef}>
        <Grid
          width={boardSize}
          height={boardSize}
          rows={rows}
          cols={cols}
          spacing={spacing}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          background="transparent"
          blockSize="100%"
          inlineSize="100%"
          onTransitionEnd={onMovePending}
          onAnimationEnd={onMergePending}
        >
          {tiles?.map(({ r, c, id, value, isMerging, isNew }) => (
            <TileComponent
              key={id}
              width={tileWidth}
              height={tileHeight}
              x={calcLocation(tileWidth, c, spacing)}
              y={calcLocation(tileHeight, r, spacing)}
              value={value}
              isNew={isNew}
              isMerging={isMerging}
            />
          ))}
        </Box>
      </Box>
      {/* {(gameStatus === 'win' || gameStatus === 'lost') && (
        <Notification
          win={gameStatus === 'win'}
          onClose={() => onCloseNotification(gameStatus)}
        />
      )} */}
      {(gameStatus === 'win' || gameStatus === 'lost') && <Box1 borderRadius={2} bgcolor={colors.moderateRed} marginY={1} padding={1} >
        <Typography textAlign={"center"} marginY={1}>
          Click on New Game to Retry
        </Typography>
      </Box1>}
    </Box1>
  );
};

export default React.memo(GameBoard);
