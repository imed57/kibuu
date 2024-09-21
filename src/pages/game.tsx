import { useState } from 'react';
import AlertDialog from '../components/game-dialog';
import { NextPage } from 'next';
import Image from "next/image";


const Game: NextPage = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <Image
                src="/abdou_deg.jpg"
                width={300}
                height={300}
                alt="Picture of the author"
            />
            <Image
                src="/abdou_deg.jpg"
                width={300}
                height={300}
                alt="Picture of the author"
            />
            <Image
                src="/abdou_deg.jpg"
                width={300}
                height={300}
                alt="Picture of the author"
            />
        </div>
    );
};

export default Game;
