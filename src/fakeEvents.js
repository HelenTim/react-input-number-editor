class FakeMouseEvent extends MouseEvent {
    offsetX;
    offsetY;
    pageX;
    pageY;
    x;
    y;

    constructor(type, values) {
        const { pageX, pageY, offsetX, offsetY, x, y, ...mouseValues } = values;
        super(type, mouseValues);

        Object.assign(this, {
            offsetX: offsetX || 0,
            offsetY: offsetY || 0,
            pageX: pageX || 0,
            pageY: pageY || 0,
            x: x || 0,
            y: y || 0
        });
    }
}

class FakeMouseMoveEvent extends FakeMouseEvent {
    constructor(values) {
        const { movementX, movementY, ...mouseValues } = values;
        super('mousemove', mouseValues);

        Object.assign(this, {
            movementX: movementX || 0,
            movementY: movementY || 0
        });
    }
}

export function getMouseEvent(type, values = {}) {
    values = {
        bubbles: true,
        cancelable: true,
        ...values
    };
    switch (type) {
        case 'mousemove':
            return new FakeMouseMoveEvent(values);
        default:
        // Not needed actually
        // return new FakeMouseEvent(type, values);
    }
}
