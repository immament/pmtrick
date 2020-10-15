import React, { useState } from 'react';

export function ParentWithState<T>({
    children,
    initState,
}: {
    children: (state: T, setState: React.Dispatch<React.SetStateAction<T>>) => JSX.Element;
    initState: T;
}): JSX.Element {
    const [state, setState] = useState<T>(initState);
    return <div>{children(state, setState)}</div>;
}
