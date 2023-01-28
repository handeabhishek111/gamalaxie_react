import React from 'react'

import MainLayout from '../layout/MainLayout';
import DuelStart from '../pages/duelStart';

//Pages
import Landing from '../pages/landing';
import Result from '../pages/result';
import SlidingBlockPuzzle from '../pages/slidingBlockPuzzle';


const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Landing />
        },
        {
            path: '2048-game',
            element: <SlidingBlockPuzzle />
        },
        {
            path: 'tetris-game',
            element: <SlidingBlockPuzzle />
        },
        {
            path: 'duel-start',
            element: <DuelStart />
        },
        {
            path: 'result',
            element: <Result />
        },
    ]
};

export default MainRoutes;