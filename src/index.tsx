import React from 'react';
import ReactDOM from 'react-dom';

import ApolloProvider from './ApolloProvider';
import './styles.scss';

const ROOT = document.querySelector('#root');

ReactDOM.render(<ApolloProvider />, ROOT);