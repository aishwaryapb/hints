import {gql} from '@apollo/client';

export const GET_GAME = gql`
    query getGame($gameId: String!) {
        getGame(gameId: $gameId) {
            id
            player1 {
                name
                score
            }
            player2 {
                name
                score
            }
            currentPlayer
        }
    }
`;

export const CURRENT_PLAYER = gql`
  subscription getCurrentPlayer($gameId: String!) {
    getCurrentPlayer(gameId: $gameId) {
        id
        player1 {
            name
            score
        }
        player2 {
            name
            score
        }
        currentPlayer
    }
  }
`;

export const END_GAME = gql`
    mutation endGame($gameId: String!) {
        endGame(gameId: $gameId) 
    }
`;

export const GAME_OVER = gql`
  subscription endGame($gameId: String!) {
    endGame(gameId: $gameId) {
        result
    }
  }
`;

export const CREATE_GAME = gql`
    mutation createGame($name: String!) {
        createGame(name: $name) {
            id
            player1 {
                name
                score
            }
            player2 {
                name
                score
            }
            currentPlayer
        }
    }
`;

export const UPDATE_GAME = gql`
    mutation updateGame($name: String!, $gameId: String!) {
        updateGame(name: $name, gameId: $gameId) {
            id
            player1 {
                name
                score
            }
            player2 {
                name
                score
            }
            currentPlayer
        }
    }
`;

export const UPDATE_SCORE = gql`
    mutation updateScore($correctGuess: Boolean!, $gameId: String!) {
        updateScore(correctGuess: $correctGuess, gameId: $gameId) {
            id
            player1 {
                name
                score
            }
            player2 {
                name
                score
            }
            currentPlayer
        }
    }   
`;