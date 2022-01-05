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
    const moduleArray = [];

    let winningModules = [];

    for (let i = 0; i < 9; i ++) {
        moduleArray.push(module());
        containerDiv.appendChild(moduleArray[i].getAssociatedDiv());
    }

    const winningEdits = () => {
        for (eachModule of winningModules)
            eachModule.updateClass('winning');

        for (eachModule of moduleArray)
            eachModule.setEditable(false);
    };

    const checkIfWin = () => {
        // check vertical win
        for (let i = 0; i < 3; i ++) {
            if (moduleArray[i].getValue() === '')
                continue;

            if (moduleArray[i].getValue() === moduleArray[i+3].getValue())
                if (moduleArray[i+3].getValue() === moduleArray[i+6].getValue()) {
                    winningModules = [moduleArray[i], moduleArray[i+3], moduleArray[i+6]];
                    return true;
                }
        }

        // check horizontal win
        for (let i = 0; i < 7; i += 3) {
            if (moduleArray[i].getValue() === '')
                continue;
                
            if (moduleArray[i].getValue() === moduleArray[i+1].getValue())
                if (moduleArray[i+1].getValue() === moduleArray[i+2].getValue()) {
                    winningModules = [moduleArray[i], moduleArray[i+1], moduleArray[i+2]];
                    return true;
                }
        }

        // check diagonal wins
        if (moduleArray[0].getValue() !== '')
            if (moduleArray[0].getValue() === moduleArray[4].getValue())
                if (moduleArray[4].getValue() === moduleArray[8].getValue()) {
                    winningModules = [moduleArray[0], moduleArray[4], moduleArray[8]];
                    return true;
                }

        if (moduleArray[6].getValue() !== '')    
            if (moduleArray[6].getValue() === moduleArray[4].getValue())
                if (moduleArray[4].getValue() === moduleArray[2].getValue()) {
                    winningModules = [moduleArray[6], moduleArray[4], moduleArray[2]];
                    return true;
                }

        return false;
    };

    return {
        moduleArray,
        winningModules,
        checkIfWin,
        winningEdits
    };
})();


window.addEventListener('click', () => {
    if (board.checkIfWin())
        board.winningEdits();
});