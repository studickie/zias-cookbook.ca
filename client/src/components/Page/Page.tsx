import React from 'react';
import Header from '../Header/Header';

interface Props {
    children: React.ReactNode;
}

function Page ({ children }: Props): JSX.Element {
    return (
        <div>
            <Header></Header>
            <main>
                { children }
            </main>
        </div>
    );
}

export default Page;