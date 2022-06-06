import React, {useState} from 'react';
import {render} from 'react-dom';
import InputNumberEditor from 'react-input-number-editor-more';
import LogContainer from './LogContainer';
import StatefulInputNumberEditor from './StatefulInputNumberEditor';
import './style.css';


function Demo() {
    const [logs, setLogs] = useState([]);
    const [externalChangeInputValue, setExternalChangeInputValue] = useState(0);

    const [show, setShow] = useState(false);
    const [clientY, setClientY] = useState(0);
    const [clientX, setClientX] = useState(0);
    const [moveNumbers, setMoveNumbers] = useState({
        movementX: 0,
        movementY: 0
    });
    const [moveYDistance, setMoveYDistance] = useState(0);
     const [doubleSpeed, setDoubleSpeed] = useState(1);

    function handleInputChange(value) {
        setLogs([...logs, 'Value changed to ' + value]);
    }

    function handleExternalChangeInputClick() {
        setExternalChangeInputValue(externalChangeInputValue + 1);
    }

    function handleExternalChangeInputChange(value) {
        setExternalChangeInputValue(value);
    }


    function justsc(info) {
        setMoveNumbers(info.moveNumbers);
    }

    useEffect(() => {
        const clientWidth = document.documentElement.clientWidth;
        if (clientX > clientWidth) {
            setClientX(0);
            return;
        }
        if (clientX < 0) {
            setClientX(clientWidth);
            return;
        }
        if (0 <= clientX <= clientWidth) {
            setClientX(clientX + moveNumbers.movementX);
        }
    }, [moveNumbers]);

    useEffect(() => {
        const clientHeight = document.documentElement.clientHeight;
        if (clientY > clientHeight) {
            setClientY(0);
            return;
        }
        if (clientY < 0) {
            setClientY(clientHeight);
            return;
        }
        if (0 <= clientY <= clientHeight) {
            setClientY(clientY + moveNumbers.movementY);
        }
    }, [moveNumbers]);
    useEffect(() => {
        setDoubleSpeed(Math.pow(2, +parseInt(-moveYDistance / 150)));
        setMoveYDistance(moveYDistance + moveNumbers.movementY);
    }, [moveNumbers]);

    function mouseDown(e) {
        setClientY(e.clientY);
        setClientX(e.clientX);
        setMoveYDistance(0);
        setShow(true);
    }

    function mouseUp(e) {
        setDoubleSpeed(1);
        setShow(false);
    }



    return (
        <>
            <h1>react-input-number-editor Demo</h1>
            <h2>Basic usage</h2>
            <InputNumberEditor value={0} />
            <h2>Lower slide modifier</h2>
            <InputNumberEditor value={0} slideModifier={0.1} />
            <h2>Using one way range (Minimum: 0)</h2>
            <InputNumberEditor value={0} min={0} />
            <h2>Using two ways range (Minimum: 0, Maximum: 100)</h2>
            <InputNumberEditor value={0} min={0} max={100} />
            <h2>Using precision</h2>
            <InputNumberEditor value={0} precision={1} />
            <h2>Using step and step modifier</h2>
            <InputNumberEditor value={0} step={10} stepModifier={5} />
            <h2>Listen to changes</h2>
            <StatefulInputNumberEditor
                value={0}
                precision={1}
                min={0}
                onChange={handleInputChange}
            />
            <LogContainer logs={logs} />
            <h2>External value change</h2>
            <InputNumberEditor
                value={externalChangeInputValue}
                onChange={handleExternalChangeInputChange}
            />
            <button onClick={handleExternalChangeInputClick}>Add</button>

          <h2>Use custom css classes</h2>
          <InputNumberEditor className={"bordered blue"} />
          <h2>Read only input</h2>
          <InputNumberEditor readOnly />

           <InputNumberEditor
                onMouseUp={mouseUp}
                onMouseDown={mouseDown}
                onMouseMove={justsc}
                className={'bordered blue'}
                stepModifier={10}
                // onChange={justsc}
                mouseSpeed={1.2}
                doubleSpeed={doubleSpeed}
            >
                { /* 鼠标放在div上拖动即可 */ }
                <div>新加ref</div>
            </InputNumberEditor>

            <div>Y轴控制速度：{doubleSpeed}</div>
            <div>Y轴移动的距离：{moveYDistance}</div>
            <div>{clientX}</div>
            <div>{clientY}</div>

            <div
                style={{
                    position: 'fixed',
                    display: `${show ? 'block' : 'none'}`,
                    top: clientY,
                    left: clientX,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                位置
            </div>
        </>
    );
}

render(<Demo />, document.querySelector('#root'));
