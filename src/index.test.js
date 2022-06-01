import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import InputNumberEditor from '.';
import { KEYS } from '.';
import { getMouseEvent } from './fakeEvents';

beforeEach(() => {
    Element.prototype.requestPointerLock = jest
        .fn()
        .mockImplementation(function() {
            document.pointerLockElement = this;
            document.dispatchEvent(new CustomEvent('pointerlockchange'));
        });
    document.exitPointerLock = jest.fn().mockImplementation(function() {
        document.pointerLockElement = null;
        document.dispatchEvent(new CustomEvent('pointerlockchange'));
    });
});

describe('InputNumberEditor', () => {
    it('should display an input with initial value', () => {
        const { container } = render(<InputNumberEditor value={10} />);
        const input = container.querySelector('input');

        expect(input.value).toEqual('10');
    });
    it('should not go beyond min and max props', () => {
        const { container } = render(
            <InputNumberEditor min={0} max={5} step={10} />
        );
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.keyDown(input, { key: KEYS.ARROW_DOWN });
        expect(input.value).toBe('0');

        fireEvent.keyDown(input, { key: KEYS.ARROW_UP });
        expect(input.value).toBe('5');

        fireEvent.change(input, { target: { value: '-10' } });
        fireEvent.keyDown(input, { key: KEYS.ENTER });
        expect(input.value).toBe('0');

        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.keyDown(input, { key: KEYS.ENTER });
        expect(input.value).toBe('5');
    });
    it('should increment on arrow up key down and decrement on arrow down key down according to step prop', () => {
        const { container } = render(<InputNumberEditor step={10} />);
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.keyDown(input, { key: KEYS.ARROW_UP });
        expect(input.value).toEqual('10');

        fireEvent.keyDown(input, { key: KEYS.ARROW_DOWN });
        fireEvent.keyDown(input, { key: KEYS.ARROW_DOWN });
        expect(input.value).toEqual('-10');
    });
    it('should change value on arrow up/down and ctrl or shift key down according to step modifier prop', () => {
        const { container } = render(
            <InputNumberEditor value={0} stepModifier={10} precision={1} />
        );
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.keyDown(input, { key: KEYS.ARROW_UP, shiftKey: true });
        expect(input.value).toEqual('10.0');

        fireEvent.keyDown(input, {
            key: KEYS.ARROW_DOWN,
            ctrlKey: true
        });
        expect(input.value).toEqual('9.9');
    });
    it('should change value on drag', () => {
        const { container } = render(<InputNumberEditor slideModifier={1} />);
        const input = container.querySelector('input');
        fireEvent.mouseDown(input);
        expect(input.requestPointerLock).toHaveBeenCalledTimes(1);

        fireEvent(
            input,
            getMouseEvent('mousemove', {
                movementX: 10
            })
        );

        fireEvent.mouseUp(input);
        expect(document.exitPointerLock).toHaveBeenCalledTimes(1);

        expect(input.value).toEqual('10');
    });
    it('should change value from external value prop change', () => {
        const callback = jest.fn();
        const { container, rerender } = render(
            <InputNumberEditor value={10} onChange={callback} />
        );
        rerender(<InputNumberEditor value={100} onChange={callback} />);

        const input = container.querySelector('input');
        expect(input.value).toBe('100');
    });
    it('should reset value on escape or blur', () => {
        const { container } = render(<InputNumberEditor value={5} />);
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.change(input, { target: { value: '-1' } });
        fireEvent.keyDown(input, { key: KEYS.ESC });

        expect(input.value).toEqual('5');

        fireEvent.change(input, { target: { value: '-1' } });
        fireEvent.blur(input);
        expect(input.value).toEqual('5');
    });
    it('should cancel pointer lock on escape', () => {
        const { container } = render(<InputNumberEditor />);
        const input = container.querySelector('input');
        fireEvent.mouseDown(input);
        expect(input.requestPointerLock).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(input, { key: KEYS.ESC });
        expect(document.pointerLockElement).toBeNull();
    });
    it('should not clear on backspace when pointer is locked', () => {
        const { container } = render(<InputNumberEditor value={10} />);
        const input = container.querySelector('input');
        fireEvent.mouseDown(input);
        fireEvent.keyDown(input, { key: KEYS.BACKSPACE });

        expect(input.value).toBe('10');
    });
    it('should set className editing when in editing mode', () => {
        const { container } = render(<InputNumberEditor />);
        const input = container.querySelector('input');
        expect(input.classList.contains('editing')).toBeFalsy();

        fireEvent.click(input);
        fireEvent.change(input, { target: { value: '10' } });
        expect(input.classList.contains('editing')).toBeTruthy();
    });
    it('should call onChange', () => {
        const callback = jest.fn();
        const { container } = render(
            <InputNumberEditor
                value={5}
                slideModifier={1}
                onChange={callback}
            />
        );
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.change(input, { target: { value: '100' } });
        fireEvent.keyDown(input, { key: KEYS.ENTER });

        expect(callback).toHaveBeenCalledWith(100);
        callback.mockClear();

        fireEvent.mouseDown(input);
        fireEvent(
            input,
            getMouseEvent('mousemove', {
                movementX: 50
            })
        );
        expect(callback).toHaveBeenCalledWith(150);
    });
    it('should not call onChange', () => {
        const callback = jest.fn();
        const { container, rerender } = render(
            <InputNumberEditor value={5} onChange={callback} />
        );
        const input = container.querySelector('input');

        fireEvent.click(input);
        fireEvent.change(input, { target: { value: '100' } });
        fireEvent.keyDown(input, { key: KEYS.ESC });

        expect(callback).not.toHaveBeenCalled();
        callback.mockClear();

        rerender(
            <InputNumberEditor
                value={10}
                slideModifier={1}
                onChange={callback}
            />
        );
        expect(callback).not.toHaveBeenCalled();
    });
    it('should set class names', () => {
        const { container } = render(
            <InputNumberEditor className={'bordered blue'} />
        );
        const input = container.querySelector('input');
        expect(input.className).toBe('bordered blue');

        fireEvent.click(input);
        fireEvent.change(input, { target: { value: 10 } });

        expect(input.className).toBe('bordered blue editing');
    });
    it('should be read only', () => {
        const { container } = render(<InputNumberEditor readOnly />);
        const input = container.querySelector('input');

        fireEvent.mouseDown(input);
        fireEvent(
            input,
            getMouseEvent('mousemove', {
                movementX: 10
            })
        );
        fireEvent.mouseUp(input);
        expect(input.value).toBe('0');

        fireEvent.click(input);
        fireEvent.keyDown(input, { key: KEYS.ARROW_UP });
        expect(input.value).toBe('0');

        fireEvent.keyDown(input, { key: KEYS.BACKSPACE });
        expect(input.value).toBe('0');
    });
});
