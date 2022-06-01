import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.css';

function LogContainer({ logs }) {
    const selfRef = useRef();

    useEffect(() => {
        if (selfRef.current)
            selfRef.current.scrollTop = selfRef.current.scrollHeight;
    }, [logs, selfRef]);

    function getLogList() {
        return logs.map((log, index) => <span key={index}>{log}</span>);
    }

    return (
        <div ref={selfRef} className="log-container">
            {getLogList()}
        </div>
    );
}
LogContainer.propTypes = {
    logs: PropTypes.arrayOf(PropTypes.string)
};
LogContainer.defaultProps = {
    logs: []
};

export default LogContainer;
