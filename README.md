# react-input-number-editor

> React component that act like adobe suite editor number input field that can be slided.

[![Gitlab pipeline status (branch)](https://img.shields.io/gitlab/pipeline/Vinarnt/react-input-number-editor/master)](https://gitlab.com/Vinarnt/react-input-number-editor/commits/master)
[![coverage report](https://gitlab.com/Vinarnt/react-input-number-editor/badges/master/coverage.svg)](https://vinarnt.gitlab.io/react-input-number-editor/coverage/lcov-report)
[![npm](https://img.shields.io/npm/v/react-input-number-editor)](https://www.npmjs.com/package/react-input-number-editor)

## Demo

![Preview Image](https://gitlab.com/Vinarnt/react-input-number-editor/raw/master/resources/preview.gif 'Preview')

Live demo available [here](https://vinarnt.gitlab.io/react-input-number-editor)

## Features

-   Mouse lock on drag
-   Custom number decimal precision
-   Manual editing of the input
-   Editing cancellation
-   Increment/decrement the value with arrow up and arrow down key
-   Use ctrl and shift key to increment/decrement the value with higher/lesser step
-   Change the value from external event
-   Customize the step modifier for ctrl and shift key
-   Customize the slide modifier for dragging accuracy

## Install

```bash
$ npm install --save react-input-number-editor
```

Or

```bash
$ yarn add react-input-number-editor
```

## Example

```jsx
import React, { useState } from 'react';

import InputNumberEditor from 'react-input-number-editor';

function Example() {
    const [value, setValue] = useState(0);

    function handleChange(value) {
        setValue(value);
    }

    return (
        <InputNumberEditor
            value={value}
            min={0}
            max={100}
            precision={1}
            onChange={handleChange}
        />
    );
}
```

## Usage

| Prop          | Description                                             | Type      | Default   | Required | 
| ------------  | ------------------------------------------------------- | --------- | --------- | -------- |
| value         | The value to set the input to                           | number    | 0         | Yes      |
| min           | The minimum value reachable                             | number    | -         | No       |
| max           | The maximum value reachable                             | number    | -         | No       |
| precision     | Number of decimals                                      | number    | 0         | No       |
| step          | Number of the stepping                                  | number    | 1         | No       |
| stepModifier  | Modifier for the stepping (Ctrl and Shift key)          | number    | 10        | No       |
| slideModifier | Modifier for the sliding/dragging mode                  | string    | 0.3       | No       |
| onChange      | Callback called on value change                         | func      | () => ()  | No       |

## License

MIT © [Vinarnt](https://gitlab.com/Vinarnt)
