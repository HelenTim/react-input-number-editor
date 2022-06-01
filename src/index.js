import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

export const KEYS = {
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    ESC: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown'
};

function InputNumberEditor(props) {
    const {
        className,
        value,
        min,
        max,
        step,
        stepModifier,
        slideModifier,
        precision,
        readOnly,
        onChange,
        mouseSpeed,
        showInput,
        doubleSpeed,
        onMouseMove
    } = props;

    const [displayValue, setDisplayValue] = useState(formatValue(value));
    const [internalValue, setInternalValue] = useState(
        Number(formatValue(value))
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isPointerLocked, setIsPointerLocked] = useState(false);

    const [shiftKey, setShiftKey] = useState(false);
    const [ctrlKey, setCtrlKey] = useState(false);

    const selfRef = useRef();

    useEffect(() => {
        document.addEventListener(
            'pointerlockchange',
            handlePointerLockChange,
            false
        );
        document.addEventListener('keydown', handleKeyDown, false);
        document.addEventListener('keyup', handleKeyUp, false);
        return () => {
            document.removeEventListener(
                'pointerlockchange',
                handlePointerLockChange
            );
            document.removeEventListener('keyDown', handleKeyDown);
            document.removeEventListener('keyUp', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        changeValue(value, true, false);
    }, [value]);

    function handleMouseDown(event) {
        props.onMouseDown && props.onMouseDown(event);
        if (!isPointerLocked && !readOnly) selfRef.current.requestPointerLock();
    }
    function handleMouseUp(event) {
        props.onMouseUp && props.onMouseUp(event);
        if (isPointerLocked && !readOnly) document.exitPointerLock();
    }
    function handleMouseMove(event) {
        let { movementX, movementY } = event;
        let movementXnew = movementX;
        if (shiftKey) {
            movementXnew = movementX * stepModifier;
        } else if (ctrlKey) {
            movementXnew = movementX / stepModifier;
        }
        onMouseMove &&
            onMouseMove({
                moveNumbers: {
                    movementX: movementX * mouseSpeed,
                    movementY: movementY * mouseSpeed,
                },
                event
            });
        if (isPointerLocked && movementX) {
            addValue(
                movementXnew *
                    Math.pow(10, -precision) *
                    slideModifier *
                    doubleSpeed,
                true,
                event,
                {
                    movementX: movementX * mouseSpeed,
                    movementY: movementY * mouseSpeed
                }
            );
        }
    }
    function handleKeyDown(event) {
        const { key, shiftKey, ctrlKey } = event;
        setShiftKey(shiftKey);
        setCtrlKey(ctrlKey);
        if ((key === KEYS.ARROW_UP || key === KEYS.ARROW_DOWN) && !readOnly) {
            let value = step;
            if (shiftKey) value *= stepModifier;
            else if (ctrlKey) value /= stepModifier;
            if (key === KEYS.ARROW_DOWN) value = -value;
            addValue(value, true);
        } else if (key === KEYS.ENTER) {
            if (isEditing) confirmEditing();
        } else if (key === KEYS.ESC) {
            if (isEditing) cancelEditing();
            if (isPointerLocked) document.exitPointerLock();
        } else if (key === KEYS.BACKSPACE && isPointerLocked) {
            event.preventDefault();
        }
    }

    function handleKeyUp(event) {
        const { shiftKey, ctrlKey } = event;
        setShiftKey(shiftKey);
        setCtrlKey(ctrlKey);
    }

    function handleBlur() {
        cancelEditing();
    }

    function handlePointerLockChange() {
        const locked = document.pointerLockElement === selfRef.current;
        setIsPointerLocked(locked);
    }

    function handleChange(event) {
        const { target } = event;
        if (!isEditing) setIsEditing(true);
        onChange && onChange({
            newInternalValue: target.value, // 新值
            event, // 鼠标拖动事件对象
            moveNumbers: { movementX: 0, movementY: 0 } // 每一次x，y的偏移量
        });
        setDisplayValue(target.value);
    }

    function cancelEditing() {
        setIsEditing(false);
        setDisplayValue(formatValue(internalValue));
    }

    function confirmEditing() {
        if (isPointerLocked) document.exitPointerLock();
        if (isEditing) setIsEditing(false);

        changeValue(displayValue, true);
    }

    function changeValue(
        value,
        updateDisplay = false,
        triggerEvent = true,
        event,
        moveNumbers
    ) {
        if (typeof value !== 'number') value = Number(value);
        if (isNaN(value)) value = internalValue;

        let newValue = value;

        if (min !== undefined && newValue < min) newValue = min;
        else if (max !== undefined && newValue > max) newValue = max;

        if (updateDisplay || Number(displayValue) !== newValue)
            setDisplayValue(formatValue(newValue)); // 设置input的value值
        if (internalValue !== newValue) {
            const newInternalValue = Number(newValue.toFixed(precision)); // 返回给事件的值
            setInternalValue(newInternalValue);
            if (onChange && triggerEvent) {
                // 这里输出值是否发生变化
                onChange({
                    newInternalValue, // 新值
                    event, // 鼠标拖动事件对象
                    moveNumbers // 每一次x，y的偏移量
                });
            }
        }
    }

    function addValue(amount, updateDisplay, event, moveNumbers) {
        if (typeof amount !== 'number') amount = Number(amount);
        let newValue = internalValue + amount;

        changeValue(newValue, updateDisplay, true, event, moveNumbers);
    }

    function formatValue(value) {
        if (typeof value !== 'number') value = Number(value);
        return value.toFixed(precision);
    }

    const newProps = {
        ref: selfRef,
        value: displayValue,
        min: min,
        max: max,
        step: step,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        readOnly: readOnly,
        onChange: handleChange
    };
    if (className) {
        Object.assign(newProps, { className: className });
    }
    if (isEditing) {
        if (newProps.className) newProps.className += ' editing';
        else Object.assign(newProps, { className: 'editing' });
    }

    return props.children ? (
        <div className="sond">
            <div className="sonc" {...newProps}>
                {props.children}
            </div>
            {showInput && (
                <input onChange={handleChange} value={displayValue} />
            )}
        </div>
    ) : (
        <input {...newProps} />
    );
}

InputNumberEditor.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    precision: PropTypes.number,
    step: PropTypes.number,
    stepModifier: PropTypes.number,
    slideModifier: PropTypes.number,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    mouseSpeed: PropTypes.number,
    showInput: PropTypes.bool,
    doubleSpeed: PropTypes.number,
    onMouseMove: PropTypes.func
};
InputNumberEditor.defaultProps = {
    value: 0,
    step: 1,
    stepModifier: 10,
    slideModifier: 0.3,
    precision: 0,
    mouseSpeed: 1,
    showInput: true,
    doubleSpeed: 1
};

export default InputNumberEditor;
