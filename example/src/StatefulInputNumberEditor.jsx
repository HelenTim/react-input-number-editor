import React, { useState } from 'react';
import InputNumberEditor from 'react-input-number-editor';

function StatefulInputNumberEditor(props) {
    const { onChange } = props;
    const [value, setValue] = useState(props.value || 0);

    function handleChange(value) {
        setValue(value);

        if (onChange) onChange(value);
    }

    return (
        <InputNumberEditor {...props} value={value} onChange={handleChange} />
    );
}

export default StatefulInputNumberEditor;
