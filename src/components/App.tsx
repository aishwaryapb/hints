import * as React from 'react';

class App extends React.Component<IProps> {
    render() {
        return <h1>{`Hello ${this.props.name || "Joker"}!`}</h1>;
    }
}

interface IProps {
    name: string;
}

export default App;