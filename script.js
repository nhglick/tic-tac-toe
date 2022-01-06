const doneModal = document.querySelector('#done-modal');
const playerNames = [];
let userTurn = 1;

const module = () => {
    const options = ['O', 'X'];
    let editable = true;
    let value = '';

    const associatedDiv = document.createElement('div');
    associatedDiv.classList.add('module');

    associatedDiv.addEventListener('click', () => {
        if (editable) {
            updateValue(options[userTurn % 2]);
            editable = false;
            swapPlayer();
        }
    });

    const updateValue = (newValue) => {
        value = newValue;
        associatedDiv.innerHTML = `<p>${newValue}</p>`;
    };

    const swapPlayer = () => {
        const players = document.querySelectorAll('.player-turn > p');
        for (const player of players)
            player.classList.toggle('inactive');
        userTurn++;
    };

    const getValue = () => value;
    const getAssociatedDiv = () => associatedDiv;
    const setEditable = (bool) => editable = bool;
    const updateClass = (newClass) => associatedDiv.classList.add(newClass);
    
    return {
        getValue,
        updateValue,
        updateClass,
        setEditable,
        getAssociatedDiv
    };
}



const board = (() => {
    const containerDiv = document.querySelector('.board-container');

    let winningSymbol = '';
    
    let winningModules = [];
    let moduleArray = [];

    const deleteBoard = () => {
        const allDivs = Array.from(document.querySelectorAll('.board-container > .module'));
        for (const div of allDivs) 
            div.remove();

        moduleArray = [];
    }

    const createBoard = () => {
        for (let i = 0; i < 9; i ++) {
            moduleArray.push(module());
            containerDiv.appendChild(moduleArray[i].getAssociatedDiv());
        }
    };


    const winningEdits = () => {
        for (eachModule of winningModules)
            eachModule.updateClass('winning');

        for (eachModule of moduleArray)
            eachModule.setEditable(false);
    };


    const anyNull = () => {
        for (eachModule of moduleArray)
            if (eachModule.getValue() === '')
                return true;

        return false;
    };


    const checkIfWin = () => {
        // check vertical win
        for (let i = 0; i < 3; i ++) {
            if (moduleArray[i].getValue() === '')
                continue;

            if (moduleArray[i].getValue() === moduleArray[i+3].getValue())
                if (moduleArray[i+3].getValue() === moduleArray[i+6].getValue()) {
                    winningModules = [moduleArray[i], moduleArray[i+3], moduleArray[i+6]];
                    winningSymbol = moduleArray[i].getValue();
                    return true;
                }
        }


        // check horizontal win
        for (let i = 0; i < 7; i += 3) {
            if (moduleArray[i].getValue() === '')
                continue;
                
            else if (moduleArray[i].getValue() === moduleArray[i+1].getValue())
                if (moduleArray[i+1].getValue() === moduleArray[i+2].getValue()) {
                    winningModules = [moduleArray[i], moduleArray[i+1], moduleArray[i+2]];
                    winningSymbol = moduleArray[i].getValue();
                    return true;
                }
        }


        // check diagonal wins
        if (moduleArray[0].getValue() !== '')
            if (moduleArray[0].getValue() === moduleArray[4].getValue())
                if (moduleArray[4].getValue() === moduleArray[8].getValue()) {
                    winningModules = [moduleArray[0], moduleArray[4], moduleArray[8]];
                    winningSymbol = moduleArray[0].getValue();
                    return true;
                }

        else if (moduleArray[2].getValue() !== '')    
            if (moduleArray[2].getValue() === moduleArray[4].getValue())
                if (moduleArray[4].getValue() === moduleArray[6].getValue()) {
                    winningModules = [moduleArray[2], moduleArray[4], moduleArray[6]];
                    winningSymbol = moduleArray[2].getValue();
                    return true;
                }

        // fallback
        return false;
    };

    const getWinningSymbol = () => winningSymbol;

    return {
        anyNull,
        getWinningSymbol,
        checkIfWin,
        winningEdits,
        deleteBoard, 
        createBoard
    };
})();


window.addEventListener('click', () => {
    if (board.checkIfWin()) {
        let winningPlayer;
        board.winningEdits();

        doneModal.style.display = 'block';
        board.getWinningSymbol() === 'X' ? winningPlayer = 1 : winningPlayer = 2;

        if (winningPlayer === 1)
            doneModal.querySelector('.modal-content > #winner').textContent = `Winner: ${playerNames[0]}`;
        else
            doneModal.querySelector('.modal-content > #winner').textContent = `Winner: ${playerNames[1]}`;
    }

    if (!board.checkIfWin() && !board.anyNull()) {
        doneModal.style.display = 'block';
        doneModal.querySelector('.modal-content > #winner').textContent = "It's a tie!";
    }
});


submitButton = document.querySelector('#submit');
submitButton.addEventListener('click', () => {
    playerNames.push(document.querySelector('#player-1-name').value);
    playerNames.push(document.querySelector('#player-2-name').value);

    document.querySelector("#player-1-display > em").textContent = `${playerNames[0]}'s turn`;
    document.querySelector("#player-2-display > em").textContent = `${playerNames[1]}'s turn`;

    document.querySelector('#start-modal').style.display = 'none';
    board.createBoard();
});


restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', () => {
    board.deleteBoard();
    board.createBoard();
    doneModal.style.display = 'none';
});