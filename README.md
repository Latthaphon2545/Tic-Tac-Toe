# Tic-Tac-Toe Game

## Demo
https://github.com/Latthaphon2545/Tic-Tac-Toe/assets/108315515/6b62962c-91e8-4ccb-9a79-15583d4cb43f


## About the Game
This game is "XO" or "tic-tac-toe" played on a 3x3 board. Players take turns placing their symbols ("X" or "O") on empty squares. The first player to place their symbol in 3 squares in a row, column, or diagonal wins.

## How to Play
### Play with a Friend
1. Enter your name (optional). If left blank, the website will generate a name for you.
2. Click on "Create Room."
3. A game window will display a room code. Copy the code and send it to your friend.
4. Your friend enters the room code in the "Search" box at the bottom right corner of the main menu.
5. Start playing the game together!

### Play with AI
1. Enter your name (optional). If left blank, the website will generate a name for you.
2. Click on "Play with AI."
3. Start playing the game against the AI!

Note: The game ends when one player scores according to the specified criteria. Players can play the game again.

## Game Features
### Gameplay History
The game records all gameplay data, including players, winners, dates, and times.
Players can view the gameplay history from the main menu.

### AI
The game's AI is developed using the Minimax algorithm.
- The Minimax algorithm is used to find the best move for the AI by analyzing all possible game states.
- It selects the move that maximizes the AI's chances of winning (or minimizes the player's chances of winning).
- Function `findBestMove` calls Minimax to find the optimal move for the AI.

### Play with Friends via Socket
The game supports playing with friends via Socket, allowing real-time data transmission.
Players can use Socket to create game rooms, share room codes, and send move data.

## Setup Instructions
1. **Download Files**
   - Download the files.
   - Extract the downloaded ZIP file. You will get two folders: `client` and `server`.

2. **Install Packages**
   - Open a terminal in both the `client` and `server` folders.
   - Type `npm init` in the terminal of both folders.

3. **Run the Program**
   - In the terminal of the `client` folder, type `npm run dev`.
   - In the terminal of the `server` folder, type `npm start`.

4. **Check**
   - Go to the URL displayed in the terminal of the `client` folder and open it in your web browser.
